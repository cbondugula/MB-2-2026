/**
 * Encryption Service - Application-Level Encryption for PHI
 * 
 * Provides AES-256-GCM encryption/decryption for Protected Health Information (PHI)
 * as an additional security layer beyond Neon's infrastructure encryption.
 * 
 * HIPAA Compliance: Defense-in-depth strategy with application-level encryption
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;

/**
 * Get encryption key from environment variable
 * In production, this should be stored in AWS Secrets Manager, Azure Key Vault, or Google Secret Manager
 */
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  
  if (!keyHex) {
    // For development only - generate a temporary key
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "ENCRYPTION_KEY environment variable must be set in production. " +
        "Generate with: openssl rand -hex 32"
      );
    }
    
    console.warn(
      "⚠️  WARNING: Using temporary encryption key for development. " +
      "Set ENCRYPTION_KEY environment variable for production."
    );
    
    // Generate deterministic key for development (not secure for production)
    return scryptSync("dev-encryption-key-not-for-production", "salt", KEY_LENGTH);
  }
  
  // Validate key format
  if (!/^[0-9a-f]{64}$/i.test(keyHex)) {
    throw new Error(
      "ENCRYPTION_KEY must be a 64-character hexadecimal string. " +
      "Generate with: openssl rand -hex 32"
    );
  }
  
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypt sensitive data using AES-256-GCM
 * Returns base64-encoded string containing: salt + IV + encrypted data + auth tag
 */
export function encrypt(plaintext: string | null | undefined): string | null {
  if (!plaintext) return null;
  
  try {
    const key = getEncryptionKey();
    const salt = randomBytes(SALT_LENGTH);
    const iv = randomBytes(IV_LENGTH);
    
    // Derive key from master key + salt for added security
    const derivedKey = scryptSync(key, salt, KEY_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
    
    let encrypted = cipher.update(plaintext, "utf8", "base64");
    encrypted += cipher.final("base64");
    
    const authTag = cipher.getAuthTag();
    
    // Format: salt (32) + IV (16) + ciphertext (variable) + authTag (16)
    const combined = Buffer.concat([
      salt,
      iv,
      Buffer.from(encrypted, "base64"),
      authTag,
    ]);
    
    return combined.toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt data encrypted with encrypt()
 * Returns original plaintext string
 */
export function decrypt(ciphertext: string | null | undefined): string | null {
  if (!ciphertext) return null;
  
  try {
    const key = getEncryptionKey();
    const combined = Buffer.from(ciphertext, "base64");
    
    // Extract components
    const salt = combined.subarray(0, SALT_LENGTH);
    const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = combined.subarray(
      SALT_LENGTH + IV_LENGTH,
      combined.length - TAG_LENGTH
    );
    const authTag = combined.subarray(combined.length - TAG_LENGTH);
    
    // Derive same key from master key + salt
    const derivedKey = scryptSync(key, salt, KEY_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted.toString("base64"), "base64", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Encrypt object fields (for JSONB columns)
 * Recursively encrypts all string values in an object
 * Properly handles arrays without corrupting them
 */
export function encryptObject<T extends Record<string, any>>(
  obj: T | null | undefined
): T | null {
  if (!obj) return null;
  
  // Handle arrays separately to preserve array structure
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        return encrypt(item);
      } else if (typeof item === "object" && item !== null) {
        return encryptObject(item);
      } else {
        return item;
      }
    }) as any;
  }
  
  const encrypted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      encrypted[key] = encrypt(value);
    } else if (Array.isArray(value)) {
      encrypted[key] = encryptObject(value as any);
    } else if (typeof value === "object" && value !== null) {
      encrypted[key] = encryptObject(value);
    } else {
      encrypted[key] = value;
    }
  }
  
  return encrypted as T;
}

/**
 * Decrypt object fields (for JSONB columns)
 * Recursively decrypts all string values in an object
 * Properly handles arrays without corrupting them
 */
export function decryptObject<T extends Record<string, any>>(
  obj: T | null | undefined
): T | null {
  if (!obj) return null;
  
  // Handle arrays separately to preserve array structure
  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return decrypt(item);
        } catch {
          // If decryption fails, assume it's not encrypted
          return item;
        }
      } else if (typeof item === "object" && item !== null) {
        return decryptObject(item);
      } else {
        return item;
      }
    }) as any;
  }
  
  const decrypted: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      try {
        decrypted[key] = decrypt(value);
      } catch {
        // If decryption fails, assume it's not encrypted
        decrypted[key] = value;
      }
    } else if (Array.isArray(value)) {
      decrypted[key] = decryptObject(value as any);
    } else if (typeof value === "object" && value !== null) {
      decrypted[key] = decryptObject(value);
    } else {
      decrypted[key] = value;
    }
  }
  
  return decrypted as T;
}

/**
 * Hash data for indexing (one-way)
 * Use this for searchable fields that must remain encrypted at rest
 */
export function hash(data: string): string {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Validate encryption key format
 */
export function validateEncryptionKey(): boolean {
  try {
    const key = getEncryptionKey();
    return key.length === KEY_LENGTH;
  } catch {
    return false;
  }
}

/**
 * Test encryption/decryption round-trip
 */
export function testEncryption(): boolean {
  const testData = "Test PHI Data: Patient John Doe, DOB: 1985-03-15";
  
  try {
    const encrypted = encrypt(testData);
    if (!encrypted) return false;
    
    const decrypted = decrypt(encrypted);
    if (decrypted !== testData) return false;
    
    // Test object encryption
    const testObj = { name: "John Doe", ssn: "123-45-6789" };
    const encryptedObj = encryptObject(testObj);
    if (!encryptedObj) return false;
    
    const decryptedObj = decryptObject(encryptedObj);
    if (JSON.stringify(decryptedObj) !== JSON.stringify(testObj)) return false;
    
    return true;
  } catch (error) {
    console.error("Encryption test failed:", error);
    return false;
  }
}

// Export encryption status for health checks
export function getEncryptionStatus() {
  const keySet = !!process.env.ENCRYPTION_KEY;
  const keyValid = validateEncryptionKey();
  const testPassed = testEncryption();
  
  return {
    enabled: keySet && keyValid && testPassed,
    keySet,
    keyValid,
    testPassed,
    algorithm: ALGORITHM,
    keyLength: KEY_LENGTH,
    environment: process.env.NODE_ENV || "development",
  };
}
