var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// _shared/adminAuth.js
function requireAuth(request, env) {
  const secret = env?.ADMIN_SESSION_SECRET;
  if (!secret)
    return false;
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  return token === secret;
}
__name(requireAuth, "requireAuth");

// api/admin/projects/[id]/tasks/[taskId].js
async function onRequest(context) {
  const { request, env, params } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const taskId = Number(params.taskId);
  if (request.method === "PUT") {
    const { title, notes = "", status = "todo", priority = "medium" } = await request.json();
    if (!title?.trim())
      return Response.json({ error: "Title required" }, { status: 400 });
    await env.DB.prepare(
      `UPDATE tasks SET title = ?, notes = ?, status = ?, priority = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(title.trim(), notes, status, priority, taskId).run();
    return Response.json({ ok: true });
  }
  if (request.method === "DELETE") {
    await env.DB.prepare(`DELETE FROM tasks WHERE id = ?`).bind(taskId).run();
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest, "onRequest");

// api/admin/blog/posts/[id].js
async function onRequest2(context) {
  const { request, env, params } = context;
  const id = params.id;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "GET") {
    const post = await env.DB.prepare(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).bind(id).first();
    if (!post)
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(post), { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "PUT") {
    const data = await request.json();
    const {
      title,
      body,
      excerpt,
      cover_image,
      category_id,
      status,
      title_en = "",
      title_es = "",
      excerpt_en = "",
      excerpt_es = "",
      body_en = "",
      body_es = ""
    } = data;
    const current = await env.DB.prepare("SELECT status, published_at FROM posts WHERE id = ?").bind(id).first();
    if (!current)
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    const published_at = status === "published" && current.status !== "published" ? (/* @__PURE__ */ new Date()).toISOString() : current.published_at;
    await env.DB.prepare(`
      UPDATE posts SET title=?, body=?, excerpt=?, cover_image=?, category_id=?, status=?, published_at=?, updated_at=datetime('now'),
                       title_en=?, title_es=?, excerpt_en=?, excerpt_es=?, body_en=?, body_es=?
      WHERE id=?
    `).bind(
      title,
      body,
      excerpt || "",
      cover_image || "",
      category_id || null,
      status || "draft",
      published_at,
      title_en,
      title_es,
      excerpt_en,
      excerpt_es,
      body_en,
      body_es,
      id
    ).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(onRequest2, "onRequest");

// api/admin/calendar/appointments/[id].js
async function onRequest3(context) {
  const { request, env, params } = context;
  const id = params.id;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "PUT") {
    const { title, date, time, notes } = await request.json();
    await env.DB.prepare(
      `UPDATE appointments SET title=?, date=?, time=?, notes=?, updated_at=datetime('now') WHERE id=?`
    ).bind(title, date, time || "", notes || "", id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "DELETE") {
    await env.DB.prepare("DELETE FROM appointments WHERE id=?").bind(id).run();
    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(onRequest3, "onRequest");

// api/admin/projects/[id]/tasks.js
async function onRequest4(context) {
  const { request, env, params } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const projectId = Number(params.id);
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      `SELECT * FROM tasks WHERE project_id = ? ORDER BY position ASC, created_at ASC`
    ).bind(projectId).all();
    return Response.json(results);
  }
  if (request.method === "POST") {
    const { title, notes = "", status = "todo", priority = "medium" } = await request.json();
    if (!title?.trim())
      return Response.json({ error: "Title required" }, { status: 400 });
    const { meta } = await env.DB.prepare(
      `INSERT INTO tasks (project_id, title, notes, status, priority) VALUES (?, ?, ?, ?, ?)`
    ).bind(projectId, title.trim(), notes, status, priority).run();
    return Response.json({ id: meta.last_row_id });
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest4, "onRequest");

// api/admin/blog/categories.js
async function onRequest5(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const { results } = await env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
}
__name(onRequest5, "onRequest");

// api/admin/blog/posts.js
function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
__name(slugify, "slugify");
async function onRequest6(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(`
      SELECT p.id, p.slug, p.title, p.excerpt, p.cover_image, p.status, p.published_at, p.created_at, p.updated_at,
             c.name AS category_name, c.slug AS category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.updated_at DESC
    `).all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "POST") {
    const data = await request.json();
    const {
      title,
      body,
      excerpt,
      cover_image,
      category_id,
      status,
      title_en = "",
      title_es = "",
      excerpt_en = "",
      excerpt_es = "",
      body_en = "",
      body_es = ""
    } = data;
    if (!title || !body) {
      return new Response(JSON.stringify({ error: "title and body required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    let slug = slugify(title);
    const existing = await env.DB.prepare("SELECT id FROM posts WHERE slug = ?").bind(slug).first();
    if (existing)
      slug = `${slug}-${Date.now()}`;
    const published_at = status === "published" ? (/* @__PURE__ */ new Date()).toISOString() : null;
    const result = await env.DB.prepare(`
      INSERT INTO posts (slug, title, body, excerpt, cover_image, category_id, status, published_at,
                         title_en, title_es, excerpt_en, excerpt_es, body_en, body_es)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      slug,
      title,
      body,
      excerpt || "",
      cover_image || "",
      category_id || null,
      status || "draft",
      published_at,
      title_en,
      title_es,
      excerpt_en,
      excerpt_es,
      body_en,
      body_es
    ).run();
    return new Response(JSON.stringify({ id: result.meta.last_row_id, slug }), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(onRequest6, "onRequest");

// api/admin/calendar/appointments.js
async function onRequest7(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "GET") {
    const url = new URL(request.url);
    const month = url.searchParams.get("month");
    let query = "SELECT * FROM appointments";
    const binds = [];
    if (month) {
      query += " WHERE date LIKE ?";
      binds.push(`${month}%`);
    }
    query += " ORDER BY date ASC, time ASC";
    const { results } = await env.DB.prepare(query).bind(...binds).all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "POST") {
    const { title, date, time, notes } = await request.json();
    if (!title || !date) {
      return new Response(JSON.stringify({ error: "title and date required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const result = await env.DB.prepare(
      `INSERT INTO appointments (title, date, time, notes) VALUES (?, ?, ?, ?)`
    ).bind(title, date, time || "", notes || "").run();
    return new Response(JSON.stringify({ id: result.meta.last_row_id }), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response("Method Not Allowed", { status: 405 });
}
__name(onRequest7, "onRequest");

// api/blog/posts/[slug].js
async function onRequestGet(context) {
  const { request, env, params } = context;
  const lang = new URL(request.url).searchParams.get("lang") || "pt";
  const post = await env.DB.prepare(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ? AND p.status = 'published'
  `).bind(params.slug).first();
  if (!post)
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  const localized = lang !== "pt" ? {
    ...post,
    title: (post[`title_${lang}`] || "").trim() || post.title,
    excerpt: (post[`excerpt_${lang}`] || "").trim() || post.excerpt,
    body: (post[`body_${lang}`] || "").trim() || post.body
  } : post;
  return new Response(JSON.stringify(localized), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
  });
}
__name(onRequestGet, "onRequestGet");

// api/admin/projects/[id].js
async function onRequest8(context) {
  const { request, env, params } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const id = Number(params.id);
  if (request.method === "GET") {
    const project = await env.DB.prepare(`SELECT * FROM projects WHERE id = ?`).bind(id).first();
    if (!project)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(project);
  }
  if (request.method === "PUT") {
    const { title, description = "" } = await request.json();
    if (!title?.trim())
      return Response.json({ error: "Title required" }, { status: 400 });
    await env.DB.prepare(
      `UPDATE projects SET title = ?, description = ?, updated_at = datetime('now') WHERE id = ?`
    ).bind(title.trim(), description, id).run();
    return Response.json({ ok: true });
  }
  if (request.method === "DELETE") {
    await env.DB.prepare(`DELETE FROM projects WHERE id = ?`).bind(id).run();
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest8, "onRequest");

// api/admin/attachment.js
async function onRequestGet2(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  if (!key || !key.startsWith("attachment:")) {
    return new Response(JSON.stringify({ error: "Invalid key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.LEADS_KV) {
    return new Response(JSON.stringify({ error: "Storage unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const raw = await env.LEADS_KV.get(key);
    if (!raw) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(raw, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Attachment GET error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet2, "onRequestGet");

// api/admin/forgot-password.js
var EMAIL_TO_USER = {
  "jessicadhg.pais.agem@gmail.com": { id: "jessica", name: "Jessica" },
  "fmroldanrivero@gmail.com": { id: "freddy", name: "Freddy" },
  "internercia@gmail.com": { id: "internercia", name: "Internercia" }
};
async function onRequestPost(context) {
  const { env } = context;
  if (!env.LEADS_KV || !env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500 });
  }
  const { email } = await context.request.json();
  const user = EMAIL_TO_USER[email?.toLowerCase()?.trim()];
  if (!user) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(tokenBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.LEADS_KV.put(`admin:setup_token:${user.id}`, token, { expirationTtl: 3600 });
  const setupLink = `https://jessicadahorta.com/admin?setup=${token}&user=${user.id}`;
  const htmlBody = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a18;">
      <div style="background:#555b37;padding:20px 28px;margin-bottom:28px;">
        <h1 style="color:white;font-size:16px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
        <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Recupera\xE7\xE3o de Palavra-passe</p>
      </div>
      <div style="padding:0 28px 28px;">
        <p style="font-size:15px;">Ol\xE1 ${user.name},</p>
        <p style="font-size:14px;line-height:1.7;color:#5a5a52;">
          Foi solicitada a recupera\xE7\xE3o da palavra-passe do painel administrativo.<br>
          Clique no bot\xE3o abaixo para definir uma nova palavra-passe. O link expira em <strong>1 hora</strong>.
        </p>
        <div style="margin:28px 0;">
          <a href="${setupLink}" style="background:#555b37;color:#fff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;display:inline-block;">
            Redefinir Palavra-passe
          </a>
        </div>
        <p style="font-size:12px;color:#aaa;">Se n\xE3o solicitou este pedido, ignore este email.</p>
        <p style="font-size:12px;color:#ccc;margin-top:6px;word-break:break-all;">Link direto: ${setupLink}</p>
      </div>
    </div>`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
      to: [email],
      subject: "Recuperar palavra-passe \u2014 Painel Administrativo",
      html: htmlBody
    })
  });
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestPost, "onRequestPost");

// api/admin/leads.js
async function onRequestGet3(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.LEADS_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const listed = await env.LEADS_KV.list({ prefix: "lead:" });
    const keys = listed.keys || [];
    const leads = await Promise.all(
      keys.map(async (k) => {
        const raw = await env.LEADS_KV.get(k.name);
        if (!raw)
          return null;
        try {
          const data = JSON.parse(raw);
          return { _key: k.name, ...data };
        } catch {
          return { _key: k.name, raw };
        }
      })
    );
    const validLeads = leads.filter(Boolean);
    validLeads.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    return new Response(JSON.stringify(validLeads), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Leads GET error:", err);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet3, "onRequestGet");

// api/admin/login.js
async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha256, "sha256");
var EMAIL_TO_USER2 = {
  "jessicadhg.pais.agem@gmail.com": "jessica",
  "fmroldanrivero@gmail.com": "freddy",
  "internercia@gmail.com": "internercia"
};
async function onRequestPost2(context) {
  const { env } = context;
  if (!env.LEADS_KV || !env.ADMIN_SESSION_SECRET) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
  const { email, password } = await context.request.json();
  const userId = EMAIL_TO_USER2[email?.toLowerCase()?.trim()];
  if (!userId) {
    return new Response(JSON.stringify({ error: "invalid_credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const storedHash = await env.LEADS_KV.get(`admin:password_hash:${userId}`);
  if (!storedHash) {
    return new Response(JSON.stringify({ error: "password_not_set" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const inputHash = await sha256(password);
  if (inputHash !== storedHash) {
    return new Response(JSON.stringify({ error: "invalid_credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response(JSON.stringify({ token: env.ADMIN_SESSION_SECRET }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestPost2, "onRequestPost");

// api/admin/prices.js
async function onRequestGet4(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.PRICES_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const raw = await env.PRICES_KV.get("prices:all");
    if (!raw) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(raw, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Prices GET error:", err);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet4, "onRequestGet");
async function onRequestPut(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.PRICES_KV) {
    return new Response(JSON.stringify({ error: "KV not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const prices = await request.json();
    if (!Array.isArray(prices)) {
      return new Response(JSON.stringify({ error: "Invalid data: expected array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.PRICES_KV.put("prices:all", JSON.stringify(prices));
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Prices PUT error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPut, "onRequestPut");

// api/admin/send-setup.js
var USERS = [
  { id: "jessica", email: "jessicadhg.pais.agem@gmail.com", name: "Jessica" },
  { id: "freddy", email: "fmroldanrivero@gmail.com", name: "Freddy (Webmaster)" },
  { id: "internercia", email: "internercia@gmail.com", name: "Internercia" }
];
async function onRequestPost3(context) {
  const { env } = context;
  if (!env.LEADS_KV || !env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500 });
  }
  for (const user of USERS) {
    const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
    const token = Array.from(tokenBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    await env.LEADS_KV.put(`admin:setup_token:${user.id}`, token, { expirationTtl: 86400 });
    const setupLink = `https://jessicadahorta.com/admin?setup=${token}&user=${user.id}`;
    const htmlBody = `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#1a1a18;">
        <div style="background:#555b37;padding:20px 28px;margin-bottom:28px;">
          <h1 style="color:white;font-size:16px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:11px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Configura\xE7\xE3o de Acesso ao Painel Administrativo</p>
        </div>
        <div style="padding:0 28px 28px;">
          <p style="font-size:15px;">Ol\xE1 ${user.name},</p>
          <p style="font-size:14px;line-height:1.7;color:#5a5a52;">
            Foi solicitada a configura\xE7\xE3o de uma nova palavra-passe para o painel administrativo.<br>
            Clique no bot\xE3o abaixo para definir a sua palavra-passe. O link expira em <strong>24 horas</strong>.
          </p>
          <div style="margin:28px 0;">
            <a href="${setupLink}" style="background:#555b37;color:#fff;text-decoration:none;padding:12px 24px;font-size:13px;letter-spacing:0.08em;display:inline-block;">
              Definir Palavra-passe
            </a>
          </div>
          <p style="font-size:12px;color:#aaa;">Se n\xE3o solicitou este acesso, ignore este email.</p>
          <p style="font-size:12px;color:#ccc;margin-top:6px;word-break:break-all;">Link direto: ${setupLink}</p>
        </div>
      </div>`;
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
        to: [user.email],
        subject: "Configurar palavra-passe \u2014 Painel Administrativo",
        html: htmlBody
      })
    });
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestPost3, "onRequestPost");

// api/admin/set-password.js
var VALID_USERS = ["jessica", "freddy", "internercia"];
async function sha2562(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(sha2562, "sha256");
async function onRequestPost4(context) {
  const { env } = context;
  const { token, password, user } = await context.request.json();
  if (!env.LEADS_KV || !env.ADMIN_SESSION_SECRET) {
    return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500 });
  }
  if (!VALID_USERS.includes(user)) {
    return new Response(JSON.stringify({ error: "invalid_user" }), { status: 400 });
  }
  if (!password || password.length < 8) {
    return new Response(JSON.stringify({ error: "password_too_short" }), { status: 400 });
  }
  const storedToken = await env.LEADS_KV.get(`admin:setup_token:${user}`);
  if (!storedToken || storedToken !== token) {
    return new Response(JSON.stringify({ error: "invalid_token" }), { status: 400 });
  }
  const hash = await sha2562(password);
  await env.LEADS_KV.put(`admin:password_hash:${user}`, hash);
  await env.LEADS_KV.delete(`admin:setup_token:${user}`);
  return new Response(JSON.stringify({ token: env.ADMIN_SESSION_SECRET, ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(onRequestPost4, "onRequestPost");

// api/admin/suppliers.js
async function onRequestGet5(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const listed = await env.SUPPLIERS_KV.list({ prefix: "supplier:" });
    const keys = listed.keys || [];
    const suppliers = await Promise.all(
      keys.map(async (k) => {
        const raw = await env.SUPPLIERS_KV.get(k.name);
        if (!raw)
          return null;
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })
    );
    const valid = suppliers.filter(Boolean);
    valid.sort((a, b) => {
      const na = (a.name || "").toLowerCase();
      const nb = (b.name || "").toLowerCase();
      return na.localeCompare(nb, "pt");
    });
    return new Response(JSON.stringify(valid), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Suppliers GET error:", err);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestGet5, "onRequestGet");
async function onRequestPost5(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: "KV not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const id = String(Date.now());
    const supplier = {
      id,
      name: body.name.trim(),
      category: body.category || "Outro",
      contact: body.contact || "",
      phone: body.phone || "",
      email: body.email || "",
      website: body.website || "",
      notes: body.notes || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.SUPPLIERS_KV.put(`supplier:${id}`, JSON.stringify(supplier));
    return new Response(JSON.stringify({ ok: true, supplier }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Suppliers POST error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPost5, "onRequestPost");
async function onRequestPut2(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: "KV not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!body.name || !body.name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const existing = await env.SUPPLIERS_KV.get(`supplier:${body.id}`);
    const prev = existing ? JSON.parse(existing) : {};
    const supplier = {
      ...prev,
      id: body.id,
      name: body.name.trim(),
      category: body.category || "Outro",
      contact: body.contact || "",
      phone: body.phone || "",
      email: body.email || "",
      website: body.website || "",
      notes: body.notes || "",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await env.SUPPLIERS_KV.put(`supplier:${body.id}`, JSON.stringify(supplier));
    return new Response(JSON.stringify({ ok: true, supplier }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Suppliers PUT error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestPut2, "onRequestPut");
async function onRequestDelete(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (!env.SUPPLIERS_KV) {
    return new Response(JSON.stringify({ error: "KV not available" }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await env.SUPPLIERS_KV.delete(`supplier:${body.id}`);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Suppliers DELETE error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
__name(onRequestDelete, "onRequestDelete");

// api/blog/categories.js
async function onRequestGet6(context) {
  const { env } = context;
  const { results } = await env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=300" }
  });
}
__name(onRequestGet6, "onRequestGet");

// api/blog/posts.js
function localize(post, lang) {
  if (!lang || lang === "pt")
    return post;
  return {
    ...post,
    title: (post[`title_${lang}`] || "").trim() || post.title,
    excerpt: (post[`excerpt_${lang}`] || "").trim() || post.excerpt
  };
}
__name(localize, "localize");
async function onRequestGet7(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const lang = url.searchParams.get("lang") || "pt";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20"), 50);
  const offset = parseInt(url.searchParams.get("offset") || "0");
  let query = `
    SELECT p.id, p.slug, p.title, p.excerpt, p.cover_image, p.published_at,
           p.title_en, p.title_es, p.excerpt_en, p.excerpt_es,
           c.name AS category_name, c.slug AS category_slug
    FROM posts p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'published'
  `;
  const binds = [];
  if (category) {
    query += " AND c.slug = ?";
    binds.push(category);
  }
  query += " ORDER BY p.published_at DESC LIMIT ? OFFSET ?";
  binds.push(limit, offset);
  const { results } = await env.DB.prepare(query).bind(...binds).all();
  return new Response(JSON.stringify(results.map((p) => localize(p, lang))), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" }
  });
}
__name(onRequestGet7, "onRequestGet");

// api/admin/projects.js
async function onRequest9(context) {
  const { request, env } = context;
  if (!requireAuth(request, env)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare(
      `SELECT p.*, COUNT(t.id) as task_count
       FROM projects p LEFT JOIN tasks t ON t.project_id = p.id
       GROUP BY p.id ORDER BY p.created_at DESC`
    ).all();
    return Response.json(results);
  }
  if (request.method === "POST") {
    const { title, description = "" } = await request.json();
    if (!title?.trim())
      return Response.json({ error: "Title required" }, { status: 400 });
    const { meta } = await env.DB.prepare(
      `INSERT INTO projects (title, description) VALUES (?, ?)`
    ).bind(title.trim(), description).run();
    return Response.json({ id: meta.last_row_id });
  }
  return new Response("Method not allowed", { status: 405 });
}
__name(onRequest9, "onRequest");

// _shared/botProtection.js
function honeypotCheck(body) {
  if (body._hp)
    return true;
  if (!body._ts)
    return true;
  const elapsed = Date.now() - parseInt(body._ts, 10);
  if (isNaN(elapsed) || elapsed < 3e3)
    return true;
  return false;
}
__name(honeypotCheck, "honeypotCheck");
async function isRateLimited(kv, ip, endpoint, maxPerHour = 8) {
  if (!kv || !ip)
    return false;
  const window = Math.floor(Date.now() / 36e5);
  const key = `ratelimit:${endpoint}:${ip}:${window}`;
  const count = parseInt(await kv.get(key) || "0", 10);
  if (count >= maxPerHour)
    return true;
  await kv.put(key, String(count + 1), { expirationTtl: 7200 });
  return false;
}
__name(isRateLimited, "isRateLimited");
function getIP(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
}
__name(getIP, "getIP");
function botResponse() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
__name(botResponse, "botResponse");

// api/contact.js
async function onRequestPost6(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (honeypotCheck(body))
      return botResponse();
    if (await isRateLimited(env.LEADS_KV, getIP(request), "contact")) {
      return new Response(JSON.stringify({ error: "too_many_requests" }), { status: 429 });
    }
    const { name, email, phone, zip, message, experience, subject } = body;
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const JESSICA_EMAIL = env.JESSICA_EMAIL || "contact@jessicadahorta.com";
    const subjectLabels = {
      general: "Consulta Geral",
      prices: "Pre\xE7os e Or\xE7amentos",
      jobs: "Candidatura Freelance"
    };
    const subjectLine = `[Website] ${subjectLabels[subject] || "Contacto"} \u2014 ${name}`;
    const row = /* @__PURE__ */ __name((label, value) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5da;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#888;width:120px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e5da;font-size:15px;">${value || "\u2014"}</td>
      </tr>`, "row");
    const jobsRows = subject === "jobs" && experience ? `<tr><td colspan="2" style="padding:20px 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">Percurso / Experi\xEAncia</td></tr>
         <tr><td colspan="2" style="padding:0 0 16px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#5a5a52;">${experience}</td></tr>` : "";
    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a18;">
        <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
          <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0; letter-spacing: 0.05em;">
            Jessica da Horta Garden Design
          </h1>
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 4px 0 0; letter-spacing: 0.1em; text-transform: uppercase;">
            ${subjectLabels[subject] || "Contacto"}
          </p>
        </div>

        <div style="padding: 0 32px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Nome", name)}
            ${row("Email", email)}
            ${row("Telefone", phone)}
            ${subject !== "jobs" ? row("C\xF3d. Postal", zip) : ""}
            ${jobsRows}
            ${subject !== "jobs" ? `<tr><td colspan="2" style="padding:20px 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">Mensagem</td></tr>
            <tr><td colspan="2" style="padding:0 0 16px;font-size:14px;line-height:1.7;white-space:pre-wrap;color:#5a5a52;">${message || "\u2014"}</td></tr>` : ""}
          </table>
        </div>
      </div>
    `;
    const toJessicaRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
        to: [JESSICA_EMAIL],
        subject: subjectLine,
        html: htmlBody,
        reply_to: email
      })
    });
    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text();
      console.error("Resend error (to jessica):", err);
      return new Response(JSON.stringify({ error: "Email send failed" }), { status: 500 });
    }
    if (context.env.LEADS_KV) {
      const leadKey = `lead:${Date.now()}:${subject}`;
      const leadData = {
        type: subject,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        name,
        email,
        phone,
        message: subject === "jobs" ? experience : message
      };
      await context.env.LEADS_KV.put(leadKey, JSON.stringify(leadData));
    }
    if (email) {
      const confirmHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a18;">
          <div style="background: #555b37; padding: 24px 32px; margin-bottom: 32px;">
            <h1 style="color: white; font-size: 18px; font-weight: 400; margin: 0;">Jessica da Horta Garden Design</h1>
          </div>
          <div style="padding: 0 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 16px;">Ol\xE1 ${name},</p>
            <p style="font-size: 15px; line-height: 1.7; color: #5a5a52;">Recebemos a sua mensagem e iremos responder em breve.</p>
            <p style="font-size: 15px; line-height: 1.7; color: #5a5a52; margin-top: 12px;">Obrigada pelo contacto.</p>
            <p style="font-size: 14px; margin-top: 32px; color: #888;">\u2014 Jessica da Horta Garden Design</p>
          </div>
        </div>
      `;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
          to: [email],
          subject: "Mensagem recebida \u2014 Jessica da Horta Garden Design",
          html: confirmHtml
        })
      });
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Contact function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
__name(onRequestPost6, "onRequestPost");

// api/schedule.js
async function onRequestPost7(context) {
  const { request, env } = context;
  try {
    const data = await request.json();
    if (honeypotCheck(data))
      return botResponse();
    if (await isRateLimited(env.LEADS_KV, getIP(request), "schedule", 4)) {
      return new Response(JSON.stringify({ error: "too_many_requests" }), { status: 429 });
    }
    const RESEND_API_KEY = env.RESEND_API_KEY;
    const JESSICA_EMAIL = env.JESSICA_EMAIL || "jessicadhg.pais.agem@gmail.com";
    if (!RESEND_API_KEY) {
      console.error("Schedule function: RESEND_API_KEY is not set in environment");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500 });
    }
    const {
      fullName,
      phone,
      email,
      address,
      postalCode,
      totalArea,
      interventionArea,
      limits,
      topo,
      topoFormat,
      constructions,
      constructionsDesc,
      soilAnalysis,
      waterAnalysis,
      waterSources,
      waterStorage,
      hasPets,
      petsDesc,
      petsAccess,
      plantingStyle,
      pathStyle,
      plantTypes,
      colors,
      desiredElements,
      serviceType,
      hiredArchitect,
      installation,
      priorities,
      additionalDesc,
      maintenanceTeam,
      maintenanceDetails,
      preferredDate,
      preferredTime,
      observations,
      distanceKm,
      travelFee,
      roundTripKm,
      clientPdfBase64,
      jessicaPdfBase64,
      attachments = []
    } = data;
    const stripPrefix = /* @__PURE__ */ __name((b64) => b64 && b64.includes(",") ? b64.split(",")[1] : b64, "stripPrefix");
    const safeName = (fullName || "cliente").replace(/\s+/g, "_");
    const jessicaPdfAttachment = jessicaPdfBase64 ? [{ filename: `JESSICA_Visita_${safeName}.pdf`, content: stripPrefix(jessicaPdfBase64) }] : [];
    const clientPdfAttachment = clientPdfBase64 ? [{ filename: `Visita_JessicaDaHorta_${safeName}.pdf`, content: stripPrefix(clientPdfBase64) }] : [];
    const imageAttachments = attachments.map((f) => ({
      filename: f.name || "anexo",
      content: stripPrefix(f.data)
    }));
    const jessicaAttachments = [...jessicaPdfAttachment, ...imageAttachments];
    const row = /* @__PURE__ */ __name((label, value) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5da;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#888;width:200px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e5e5da;font-size:14px;vertical-align:top;">${value || "\u2014"}</td>
      </tr>`, "row");
    const section = /* @__PURE__ */ __name((title) => `
      <tr>
        <td colspan="2" style="padding:20px 0 8px;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.12em;color:#555b37;">${title}</td>
      </tr>`, "section");
    const arr = /* @__PURE__ */ __name((v) => Array.isArray(v) ? v.join(", ") : v || "\u2014", "arr");
    const yn = /* @__PURE__ */ __name((v) => v === "yes" ? "Sim" : v === "no" ? "N\xE3o" : "\u2014", "yn");
    const serviceLabels = {
      "1A": "1A \u2014 Consultoria Simples",
      "1B": "1B \u2014 Consultoria Avan\xE7ada",
      "2A": "2A \u2014 Design Simples de Jardim",
      "2B": "2B \u2014 Projeto Completo com Partes T\xE9cnicas",
      "2C": "2C \u2014 Licenciamento Municipal",
      "3": "3 \u2014 Instala\xE7\xE3o e Monitoriza\xE7\xE3o",
      "4": "4 \u2014 Gest\xE3o e Manuten\xE7\xE3o"
    };
    const travelRow = distanceKm ? row("Taxa de desloca\xE7\xE3o", `90\u20AC base + ${travelFee}\u20AC desloca\xE7\xE3o (${distanceKm} km \xD7 2 ida/volta \xD7 0,40\u20AC/km)`) : "";
    const attachmentNote = jessicaAttachments.length > 0 ? `<p style="font-size:13px;color:#555b37;margin:16px 0 0;">\u{1F4CE} ${jessicaAttachments.length} anexo(s) inclu\xEDdo(s) neste email.</p>` : "";
    const breakdown = [];
    const visitFee = 90 + (roundTripKm || 0) * 0.4;
    breakdown.push({ label: "Visita t\xE9cnica inicial (base \u20AC90 + desloca\xE7\xE3o)", amount: visitFee });
    if (soilAnalysis === "no")
      breakdown.push({ label: "An\xE1lise de solo", amount: 250 });
    if (waterAnalysis === "no")
      breakdown.push({ label: "An\xE1lise de \xE1gua", amount: 150 });
    const srcCosts = { well: 200, borehole: 150, rainwater: 300, tank: 250, public: 0 };
    for (const s of Array.isArray(waterSources) ? waterSources : []) {
      if (srcCosts[s])
        breakdown.push({ label: `Fonte de \xE1gua: ${s}`, amount: srcCosts[s] });
    }
    const svcCosts = { "1A": 200, "1B": 450, "2A": 1200, "2B": 1200, "2C": 600, "3": 800, "4": 200 };
    if (serviceType && svcCosts[serviceType] !== void 0)
      breakdown.push({ label: serviceLabels[serviceType] || serviceType, amount: svcCosts[serviceType] });
    const subtotal = breakdown.reduce((acc, i) => acc + i.amount, 0);
    const notes = [];
    if (maintenanceTeam === "yes")
      notes.push("Manuten\xE7\xE3o: +\u20AC80/m\xEAs (visita b\xE1sica de jardim)");
    const plantAdj = { mediterranean: 10, ornamental: 15, edible: 20, medicinal: 10 };
    for (const pt of Array.isArray(plantTypes) ? plantTypes : []) {
      if (plantAdj[pt])
        notes.push(`Plantas (${pt}): +${plantAdj[pt]}% sobre custo de materiais`);
    }
    const estimateRows = breakdown.map(
      (item) => `<tr>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0ea;font-size:13px;color:#444;">${item.label}</td>
        <td style="padding:6px 0;border-bottom:1px solid #f0f0ea;font-size:13px;text-align:right;color:#1a1a18;">\u20AC${item.amount.toFixed(2)}</td>
      </tr>`
    ).join("");
    const notesHtml = notes.length ? `<p style="font-size:12px;color:#888;margin:8px 0 0;">${notes.map((n) => `\u2022 ${n}`).join("<br>")}</p>` : "";
    const estimateSection = `
      ${section("Estimativa de Custos (Uso Interno)")}
      <tr><td colspan="2" style="padding:8px 0 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${estimateRows}
          <tr>
            <td style="padding:10px 0 4px;font-size:13px;font-weight:bold;color:#555b37;border-top:2px solid #555b37;">TOTAL ESTIMADO (excl. IVA)</td>
            <td style="padding:10px 0 4px;font-size:15px;font-weight:bold;color:#555b37;text-align:right;border-top:2px solid #555b37;">\u20AC${subtotal.toFixed(2)}</td>
          </tr>
        </table>
        ${notesHtml}
      </td></tr>`;
    const htmlBody = `
      <div style="font-family:Georgia,serif;max-width:680px;margin:0 auto;color:#1a1a18;">
        <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
          <h1 style="color:white;font-size:18px;font-weight:400;margin:0;letter-spacing:0.05em;">Jessica da Horta Garden Design</h1>
          <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:4px 0 0;letter-spacing:0.1em;text-transform:uppercase;">Novo Pedido de Visita T\xE9cnica</p>
        </div>
        <div style="padding:0 32px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${section("1. Informa\xE7\xE3o do Cliente")}
            ${row("Nome completo", fullName)}
            ${row("Telefone", phone)}
            ${row("Email", email)}
            ${row("Morada", address)}
            ${row("C\xF3digo Postal", postalCode)}
            ${distanceKm ? row("Dist\xE2ncia estimada", `${distanceKm} km`) : ""}
            ${travelRow}

            ${section("2. Detalhes da Localiza\xE7\xE3o")}
            ${row("\xC1rea total (m\xB2)", totalArea)}
            ${row("\xC1rea de interven\xE7\xE3o (m\xB2)", interventionArea)}
            ${row("Limites de interven\xE7\xE3o", limits)}
            ${row("Levantamento topogr\xE1fico", yn(topo))}
            ${topo === "yes" ? row("Formato do levantamento", topoFormat) : ""}
            ${row("Constru\xE7\xF5es no local", yn(constructions))}
            ${constructions === "yes" ? row("Descri\xE7\xE3o das constru\xE7\xF5es", constructionsDesc) : ""}

            ${section("3. Solo e \xC1gua")}
            ${row("An\xE1lise de solo", yn(soilAnalysis))}
            ${row("An\xE1lise de \xE1gua", yn(waterAnalysis))}
            ${row("Fontes de \xE1gua", arr(waterSources))}
            ${waterStorage ? row("Capacidade de armazenamento", waterStorage) : ""}

            ${section("4. Fauna Dom\xE9stica")}
            ${row("Animais dom\xE9sticos", yn(hasPets))}
            ${hasPets === "yes" ? row("Esp\xE9cies/quantidade", petsDesc) : ""}
            ${hasPets === "yes" ? row("Acesso \xE0 \xE1rea de planta\xE7\xE3o", yn(petsAccess)) : ""}

            ${section("5. Prefer\xEAncias de Jardim")}
            ${row("Estilo de planta\xE7\xE3o", plantingStyle)}
            ${row("Estilo de caminhos/formas", pathStyle)}
            ${row("Tipos de plantas", arr(plantTypes))}
            ${row("Cores preferidas", colors)}
            ${row("Elementos desejados", arr(desiredElements))}

            ${section("6. Servi\xE7os Pretendidos")}
            ${row("Tipo de servi\xE7o", serviceLabels[serviceType] || serviceType)}
            ${row("Arquiteto paisagista anterior", yn(hiredArchitect))}

            ${section("7. Calend\xE1rio e Visita")}
            ${row("\xC9poca de instala\xE7\xE3o", installation)}
            ${row("Prioridades de or\xE7amento", priorities)}
            ${additionalDesc ? row("Descri\xE7\xE3o adicional", additionalDesc) : ""}
            ${preferredDate ? row("Data preferida para visita", preferredDate) : ""}
            ${preferredTime ? row("Prefer\xEAncia de hor\xE1rio", preferredTime) : ""}

            ${section("8. Manuten\xE7\xE3o Atual")}
            ${row("Equipa de manuten\xE7\xE3o existente", yn(maintenanceTeam))}
            ${maintenanceTeam === "yes" ? row("Detalhes da manuten\xE7\xE3o", maintenanceDetails) : ""}

            ${section("9. Observa\xE7\xF5es Adicionais")}
            ${row("Observa\xE7\xF5es", observations)}

            ${estimateSection}
          </table>
          ${attachmentNote}
        </div>
      </div>`;
    const confirmHtml = `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a18;">
        <div style="background:#555b37;padding:24px 32px;margin-bottom:32px;">
          <h1 style="color:white;font-size:18px;font-weight:400;margin:0;">Jessica da Horta Garden Design</h1>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="font-size:16px;margin-bottom:16px;">Ol\xE1 ${fullName},</p>
          <p style="font-size:15px;line-height:1.7;color:#5a5a52;">
            O seu pedido de visita t\xE9cnica foi enviado com sucesso.<br>
            Ser\xE1 contactado brevemente para confirmar a data e hora da visita.
          </p>
          ${preferredDate ? `
          <div style="background:#f8f7f4;border-left:3px solid #555b37;padding:16px 20px;margin:24px 0;">
            <p style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Data preferida</p>
            <p style="font-size:14px;color:#1a1a18;margin:0;">${preferredDate}${preferredTime ? ` \u2014 ${preferredTime}` : ""}</p>
          </div>` : ""}
          <div style="background:#f8f7f4;border-left:3px solid #555b37;padding:16px 20px;margin:24px 0;">
            <p style="font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">Servi\xE7o solicitado</p>
            <p style="font-size:14px;color:#1a1a18;margin:0;">${serviceLabels[serviceType] || serviceType || "\u2014"}</p>
          </div>
          <p style="font-size:13px;color:#aaa;margin-top:8px;">Em anexo encontra o resumo do seu pedido em formato PDF.</p>
          <p style="font-size:14px;color:#888;margin-top:32px;">\u2014 Jessica da Horta Garden Design</p>
        </div>
      </div>`;
    const toJessicaRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
        to: ["jessicadhg.pais.agem@gmail.com", "jessicadhg@gmail.com", "contact@jessicadahorta.com"],
        subject: `[Visita] Pedido de agendamento \u2014 ${fullName}`,
        html: htmlBody,
        reply_to: email,
        attachments: jessicaAttachments
      })
    });
    if (!toJessicaRes.ok) {
      const err = await toJessicaRes.text();
      console.error(`Resend error (Jessica) \u2014 status ${toJessicaRes.status}:`, err);
      return new Response(JSON.stringify({ error: "Email send failed", detail: err }), { status: 500 });
    }
    if (context.env.LEADS_KV) {
      const ts = Date.now();
      const leadKey = `lead:${ts}:schedule`;
      const attachmentMeta = [];
      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i];
        const attKey = `attachment:${ts}:${i}`;
        await context.env.LEADS_KV.put(attKey, JSON.stringify({
          name: att.name,
          type: att.type,
          data: att.data
        }));
        attachmentMeta.push({ key: attKey, name: att.name, type: att.type });
      }
      const leadData = {
        type: "schedule",
        date: (/* @__PURE__ */ new Date()).toISOString(),
        name: fullName,
        email,
        phone,
        address,
        postalCode,
        totalArea,
        interventionArea,
        limits,
        topo,
        topoFormat,
        constructions,
        constructionsDesc,
        soilAnalysis,
        waterAnalysis,
        waterSources,
        waterStorage,
        hasPets,
        petsDesc,
        petsAccess,
        plantingStyle,
        pathStyle,
        plantTypes,
        colors,
        desiredElements,
        serviceType,
        hiredArchitect,
        installation,
        priorities,
        additionalDesc,
        preferredDate,
        preferredTime,
        maintenanceTeam,
        maintenanceDetails,
        observations,
        distanceKm,
        travelFee,
        roundTripKm,
        breakdown,
        subtotal,
        notes,
        jessicaPdfBase64,
        attachments: attachmentMeta
      };
      await context.env.LEADS_KV.put(leadKey, JSON.stringify(leadData));
    }
    if (email) {
      const toClientRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Jessica da Horta Garden Design <noreply@jessicadahorta.com>",
          to: [email],
          subject: "O seu pedido de visita foi enviado \u2014 Jessica da Horta Garden Design",
          html: confirmHtml,
          attachments: clientPdfAttachment
        })
      });
      if (!toClientRes.ok) {
        const err = await toClientRes.text();
        console.error(`Resend error (client) \u2014 status ${toClientRes.status}:`, err);
      }
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Schedule function error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500 });
  }
}
__name(onRequestPost7, "onRequestPost");

// _middleware.js
async function onRequest10(context) {
  const host = context.request.headers.get("host") || "";
  if (host.startsWith("sso.")) {
    const url = new URL(context.request.url);
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/admin";
      return Response.redirect(url.toString(), 302);
    }
  }
  return context.next();
}
__name(onRequest10, "onRequest");

// ../.wrangler/tmp/pages-BIv3SY/functionsRoutes-0.046636519905382645.mjs
var routes = [
  {
    routePath: "/api/admin/projects/:id/tasks/:taskId",
    mountPath: "/api/admin/projects/:id/tasks",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/admin/blog/posts/:id",
    mountPath: "/api/admin/blog/posts",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/api/admin/calendar/appointments/:id",
    mountPath: "/api/admin/calendar/appointments",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/api/admin/projects/:id/tasks",
    mountPath: "/api/admin/projects/:id",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/api/admin/blog/categories",
    mountPath: "/api/admin/blog",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/admin/blog/posts",
    mountPath: "/api/admin/blog",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/api/admin/calendar/appointments",
    mountPath: "/api/admin/calendar",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/api/blog/posts/:slug",
    mountPath: "/api/blog/posts",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/admin/projects/:id",
    mountPath: "/api/admin/projects",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/admin/attachment",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/admin/forgot-password",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/admin/leads",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/admin/login",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/admin/prices",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/admin/prices",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/admin/send-setup",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/admin/set-password",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/admin/suppliers",
    mountPath: "/api/admin",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/admin/suppliers",
    mountPath: "/api/admin",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/admin/suppliers",
    mountPath: "/api/admin",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/admin/suppliers",
    mountPath: "/api/admin",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut2]
  },
  {
    routePath: "/api/blog/categories",
    mountPath: "/api/blog",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/blog/posts",
    mountPath: "/api/blog",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/admin/projects",
    mountPath: "/api/admin",
    method: "",
    middlewares: [],
    modules: [onRequest9]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/schedule",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest10],
    modules: []
  }
];

// ../node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: () => {
            isFailOpen = true;
          }
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
