# CyberShield - Cybersecurity Platform

A full-stack cybersecurity portfolio and threat intelligence platform demonstrating security engineering principles, defensive coding, and real-world vulnerability awareness.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Threat Model](#threat-model)
- [OWASP Top 10 Protections](#owasp-top-10-protections)
- [Security Controls Implemented](#security-controls-implemented)
- [Attack Simulation Lab](#attack-simulation-lab)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

---

## Overview

CyberShield is a comprehensive cybersecurity platform built by a BTech Cybersecurity student. It demonstrates:

- **Secure Authentication**: JWT-based auth with rate limiting and brute-force detection
- **Security Logging**: SIEM-style dashboard with real-time event monitoring
- **Threat Intelligence**: Live CVE feeds, attack maps, and threat indicators
- **Vulnerability Scanner**: Simulated security assessment tool
- **Attack Simulation**: Educational lab for testing web vulnerabilities

### Problem Statement

Most student cybersecurity projects focus on visual aesthetics without implementing actual security controls. CyberShield demonstrates real security engineering by:

1. Implementing proper authentication security
2. Adding comprehensive security logging
3. Demonstrating attack patterns and their mitigations
4. Following OWASP best practices

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │  Home   │ │Scanner  │ │AttackLab│ │Security │ │  SOC   │ │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └───┬────┘ │
│       │          │           │           │           │      │
└───────┼──────────┼───────────┼───────────┼───────────┼──────┘
        │          │           │           │           │
        ▼          ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Supabase Edge Functions)           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                     API Gateway                      │   │
│  │  • Rate Limiting  • Input Validation  • Auth Check   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Auth   │ │Security│ │ CRUD   │ │Scanner │ │Visitor │   │
│  │Service │ │ Logs   │ │ Routes │ │Service │ │Tracker │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL + RLS)                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │ Profiles │ │ Projects │ │ AuthLogs │ │SecurityEvents│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │
│  │BlogPosts│ │Threats   │ │RateLimits │ │SuspiciousAct │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Supabase Edge Functions (Deno) |
| Database | PostgreSQL with Row Level Security |
| Authentication | Supabase Auth (JWT) |
| Hosting | Supabase Cloud |

---

## Security Features

### 1. Authentication Security

- **JWT-based authentication** with session management
- **Rate limiting** on login attempts (5 attempts per 15 minutes)
- **Brute-force detection** with automatic IP flagging
- **Failed login tracking** with suspicious activity alerts
- **Admin role-based access control (RBAC)**

### 2. Input Validation

- **Server-side input sanitization** for all forms
- **Email format validation** with regex patterns
- **Length constraints** on all text inputs
- **DOMPurify** for HTML sanitization in blog posts
- **Parameterized queries** to prevent SQL injection

### 3. Security Headers

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 4. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 attempts | 15 minutes |
| `/contact` | 3 submissions | 1 hour |
| `/scan` | 10 scans | 1 hour |

### 5. Security Logging

All security-relevant events are logged:
- Authentication attempts (success/failure)
- Rate limit violations
- Suspicious user agents
- Brute-force detection
- Admin actions (audit trail)

---

## Threat Model

### Attack Surface

```
┌─────────────────────────────────────────────────────────────┐
│                      EXTERNAL THREATS                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Web App   │  │    API      │  │  Auth Flow  │         │
│  │  (Frontend) │  │ (Endpoints) │  │ (Login/Reg) │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │ XSS Attacks │  │ SQL Inject │  │ Credential  │         │
│  │ CSRF       │  │ SSRF       │  │ Stuffing    │         │
│  │ Clickjacking│  │ Rate Limit │  │ Brute Force │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### STRIDE Analysis

| Threat | Mitigation |
|--------|------------|
| **Spoofing** | JWT signatures, session validation |
| **Tampering** | Input validation, parameterized queries |
| **Repudiation** | Comprehensive audit logging |
| **Information Disclosure** | RLS policies, minimal data exposure |
| **Denial of Service** | Rate limiting, query timeouts |
| **Elevation of Privilege** | RBAC, admin verification |

### Trust Boundaries

```
┌─────────────┐        ┌─────────────┐        ┌─────────────┐
│   Browser   │ ────▶  │   Edge Fn   │ ────▶  │  Database   │
│ (Untrusted) │        │ (Trusted)   │        │ (Protected) │
└─────────────┘        └─────────────┘        └─────────────┘
       │                       │                      │
       │    TLS/HTTPS          │   Service Role       │
       └───────────────────────┴──────────────────────┘
```

---

## OWASP Top 10 Protections

### A01:2021 – Broken Access Control

**Mitigations:**
- Row Level Security (RLS) on all database tables
- Role-based policies (admin vs analyst)
- Session verification on protected routes
- Admin-only API endpoints with token verification

**Testing:**
```bash
# Attempt to access admin endpoint without auth
curl -X GET https://api.cybershield.dev/admin
# Response: 401 Unauthorized
```

### A02:2021 – Cryptographic Failures

**Mitigations:**
- HTTPS-only communication
- Secure JWT token handling
- No sensitive data in localStorage
- Environment variable secrets management

### A03:2021 – Injection

**Mitigations:**
- Parameterized queries (Supabase client)
- Input validation and sanitization
- DOMPurify for HTML content
- Type-safe TypeScript interfaces

**Attack Lab Demonstration:**
- SQL Injection payloads are blocked
- XSS payloads are sanitized
- Command injection attempts fail

### A04:2021 – Insecure Design

**Mitigations:**
- Defense in depth architecture
- Rate limiting at multiple layers
- Input validation at edge and database
- Principle of least privilege

### A05:2021 – Security Misconfiguration

**Mitigations:**
- Security headers configured
- Error messages sanitized
- Debug mode disabled in production
- Default credentials changed

### A06:2021 – Vulnerable Components

**Mitigations:**
- Regular `npm audit` checks
- Dependency version pinning
- Supabase managed updates

### A07:2021 – Auth Failures

**Mitigations:**
- Rate limiting on login
- Brute-force detection
- Failed login alerts
- Session expiration handling

### A08:2021 – Data Integrity

**Mitigations:**
- JWT signature verification
- Input validation
- Database constraints

### A09:2021 – Logging Failures

**Mitigations:**
- Comprehensive security logging
- Auth event tracking
- Admin audit trail
- SIEM-style dashboard

### A10:2021 – SSRF

**Mitigations:**
- No arbitrary URL fetching
- Whitelisted external APIs only
- Input validation on all URLs

---

## Security Controls Implemented

| Control | Status | Implementation |
|---------|--------|----------------|
| Input Validation | ✅ Active | Server-side + DOMPurify |
| Output Encoding | ✅ Active | HTML entity encoding |
| Authentication | ✅ Active | JWT + Supabase Auth |
| Authorization | ✅ Active | RLS + RBAC |
| Rate Limiting | ✅ Active | Edge function middleware |
| Security Headers | ✅ Active | Response headers |
| Logging | ✅ Active | Auth logs + Security events |
| CSRF Protection | ✅ Active | Token validation |
| XSS Prevention | ✅ Active | CSP + Sanitization |
| SQL Injection Prevention | ✅ Active | Parameterized queries |

---

## Attack Simulation Lab

The Attack Lab provides educational demonstrations of common web vulnerabilities:

### Available Tests

1. **Cross-Site Scripting (XSS)**
   - Reflected XSS payloads
   - DOM-based XSS attempts
   - All blocked by DOMPurify + CSP

2. **SQL Injection**
   - Classic `' OR '1'='1` payloads
   - UNION-based attacks
   - All blocked by parameterized queries

3. **CSRF Attacks**
   - Form submission attempts
   - Cross-origin requests
   - All blocked by CSRF tokens + SameSite cookies

4. **Authentication Bypass**
   - Credential stuffing simulations
   - Brute-force attempts
   - All blocked by rate limiting

5. **JWT Tampering**
   - Algorithm confusion
   - Payload modification
   - All blocked by signature verification

6. **Path Traversal**
   - Directory escape attempts
   - Encoded path attacks
   - All blocked by path whitelisting

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cybershield.git
cd cybershield

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Server-side (Supabase):**
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations
- `SUPABASE_DB_URL` - Database connection

---

## API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Login with rate limiting |
| `/security/log/auth` | POST | Log auth events |

### Security

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/security/logs` | GET | Get security logs (admin) |
| `/security/stats` | GET | Get security statistics (admin) |

### Content

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/projects` | GET/POST | Projects CRUD |
| `/blog` | GET/POST | Blog posts CRUD |
| `/contact` | POST | Contact form (rate limited) |

### Security Tools

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scan` | POST | Vulnerability scan (rate limited) |
| `/threats` | GET | Threat indicators |
| `/soc/incidents` | GET/PUT | SOC incidents |

---

## Future Improvements

### Short Term
- [ ] MFA/OTP implementation
- [ ] Device fingerprinting
- [ ] Geolocation-based alerts
- [ ] Docker containerization

### Medium Term
- [ ] CI/CD security pipeline
- [ ] Automated vulnerability scanning
- [ ] SIEM integration (Splunk/ELK)
- [ ] Honeypot endpoints

### Long Term
- [ ] Custom WAF rules
- [ ] Threat intelligence API
- [ ] Machine learning anomaly detection
- [ ] Compliance reporting (SOC2, HIPAA)

---

## Security Testing

### Vulnerability Scanning

Run regular scans:

```bash
# npm audit
npm audit

# Snyk
npx snyk test

# OWASP Dependency Check
./dependency-check.sh
```

### Manual Testing

1. **XSS Testing**
   - Navigate to Attack Lab
   - Select XSS simulation
   - View blocked payloads

2. **SQL Injection Testing**
   - Try `' OR '1'='1` in forms
   - Observe parameterized query protection

3. **Rate Limiting Testing**
   - Rapidly submit login attempts
   - Observe rate limit activation

---

## License

MIT License - Educational purposes

---

## Acknowledgments

- OWASP Foundation for security guidelines
- Supabase for backend infrastructure
- MITRE ATT&CK for threat intelligence framework

---

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-drry1tin)
