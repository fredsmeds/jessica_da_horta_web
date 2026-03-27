#!/usr/bin/env python3
"""
Jessica da Horta Garden Design — PDF Generator & Email Sender
Generates a professional visit request PDF and sends it via Resend API.

Usage:
    python generate_and_send.py form_data.json

Dependencies:
    pip install reportlab requests Pillow

Environment variables (or .env file):
    RESEND_API_KEY   — Resend API key
    JESSICA_EMAIL    — override recipient (default: jessicadhg.pais.agem@gmail.com)
"""

import json
import sys
import os
import base64
import math
import tempfile
from datetime import datetime
from io import BytesIO

import requests
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle,
    Spacer, Image as RLImage, PageBreak, HRFlowable
)
from reportlab.pdfgen import canvas as pdfcanvas

# ── Constants ─────────────────────────────────────────────────────────────────

JESSICA_LAT = 38.71605105146495
JESSICA_LNG = -9.415024799281479
PRIMARY = HexColor('#555b37')
LIGHT_TEXT = Color(0.46, 0.46, 0.43)
DARK_TEXT = Color(0.1, 0.1, 0.09)
BORDER = Color(0.88, 0.88, 0.86)
OFF_WHITE = Color(0.97, 0.97, 0.96)

JESSICA_EMAIL = os.environ.get('JESSICA_EMAIL', 'jessicadhg.pais.agem@gmail.com')
FROM_EMAIL = 'noreply@jessicadahorta.com'
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')

PAGE_W, PAGE_H = A4
MARGIN = 2 * cm
CONTENT_W = PAGE_W - 2 * MARGIN

LOGO_PATH = os.path.join(os.path.dirname(__file__), '..', 'images', 'isotipo_white.webp')

SVC_LABELS = {
    '1A': '1A — Consultoria Simples',
    '1B': '1B — Consultoria Avançada',
    '2A': '2A — Design Simples de Jardim',
    '2B': '2B — Projeto Completo com Partes Técnicas',
    '2C': '2C — Licenciamento Municipal',
    '3': '3 — Instalação e Monitorização',
    '4': '4 — Gestão e Manutenção',
}

# ── Geo helpers ───────────────────────────────────────────────────────────────

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = math.sin(d_lat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def geocode_address(address, postal_code):
    try:
        q = f"{address} {postal_code} Portugal"
        resp = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={'q': q, 'format': 'json', 'limit': 1},
            headers={'User-Agent': 'JessicaDaHortaGardenDesign/1.0'},
            timeout=6,
        )
        results = resp.json()
        if results:
            return float(results[0]['lat']), float(results[0]['lon'])
    except Exception:
        pass
    return None, None

# ── PDF helpers ───────────────────────────────────────────────────────────────

def yn(v):
    return 'Sim' if v == 'yes' else ('Não' if v == 'no' else '—')

def val(v):
    return str(v) if v else '—'

def arr(v):
    return ', '.join(v) if isinstance(v, list) and v else '—'


class NumberedCanvas(pdfcanvas.Canvas):
    """Canvas that adds header/footer to every page."""

    def __init__(self, *args, logo_path=None, **kwargs):
        super().__init__(*args, **kwargs)
        self._pages = []
        self._logo_path = logo_path

    def showPage(self):
        self._pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._pages)
        for i, page in enumerate(self._pages, 1):
            self.__dict__.update(page)
            self._draw_page(i, total)
            super().showPage()
        super().save()

    def _draw_page(self, num, total):
        # Header bar
        self.setFillColor(PRIMARY)
        self.rect(0, PAGE_H - 2.2 * cm, PAGE_W, 2.2 * cm, fill=1, stroke=0)

        # Logo
        if self._logo_path and os.path.exists(self._logo_path):
            try:
                self.drawImage(
                    self._logo_path,
                    MARGIN, PAGE_H - 2.0 * cm,
                    width=1.6 * cm, height=1.6 * cm,
                    preserveAspectRatio=True, mask='auto',
                )
            except Exception:
                pass

        # Header text
        self.setFillColor(white)
        self.setFont('Helvetica', 12)
        self.drawString(MARGIN + 2.0 * cm, PAGE_H - 1.15 * cm, 'Jessica da Horta Garden Design')
        self.setFont('Helvetica', 8)
        self.setFillColor(Color(0.8, 0.84, 0.73))
        self.drawString(MARGIN + 2.0 * cm, PAGE_H - 1.75 * cm, 'Pedido de Visita Técnica')

        # Footer line
        self.setStrokeColor(BORDER)
        self.setLineWidth(0.3)
        self.line(MARGIN, 1.6 * cm, PAGE_W - MARGIN, 1.6 * cm)

        # Footer text
        self.setFillColor(LIGHT_TEXT)
        self.setFont('Helvetica', 7.5)
        self.drawString(MARGIN, 1.1 * cm, 'jessicadahorta.com')
        self.drawRightString(PAGE_W - MARGIN, 1.1 * cm, f'{num} / {total}')


# ── PDF generation ────────────────────────────────────────────────────────────

def generate_pdf(data, output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        topMargin=2.8 * cm,
        bottomMargin=2.2 * cm,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
    )

    styles = getSampleStyleSheet()
    section_style = ParagraphStyle(
        'section', fontName='Helvetica-Bold', fontSize=8,
        textColor=PRIMARY, spaceBefore=14, spaceAfter=4,
        letterSpacing=1.2,
    )
    label_style = ParagraphStyle('label', fontName='Helvetica', fontSize=8, textColor=LIGHT_TEXT)
    value_style = ParagraphStyle('value', fontName='Helvetica', fontSize=9, textColor=DARK_TEXT)
    hint_style = ParagraphStyle('hint', fontName='Helvetica-Oblique', fontSize=8, textColor=LIGHT_TEXT)

    story = []

    # Submission date
    story.append(Paragraph(
        f'<font color="#969690" size="8">Submetido em {datetime.now().strftime("%d/%m/%Y")}</font>',
        ParagraphStyle('date', fontName='Helvetica', fontSize=8, textColor=LIGHT_TEXT, alignment=TA_RIGHT)
    ))
    story.append(Spacer(1, 0.4 * cm))

    def add_section(title):
        story.append(Paragraph(title.upper(), section_style))
        story.append(HRFlowable(width='100%', thickness=0.4, color=PRIMARY, spaceAfter=4))

    def add_row(label, value):
        if not value or value == '—':
            return
        table = Table(
            [[Paragraph(label, label_style), Paragraph(str(value), value_style)]],
            colWidths=[5.5 * cm, CONTENT_W - 5.5 * cm],
        )
        table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
            ('TOPPADDING', (0, 0), (-1, -1), 2),
            ('LINEBELOW', (0, 0), (-1, -1), 0.3, BORDER),
        ]))
        story.append(table)

    # 1. Client Info
    add_section('1. Informação do Cliente')
    add_row('Nome', val(data.get('fullName')))
    add_row('Telefone', val(data.get('phone')))
    add_row('Email', val(data.get('email')))
    add_row('Morada', val(data.get('address')))
    add_row('Código Postal', val(data.get('postalCode')))
    km = data.get('distanceKm')
    fee = data.get('travelFee', 0)
    if km:
        add_row('Distância estimada', f'{km} km')
        if fee and fee > 0:
            add_row('Taxa de deslocação', f'45€ base + {fee}€ extra (+{km - 50} km × 0,40€)')
        else:
            add_row('Taxa de deslocação', f'45€ base — dentro do raio de 50 km ({km} km)')
    story.append(Spacer(1, 0.3 * cm))

    # 2. Location
    add_section('2. Detalhes da Localização')
    add_row('Área total (m²)', val(data.get('totalArea')))
    add_row('Área de intervenção (m²)', val(data.get('interventionArea')))
    add_row('Limites de intervenção', val(data.get('limits')))
    add_row('Levantamento topográfico', yn(data.get('topo')))
    if data.get('topo') == 'yes':
        add_row('Formato do levantamento', val(data.get('topoFormat')))
        if data.get('topoFile'):
            add_row('Ficheiro topográfico', data['topoFile'].get('name', '—'))
    add_row('Construções no local', yn(data.get('constructions')))
    if data.get('constructions') == 'yes':
        add_row('Descrição das construções', val(data.get('constructionsDesc')))
        imgs = data.get('constructionImages', [])
        if imgs:
            add_row('Fotos de construções', f'{len(imgs)} ficheiro(s) — ver anexos')
    story.append(Spacer(1, 0.3 * cm))

    # 3. Soil & Water
    add_section('3. Condições de Solo e Água')
    add_row('Análise de solo', yn(data.get('soilAnalysis')))
    add_row('Análise de água', yn(data.get('waterAnalysis')))
    add_row('Fontes de água', arr(data.get('waterSources', [])))
    add_row('Capacidade de armazenamento', val(data.get('waterStorage')))
    if data.get('rainwaterImage'):
        add_row('Foto do depósito', data['rainwaterImage'].get('name', '—'))
    story.append(Spacer(1, 0.3 * cm))

    # 4. Pets
    add_section('4. Fauna Doméstica')
    add_row('Animais domésticos', yn(data.get('hasPets')))
    if data.get('hasPets') == 'yes':
        add_row('Espécies/quantidade', val(data.get('petsDesc')))
        add_row('Acesso à área de plantação', yn(data.get('petsAccess')))
    story.append(Spacer(1, 0.3 * cm))

    # 5. Garden Prefs
    add_section('5. Preferências de Jardim')
    add_row('Estilo de plantação', val(data.get('plantingStyle')))
    add_row('Estilo de caminhos/formas', val(data.get('pathStyle')))
    add_row('Tipos de plantas', arr(data.get('plantTypes', [])))
    add_row('Cores preferidas', val(data.get('colors')))
    add_row('Elementos desejados', arr(data.get('desiredElements', [])))
    story.append(Spacer(1, 0.3 * cm))

    # 6. Services
    add_section('6. Serviços Pretendidos')
    svc = data.get('serviceType', '')
    add_row('Tipo de serviço', SVC_LABELS.get(svc, svc) or '—')
    story.append(Spacer(1, 0.3 * cm))

    # 7. Timeframes
    add_section('7. Calendário e Visita')
    add_row('Época de instalação', val(data.get('installation')))
    add_row('Prioridades de orçamento', val(data.get('priorities')))
    add_row('Descrição adicional', val(data.get('additionalDesc')))
    add_row('Data preferida para visita', val(data.get('preferredDate')))
    add_row('Preferência de horário', val(data.get('preferredTime')))
    story.append(Spacer(1, 0.3 * cm))

    # 8. Maintenance
    add_section('8. Manutenção Atual')
    add_row('Equipa de manutenção existente', yn(data.get('maintenanceTeam')))
    if data.get('maintenanceTeam') == 'yes':
        add_row('Detalhes da manutenção', val(data.get('maintenanceDetails')))
    story.append(Spacer(1, 0.3 * cm))

    # 9. Observations
    add_section('9. Observações Adicionais')
    add_row('Observações', val(data.get('observations')))

    # Images appendix
    image_files = []
    for key in ['topoFile', 'rainwaterImage']:
        f = data.get(key)
        if f and f.get('type', '').startswith('image/'):
            image_files.append(f)
    for key in ['constructionImages', 'interventionImages']:
        for f in data.get(key, []):
            if f.get('type', '').startswith('image/'):
                image_files.append(f)

    if image_files:
        story.append(PageBreak())
        add_section('Fotografias Anexadas')
        for f in image_files:
            try:
                raw = f.get('data', '')
                if ',' in raw:
                    raw = raw.split(',')[1]
                img_bytes = base64.b64decode(raw)
                img_buf = BytesIO(img_bytes)
                pil_img = PILImage.open(img_buf)
                # Resize if needed
                max_w = CONTENT_W
                max_h = 10 * cm
                w, h = pil_img.size
                scale = min(max_w / w, max_h / h, 1.0)
                rl_img = RLImage(BytesIO(img_bytes), width=w * scale, height=h * scale)
                story.append(rl_img)
                story.append(Paragraph(f.get('name', ''), hint_style))
                story.append(Spacer(1, 0.5 * cm))
            except Exception as e:
                print(f"  Warning: could not embed image {f.get('name', '?')}: {e}")

    logo = LOGO_PATH if os.path.exists(LOGO_PATH) else None
    doc.build(story, canvasmaker=lambda *a, **kw: NumberedCanvas(*a, logo_path=logo, **kw))
    print(f'PDF generated: {output_path}')


# ── Email helpers ─────────────────────────────────────────────────────────────

def build_jessica_html(data):
    yn_map = {'yes': 'Sim', 'no': 'Não'}
    svc = data.get('serviceType', '')
    km = data.get('distanceKm')
    fee = data.get('travelFee', 0)
    travel = ''
    if km:
        travel_val = (f'45€ base + {fee}€ extra ({km} km)' if fee and fee > 0
                      else f'45€ base — dentro do raio de 50 km ({km} km)')
        travel = f'<tr><td style="...">Taxa de deslocação</td><td>{travel_val}</td></tr>'

    return f"""
    <div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;color:#1a1a18;">
      <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
        <h1 style="color:white;font-size:18px;font-weight:400;margin:0;">Jessica da Horta Garden Design</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.1em;">Novo Pedido de Visita Técnica</p>
      </div>
      <div style="padding:0 32px 32px;">
        <p><strong>Nome:</strong> {data.get('fullName','—')}</p>
        <p><strong>Email:</strong> {data.get('email','—')}</p>
        <p><strong>Telefone:</strong> {data.get('phone','—')}</p>
        <p><strong>Morada:</strong> {data.get('address','—')}, {data.get('postalCode','—')}</p>
        {f'<p><strong>Distância:</strong> {km} km</p>' if km else ''}
        <p><strong>Serviço pretendido:</strong> {SVC_LABELS.get(svc, svc) or '—'}</p>
        {f'<p><strong>Data preferida:</strong> {data.get("preferredDate","")} {data.get("preferredTime","")}</p>' if data.get('preferredDate') else ''}
        <p style="font-size:13px;color:#555b37;margin-top:24px;">PDF completo em anexo.</p>
      </div>
    </div>"""


def build_client_html(data):
    svc = data.get('serviceType', '')
    return f"""
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a18;">
      <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
        <h1 style="color:white;font-size:18px;font-weight:400;margin:0;">Jessica da Horta Garden Design</h1>
      </div>
      <div style="padding:0 32px 32px;">
        <p style="font-size:16px;margin-bottom:16px;">Olá {data.get('fullName','')},</p>
        <p style="font-size:15px;line-height:1.7;color:#5a5a52;">
          O seu pedido de visita técnica foi enviado com sucesso.<br>
          Será contactado brevemente para confirmar a data e hora da visita.
        </p>
        <div style="background:#f8f7f4;border-left:3px solid #555b37;padding:16px 20px;margin:24px 0;">
          <p style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Serviço solicitado</p>
          <p style="font-size:14px;color:#1a1a18;margin:0;">{SVC_LABELS.get(svc, svc) or '—'}</p>
        </div>
        <p style="font-size:13px;color:#aaa;">Em anexo encontra o resumo do seu pedido em formato PDF.</p>
        <p style="font-size:14px;color:#888;margin-top:32px;">— Jessica da Horta Garden Design</p>
      </div>
    </div>"""


def send_emails(data, pdf_path):
    if not RESEND_API_KEY:
        print('ERROR: RESEND_API_KEY not set. Skipping email send.')
        return

    with open(pdf_path, 'rb') as f:
        pdf_b64 = base64.b64encode(f.read()).decode('utf-8')

    full_name = data.get('fullName', 'cliente').replace(' ', '_')
    pdf_attachment = [{
        'filename': f'Visita_JessicaDaHorta_{full_name}.pdf',
        'content': pdf_b64,
    }]

    # Extra file attachments (images, topo file)
    extra_attachments = []
    for key in ['constructionImages', 'interventionImages']:
        for f in data.get(key, []):
            raw = f.get('data', '')
            if ',' in raw:
                raw = raw.split(',')[1]
            extra_attachments.append({'filename': f.get('name', 'image.jpg'), 'content': raw})
    for key in ['rainwaterImage', 'topoFile']:
        f = data.get(key)
        if f:
            raw = f.get('data', '')
            if ',' in raw:
                raw = raw.split(',')[1]
            extra_attachments.append({'filename': f.get('name', 'file'), 'content': raw})

    headers = {'Authorization': f'Bearer {RESEND_API_KEY}', 'Content-Type': 'application/json'}

    # Send to Jessica
    jessica_payload = {
        'from': f'Jessica da Horta Garden Design <{FROM_EMAIL}>',
        'to': [JESSICA_EMAIL],
        'subject': f"[Visita] Pedido de agendamento — {data.get('fullName', '')}",
        'html': build_jessica_html(data),
        'reply_to': data.get('email', ''),
        'attachments': pdf_attachment + extra_attachments,
    }
    r = requests.post('https://api.resend.com/emails', headers=headers, json=jessica_payload)
    print(f'Jessica email: {r.status_code} {r.text}')

    # Send confirmation to client
    client_email = data.get('email')
    if client_email:
        client_payload = {
            'from': f'Jessica da Horta Garden Design <{FROM_EMAIL}>',
            'to': [client_email],
            'subject': 'O seu pedido de visita foi enviado — Jessica da Horta Garden Design',
            'html': build_client_html(data),
            'attachments': pdf_attachment,
        }
        r2 = requests.post('https://api.resend.com/emails', headers=headers, json=client_payload)
        print(f'Client email: {r2.status_code} {r2.text}')


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python generate_and_send.py form_data.json')
        sys.exit(1)

    with open(sys.argv[1], encoding='utf-8') as f:
        form_data = json.load(f)

    # Geocode if distance not already calculated
    if not form_data.get('distanceKm'):
        print('Geocoding address...')
        lat, lon = geocode_address(form_data.get('address', ''), form_data.get('postalCode', ''))
        if lat is not None:
            km = round(haversine(JESSICA_LAT, JESSICA_LNG, lat, lon))
            extra_km = max(0, km - 50)
            form_data['distanceKm'] = km
            form_data['travelFee'] = round(extra_km * 0.40, 2)
            print(f'  Distance: {km} km, extra fee: {form_data["travelFee"]}€')
        else:
            print('  Could not geocode address.')

    # Generate PDF
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
        pdf_path = tmp.name

    generate_pdf(form_data, pdf_path)

    # Send emails
    send_emails(form_data, pdf_path)

    # Cleanup
    os.unlink(pdf_path)
    print('Done.')
