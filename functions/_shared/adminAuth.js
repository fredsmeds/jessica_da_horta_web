export const SESSION_TOKEN = 'jdh_admin_s3lk1e_2026'

export function requireAuth(request) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  return token === SESSION_TOKEN
}
