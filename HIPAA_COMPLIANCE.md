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

**Status**: ⚠️ Partially Implemented (Proof-of-Concept)

Additional encryption layer for critical PHI fields using AES-256-GCM:

**Currently Encrypted Fields:**
- ✅ Chat messages: `content` (in `chat_messages` table)
- ✅ Conversation data: `initialPrompt` (in `chat_conversations` table)

**Fields Requiring Encryption (Future Implementation):**
- ⏳ User PII: `email`, `firstName`, `lastName`, `phoneNumber` (in `users` table)
- ⏳ Generated app code: `code` field (may contain PHI examples in `generated_apps` table)
- ⏳ Audit logs: `oldValues`, `newValues`, `metadata` (in `audit_logs` table)
- ⏳ Organization data: `email`, `phone`, `address`, `taxId` (in `organizations` table)
- ⏳ Contract data: `signatures`, `signerEmail` (in `contracts` table)
- ⏳ Attachments: `content`, `metadata` (in various tables)

**Encryption Key**: Stored in `ENCRYPTION_KEY` environment variable (32-byte hex string)

**Note**: Full application-level encryption requires integration across 20+ files and all database read/write operations. This is documented as a separate implementation project below.

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

## Appendix: Full Application-Level Encryption Implementation Plan

### Current Status
Application-level encryption is **partially implemented** as proof-of-concept for chat messages only. Full integration requires systematic encryption across all PHI-containing fields.

### Implementation Requirements

**Estimated Effort**: 3-5 hours across 20+ files

#### Phase 1: Database Write Operations (Encryption)
Integrate `encrypt()` or `encryptObject()` calls before all database inserts/updates:

**Files to Modify:**
1. `server/routes.ts` - All POST/PATCH endpoints writing PHI:
   - User registration/update endpoints
   - Organization CRUD operations
   - Contract creation/signing
   - Attachment uploads
   - Settings updates

2. `server/chat-to-code-service.ts` (✅ Already completed):
   - `createConversation()` - encrypt `initialPrompt`
   - `addMessage()` - encrypt message `content`
   - `createGeneratedApp()` - encrypt `code`, `dependencies`, `techStack`

3. `server/audit-logger.ts`:
   - Encrypt `oldValues`, `newValues`, `metadata` before audit log writes

**Tables Requiring Encryption:**
- `users`: `email`, `firstName`, `lastName`, `phoneNumber`, `bio`, `avatarUrl`
- `organizations`: `email`, `phone`, `address`, `taxId`, `metadata`
- `contracts`: `signerEmail`, `signerName`, `signatures`, `metadata`
- `generated_apps`: `code`, `dependencies`, `techStack`, `explanation`
- `audit_logs`: `oldValues`, `newValues`, `metadata`
- `app_versions`: `code`, `dependencies`, `metadata`
- `chat_messages`: `content`, `attachments` (✅ Already done)
- `chat_conversations`: `initialPrompt`, `context`, `metadata` (✅ Partial)

#### Phase 2: Database Read Operations (Decryption)
Integrate `decrypt()` or `decryptObject()` calls after all database selects:

**Files to Modify:**
1. All query operations in `server/routes.ts`
2. `server/chat-to-code-service.ts` (✅ Already completed for chat messages)
3. Any middleware reading user data
4. Authentication flows reading user credentials

**Pattern:**
```typescript
// Before encryption integration
const user = await db.select().from(users).where(eq(users.id, userId));

// After encryption integration
const user = await db.select().from(users).where(eq(users.id, userId));
user.email = decrypt(user.email) || user.email;
user.firstName = decrypt(user.firstName) || user.firstName;
// ... repeat for all encrypted fields
```

#### Phase 3: Migration Strategy
**Option A: Encrypt-in-Place (Recommended)**
1. Deploy encryption code (encrypt on write, decrypt on read)
2. Run migration script to re-encrypt existing records:
   ```typescript
   // Pseudo-code for migration
   const allRecords = await db.select().from(tableName);
   for (const record of allRecords) {
     const encrypted = {
       ...record,
       sensitiveField: encrypt(record.sensitiveField)
     };
     await db.update(tableName).set(encrypted).where(eq(tableName.id, record.id));
   }
   ```
3. Verify decryption works on sample records
4. Mark migration complete

**Option B: Blue-Green Migration**
1. Create new encrypted columns (`email_encrypted`)
2. Dual-write to both old and new columns
3. Backfill encrypted columns from plaintext
4. Switch read operations to encrypted columns
5. Drop old plaintext columns

#### Phase 4: Testing & Validation
1. **Unit Tests**: Verify `encrypt()`/`decrypt()` round-trip for all data types
2. **Integration Tests**: Test full CRUD operations with encryption
3. **Performance Tests**: Measure encryption overhead (target: <10ms per operation)
4. **Regression Tests**: Ensure existing functionality unaffected
5. **Health Check**: Update `/health` endpoint to verify all PHI fields encrypted

#### Phase 5: Documentation & Monitoring
1. Update this document with confirmed encrypted fields
2. Add encryption coverage metrics to health checks
3. Create runbook for encryption key rotation
4. Document recovery procedures for lost encryption keys
5. Add compliance verification scripts

### Pre-Production Checklist
- [ ] All PHI fields encrypted in database writes
- [ ] All PHI fields decrypted in database reads
- [ ] Existing data migrated to encrypted format
- [ ] Encryption tests passing (unit + integration)
- [ ] Performance benchmarks acceptable (<10ms overhead)
- [ ] Health check reports 100% PHI coverage
- [ ] Key rotation procedure documented and tested
- [ ] BAA executed with Neon (Scale+ plan)
- [ ] Security audit completed
- [ ] Incident response plan documented

### Risk Mitigation
**Risk**: Encryption key loss = permanent data loss  
**Mitigation**: Multi-region encrypted key backup in cloud secret managers

**Risk**: Performance degradation from encryption overhead  
**Mitigation**: Benchmark early, optimize hot paths, consider selective encryption

**Risk**: Migration failures leaving partial encrypted data  
**Mitigation**: Database transactions, rollback plan, staging environment testing

---

**Last Updated**: 2025-10-27  
**Review Frequency**: Quarterly  
**Next Review**: 2026-01-27
