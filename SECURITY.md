# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do NOT open a public issue.**

Instead, email **fmroldanrivero@gmail.com** with:

- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested fix (optional)

You will receive an acknowledgment within **48 hours** and a detailed response within **7 days** indicating next steps.

## Scope

The following are in scope:

- Authentication and authorization issues (admin panel)
- Injection vulnerabilities (XSS, SQL injection, etc.)
- Data exposure or leakage
- Server-side request forgery (SSRF)
- Rate limiting bypasses
- CSRF vulnerabilities

The following are out of scope:

- Denial of service (DoS) attacks
- Social engineering
- Issues in third-party dependencies (report upstream)
- Issues requiring physical access to a user's device

## Security Measures

This project implements:

- **Bot protection** — Honeypot fields, timestamp validation, and IP-based rate limiting on all public form endpoints
- **Input sanitization** — Server-side validation on all API endpoints
- **JWT authentication** — Secure token-based admin authentication
- **HTTPS only** — Enforced via Cloudflare
- **No third-party cookies** — Essential local storage only
- **GDPR compliance** — Cookie consent and privacy policy
