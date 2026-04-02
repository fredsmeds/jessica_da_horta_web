export function requireAuth(request, env) {
  const secret = env?.ADMIN_SESSION_SECRET
  if (!secret) return false
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === secret
}
