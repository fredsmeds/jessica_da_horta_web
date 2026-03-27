import jsPDF from 'jspdf'

const JESSICA_LAT = 38.71605105146495
const JESSICA_LNG = -9.415024799281479

// Convert any image src (URL or base64 dataURL) to PNG dataURL via canvas
// Always resolves (never rejects) — returns null on any failure
function toCanvasPng(src) {
  return new Promise(resolve => {
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        try {
          const c = document.createElement('canvas')
          c.width = img.naturalWidth
          c.height = img.naturalHeight
          c.getContext('2d').drawImage(img, 0, 0)
          resolve(c.toDataURL('image/png'))
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => resolve(null)
      img.src = src
    } catch {
      resolve(null)
    }
  })
}

function yn(v) { return v === 'yes' ? 'Sim' : v === 'no' ? 'Não' : '—' }
function val(v) { return v || '—' }
function arr(v) { return Array.isArray(v) && v.length ? v.join(', ') : '—' }

const SVC_LABELS = {
  '1A': '1A — Consultoria Simples',
  '1B': '1B — Consultoria Avançada',
  '2A': '2A — Design Simples de Jardim',
  '2B': '2B — Projeto Completo com Partes Técnicas',
  '2C': '2C — Licenciamento Municipal',
  '3': '3 — Instalação e Monitorização',
  '4': '4 — Gestão e Manutenção',
}

export async function generatePdf(data) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const W = 210, H = 297, M = 18
  const CW = W - 2 * M
  let y = 0

  // Load logo — use absolute URL and impose a 3-second timeout so a
  // failed image load never blocks or crashes the PDF generation
  let logo = null
  try {
    const logoUrl = (typeof window !== 'undefined' ? window.location.origin : '') + '/isotipo_white.webp'
    logo = await Promise.race([
      toCanvasPng(logoUrl),
      new Promise(r => setTimeout(() => r(null), 3000)),
    ])
  } catch {
    logo = null
  }

  // ── Header ──────────────────────────────────────────────
  doc.setFillColor(85, 91, 55)
  doc.rect(0, 0, W, 27, 'F')
  if (logo) doc.addImage(logo, 'PNG', M, 3.5, 19, 19)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(13)
  doc.setTextColor(255, 255, 255)
  doc.text('Jessica da Horta Garden Design', M + 23, 13)
  doc.setFontSize(8)
  doc.setTextColor(205, 212, 185)
  doc.text('Pedido de Visita Técnica', M + 23, 19.5)

  y = 35

  // Submission date
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 142)
  doc.text(`Submetido em ${new Date().toLocaleDateString('pt-PT')}`, W - M, y, { align: 'right' })
  y += 9

  // ── Helpers ─────────────────────────────────────────────
  const checkPage = (needed = 10) => {
    if (y + needed > H - 18) { doc.addPage(); y = 20 }
  }

  const drawSection = (title) => {
    checkPage(12)
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(85, 91, 55)
    doc.text(title.toUpperCase(), M, y)
    doc.setDrawColor(85, 91, 55)
    doc.setLineWidth(0.25)
    doc.line(M, y + 1.8, W - M, y + 1.8)
    y += 7.5
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(28, 28, 26)
  }

  const drawRow = (label, value) => {
    if (!value && value !== 0) return
    const strVal = String(value)
    checkPage(7)
    doc.setFontSize(7.5)
    doc.setTextColor(118, 118, 110)
    doc.text(label, M, y)
    doc.setTextColor(28, 28, 26)
    const lines = doc.splitTextToSize(strVal, CW - 60)
    doc.text(lines, M + 60, y)
    y += Math.max(lines.length * 4.8 + 1, 6)
  }

  // ── Section 1: Client Info ───────────────────────────────
  drawSection('1. Informação do Cliente')
  drawRow('Nome', val(data.fullName))
  drawRow('Telefone', val(data.phone))
  drawRow('Email', val(data.email))
  drawRow('Morada', val(data.address))
  drawRow('Código Postal', val(data.postalCode))
  if (data.distanceKm) {
    drawRow('Distância estimada', `${data.distanceKm} km`)
    drawRow('Taxa de deslocação', data.travelFee > 0
      ? `45€ base + ${data.travelFee}€ extra (+${data.distanceKm - 50} km × 0,40€)`
      : '45€ base (dentro do raio de 50 km)')
  }
  y += 3

  // ── Section 2: Location ──────────────────────────────────
  drawSection('2. Detalhes da Localização')
  drawRow('Área total (m²)', val(data.totalArea))
  drawRow('Área de intervenção (m²)', val(data.interventionArea))
  drawRow('Limites de intervenção', val(data.limits))
  drawRow('Levantamento topográfico', yn(data.topo))
  if (data.topo === 'yes') {
    drawRow('Formato do levantamento', val(data.topoFormat))
    if (data.topoFile) drawRow('Ficheiro topográfico', data.topoFile.name)
  }
  drawRow('Construções no local', yn(data.constructions))
  if (data.constructions === 'yes') {
    drawRow('Descrição das construções', val(data.constructionsDesc))
    if (data.constructionImages?.length)
      drawRow('Fotos de construções', `${data.constructionImages.length} ficheiro(s) — ver anexos`)
  }
  y += 3

  // ── Section 3: Soil & Water ──────────────────────────────
  drawSection('3. Condições de Solo e Água')
  drawRow('Análise de solo', yn(data.soilAnalysis))
  drawRow('Análise de água', yn(data.waterAnalysis))
  drawRow('Fontes de água', arr(data.waterSources))
  if (data.waterStorage) drawRow('Capacidade de armazenamento', data.waterStorage)
  if (data.rainwaterImage) drawRow('Foto do depósito', `${data.rainwaterImage.name} — ver anexos`)
  y += 3

  // ── Section 4: Pets ──────────────────────────────────────
  drawSection('4. Fauna Doméstica')
  drawRow('Animais domésticos', yn(data.hasPets))
  if (data.hasPets === 'yes') {
    drawRow('Espécies/quantidade', val(data.petsDesc))
    drawRow('Acesso à área de plantação', yn(data.petsAccess))
  }
  y += 3

  // ── Section 5: Garden Prefs ──────────────────────────────
  drawSection('5. Preferências de Jardim')
  drawRow('Estilo de plantação', val(data.plantingStyle))
  drawRow('Estilo de caminhos/formas', val(data.pathStyle))
  drawRow('Tipos de plantas', arr(data.plantTypes))
  drawRow('Cores preferidas', val(data.colors))
  drawRow('Elementos desejados', arr(data.desiredElements))
  y += 3

  // ── Section 6: Services ──────────────────────────────────
  drawSection('6. Serviços Pretendidos')
  drawRow('Tipo de serviço', SVC_LABELS[data.serviceType] || val(data.serviceType))
  y += 3

  // ── Section 7: Timeframes ────────────────────────────────
  drawSection('7. Calendário e Visita')
  drawRow('Época de instalação', val(data.installation))
  drawRow('Prioridades de orçamento', val(data.priorities))
  if (data.additionalDesc) drawRow('Descrição adicional', data.additionalDesc)
  if (data.preferredDate) drawRow('Data preferida para visita', data.preferredDate)
  if (data.preferredTime) drawRow('Preferência de horário', data.preferredTime)
  y += 3

  // ── Section 8: Maintenance ───────────────────────────────
  drawSection('8. Manutenção Atual')
  drawRow('Equipa de manutenção existente', yn(data.maintenanceTeam))
  if (data.maintenanceTeam === 'yes') drawRow('Detalhes da manutenção', val(data.maintenanceDetails))
  y += 3

  // ── Section 9: Observations ──────────────────────────────
  drawSection('9. Observações Adicionais')
  drawRow('Observações', val(data.observations))
  y += 3

  // ── Images appendix ──────────────────────────────────────
  const imageFiles = [
    ...(data.topoFile?.type?.startsWith('image/') ? [data.topoFile] : []),
    ...(data.constructionImages || []).filter(f => f?.type?.startsWith('image/')),
    ...(data.rainwaterImage?.type?.startsWith('image/') ? [data.rainwaterImage] : []),
    ...(data.interventionImages || []).filter(f => f?.type?.startsWith('image/')),
  ]

  if (imageFiles.length > 0) {
    doc.addPage()
    y = 20
    drawSection('Fotografias Anexadas')
    for (const f of imageFiles) {
      try {
        const png = await toCanvasPng(f.data)
        if (!png) continue
        const props = doc.getImageProperties(png)
        const maxW = CW, maxH = 110
        let iW = maxW, iH = (props.height / props.width) * maxW
        if (iH > maxH) { iW = (maxW / iH) * maxW * (maxH / iH); iH = maxH }
        checkPage(iH + 10)
        doc.addImage(png, 'PNG', M, y, iW, iH)
        doc.setFontSize(7)
        doc.setTextColor(140, 140, 132)
        doc.text(f.name, M, y + iH + 4)
        y += iH + 10
      } catch { /* skip unrenderable files */ }
    }
  }

  // ── Footer on every page ─────────────────────────────────
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setDrawColor(210, 212, 205)
    doc.setLineWidth(0.2)
    doc.line(M, H - 12, W - M, H - 12)
    doc.setFontSize(7.5)
    doc.setTextColor(170, 170, 162)
    doc.text('jessicadahorta.com', M, H - 7)
    doc.text(`${i} / ${pages}`, W - M, H - 7, { align: 'right' })
  }

  // Return base64 without data URI prefix
  return doc.output('datauristring').split(',')[1]
}
