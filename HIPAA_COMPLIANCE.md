# HIPAA Compliance Configuration Guide

## Overview

MedBuilder implements multi-layer encryption and HIPAA compliance controls to protect Protected Health Information (PHI) and ensure regulatory compliance.

## Encryption Architecture

### 1. Infrastructure-Level Encryption (Neon PostgreSQL)

**Status**: ✅ Enabled by default

Neon PostgreSQL provides built-in encryption at rest and in transit:

- **Encryption at Rest**: AES-256 block cipher on NVMe SSD volumes
- **Key Management**: AWS KMS / Azure Key Vault with automatic rotation
- **Backup Encryption**: S3/Azure Blob Storage with server-side encryption (SSE)
- **Encryption in Transit**: TLS 1.2/1.3 with verify-full SSL mode

**No configuration required** - This is active on all Neon instances.

### 2. Application-Level Encryption

**Status**: ✅ Implemented

Additional encryption layer for critical PHI fields using AES-256-GCM:

**Encrypted Fields:**
- User PII: email, firstName, lastName
- Chat messages: content, attachments
- Conversation data: initialPrompt, context
- Generated app code: code field (may contain PHI examples)
- Audit logs: oldValues, newValues, metadata
- Organization data: email, phone, address, taxId
- Contract data: signatures

**Encryption Key**: Stored in `ENCRYPTION_KEY` environment variable (32-byte hex string)

### 3. Database-Level Audit Logging

**Status**: ✅ Implemented

Comprehensive audit trail tracking all PHI access:

- User ID, action type (CREATE/READ/UPDATE/DELETE)
- Table name, record ID
- IP address, user agent
- Timestamp, old/new values
- Contextual metadata

All audit logs stored in `audit_logs` table with indexed queries for compliance reporting.

## Production Deployment Requirements

### Step 1: Enable Neon HIPAA Compliance

**Prerequisites:**
1. Upgrade to Neon **Scale, Business, or Enterprise** plan
2. Contact Neon Sales to execute a Business Associate Agreement (BAA)
3. Enable HIPAA features through Neon dashboard

**Cost**: 15% surcharge on monthly invoice (pricing finalized soon)

**Features Unlocked:**
- pgAudit logging (SELECT, INSERT, UPDATE, DELETE, FUNCTION, ROLE)
- Enhanced access controls
- Compliance monitoring
- BAA coverage for Neon's role as a Business Associate

**Documentation**: https://neon.com/docs/security/hipaa

### Step 2: Configure Environment Variables

Add to production environment (DO NOT commit to repository):

```bash
# Encryption Key (generate using: openssl rand -hex 32)
ENCRYPTION_KEY=<64-character-hex-string>

# Database encryption in transit
DATABASE_SSL_MODE=verify-full
DATABASE_SSL_CERT_PATH=/path/to/ca-certificate.crt

# Session security
SESSION_SECRET=<strong-random-secret>
SESSION_SECURE=true
SESSION_HTTPONLY=true
SESSION_SAMESITE=strict

# API rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Audit log retention (days)
AUDIT_LOG_RETENTION_DAYS=2555  # 7 years for HIPAA
```

### Step 3: Generate Encryption Key

Run this command and save the output as `ENCRYPTION_KEY`:

```bash
openssl rand -hex 32
```

**CRITICAL**: Store this key securely:
- Use cloud secret management (AWS Secrets Manager, Azure Key Vault, Google Secret Manager)
- Enable automatic key rotation (recommended: every 90 days)
- Backup keys in offline secure storage
- Never commit keys to version control

### Step 4: Key Rotation Procedure

When rotating encryption keys (manual process):

1. **Generate new key**: `openssl rand -hex 32`
2. **Set as `ENCRYPTION_KEY_NEW`** environment variable
3. **Re-encrypt existing data**: 
   - Query all encrypted records from database
   - Decrypt with old key (`ENCRYPTION_KEY`)
   - Encrypt with new key (`ENCRYPTION_KEY_NEW`)
   - Update database records with re-encrypted data
   - **IMPORTANT**: Perform during maintenance window with database transactions
4. **Verify re-encryption**: Test sample records to confirm decryption with new key works
5. **Rotate keys**:
   - Backup old `ENCRYPTION_KEY` securely (archive for 7 years per HIPAA)
   - Replace `ENCRYPTION_KEY` with `ENCRYPTION_KEY_NEW`
   - Remove `ENCRYPTION_KEY_NEW` variable
6. **Monitor**: Check application logs and health endpoint for encryption errors

**Note**: Automated key rotation script should be implemented before production deployment to reduce human error risk.

### Step 5: Enable SSL/TLS Verification

Download Neon SSL certificate:

```bash
curl https://neon.tech/ca.crt -o /path/to/ca-certificate.crt
```

Update database connection to use verify-full SSL mode.

## HIPAA Compliance Checklist

### Technical Safeguards

- [x] Encryption at rest (AES-256)
- [x] Encryption in transit (TLS 1.2/1.3)
- [x] Application-level encryption for PHI fields
- [x] Comprehensive audit logging (CREATE/READ/UPDATE/DELETE)
- [ ] Automatic session timeout (implement in production)
- [ ] Multi-factor authentication (implement for admin users)
- [ ] IP whitelisting for sensitive operations
- [ ] Intrusion detection and prevention

### Administrative Safeguards

- [ ] Execute Business Associate Agreement (BAA) with Neon
- [ ] Document all BAAs with third-party services (OpenAI, Stripe, etc.)
- [ ] HIPAA training for all personnel
- [ ] Incident response plan
- [ ] Regular security risk assessments
- [ ] Disaster recovery and backup procedures

### Physical Safeguards

- [x] Data center security (provided by Neon/AWS/Azure)
- [x] Hardware encryption (provided by Neon)
- [x] Secure data disposal (provided by Neon)

### Compliance Monitoring

- [x] Audit log retention (7 years)
- [ ] Regular compliance audits
- [ ] Automated compliance scanning
- [ ] Breach notification procedures
- [ ] Data access reports for patients

## PHI Handling Best Practices

### DO:
✅ Store PHI only in encrypted database columns  
✅ Log access to PHI in audit_logs table  
✅ Use parameterized queries to prevent SQL injection  
✅ Implement role-based access control (RBAC)  
✅ Require authentication for all PHI access  
✅ Use HTTPS for all API communications  
✅ Sanitize error messages (don't expose PHI in errors)  

### DON'T:
❌ Log PHI content in application logs (Winston, console.log)  
❌ Store PHI in schema descriptions or metadata  
❌ Include PHI in API URLs or query parameters  
❌ Expose PHI in error messages or stack traces  
❌ Cache PHI in browser localStorage/sessionStorage  
❌ Send PHI via email or unencrypted channels  
❌ Share database credentials or encryption keys  

## Audit Log Queries

### Recent PHI Access by User
```sql
SELECT * FROM audit_logs 
WHERE user_id = $1 
AND table_name IN ('chat_messages', 'users', 'generated_apps')
ORDER BY timestamp DESC 
LIMIT 100;
```

### All PHI Modifications Today
```sql
SELECT * FROM audit_logs 
WHERE action IN ('CREATE', 'UPDATE', 'DELETE')
AND timestamp >= CURRENT_DATE
ORDER BY timestamp DESC;
```

### Failed Access Attempts
```sql
SELECT * FROM audit_logs 
WHERE metadata->>'error' IS NOT NULL
ORDER BY timestamp DESC;
```

## Incident Response

If PHI breach suspected:

1. **Immediate**: Isolate affected systems, preserve audit logs
2. **24 hours**: Notify HIPAA compliance officer
3. **48 hours**: Conduct forensic analysis, determine scope
4. **60 days**: Notify affected individuals (if >500 people: also notify HHS and media)
5. **Document**: All investigation steps, remediation actions

Contact: security@medbuilder.com

## Third-Party BAA Requirements

All services processing PHI require executed BAAs:

- **Neon PostgreSQL**: ✅ Available on Scale+ plans
- **OpenAI**: ⚠️ BAA required for production (contact OpenAI Enterprise)
- **Stripe**: ✅ BAA available for payment processing
- **Replit Auth**: ⚠️ Review Replit's HIPAA compliance status

## Compliance Monitoring Dashboard

Access audit logs and compliance metrics:

```
GET /api/compliance/audit-logs?userId=<id>&days=30
GET /api/compliance/phi-access-report?startDate=YYYY-MM-DD
GET /api/compliance/breach-detection
```

## Annual Compliance Activities

- **Quarterly**: Security risk assessment
- **Annually**: HIPAA compliance audit, penetration testing
- **Continuous**: Monitoring audit logs, vulnerability scanning

## Resources

- HIPAA Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/index.html
- Neon HIPAA Docs: https://neon.com/docs/security/hipaa
- HHS Breach Notification Rule: https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html

---

**Last Updated**: 2025-10-27  
**Review Frequency**: Quarterly  
**Next Review**: 2026-01-27
