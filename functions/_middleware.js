export async function onRequest(context) {
  const host = context.request.headers.get('host') || ''
  if (host.startsWith('sso.')) {
    const url = new URL(context.request.url)
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/admin'
      return Response.redirect(url.toString(), 302)
    }
  }
  return context.next()
}
