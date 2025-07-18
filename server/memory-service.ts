// Memory Service - Advanced memory management for healthcare AI agents
// Supports both short-term and long-term memory with HIPAA-compliant storage

import { db } from './db';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { conversations, memoryEntries, userPreferences } from '@shared/schema';

export interface MemoryConfig {
  userId: string;
  agentId: string;
  enableShortTermMemory: boolean;
  enableLongTermMemory: boolean;
  shortTermRetentionDays: number;
  longTermRetentionDays: number;
  maxMemoryEntries: number;
  prioritizeImportantInfo: boolean;
  autoSummarization: boolean;
  hipaaCompliant: boolean;
  encryptSensitiveData: boolean;
}

export interface MemoryEntry {
  id: string;
  userId: string;
  agentId: string;
  conversationId: string;
  type: 'short-term' | 'long-term' | 'persistent';
  category: 'medical-history' | 'preferences' | 'context' | 'knowledge' | 'interaction-pattern';
  content: string;
  importance: number; // 0-10 scale
  tags: string[];
  embedding?: number[]; // Vector embedding for semantic search
  createdAt: Date;
  lastAccessed: Date;
  expiresAt?: Date;
  encrypted: boolean;
  metadata: {
    medicalRelevance?: number;
    patientSafety?: boolean;
    clinicalContext?: string;
    sourceType?: string;
    confidence?: number;
  };
}

export interface ConversationContext {
  userId: string;
  agentId: string;
  conversationId: string;
  shortTermMemory: MemoryEntry[];
  longTermMemory: MemoryEntry[];
  currentContext: string;
  medicalContext?: {
    specialty: string;
    patientContext: boolean;
    clinicalSetting: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
}

export interface MemoryQuery {
  userId: string;
  agentId: string;
  query: string;
  type?: 'short-term' | 'long-term' | 'both';
  category?: string;
  limit?: number;
  timeRange?: {
    start: Date;
    end: Date;
  };
  minimumImportance?: number;
}

export class MemoryService {
  private memoryCache = new Map<string, ConversationContext>();
  private readonly maxCacheSize = 1000;
  private readonly defaultConfig: Partial<MemoryConfig> = {
    enableShortTermMemory: true,
    enableLongTermMemory: true,
    shortTermRetentionDays: 7,
    longTermRetentionDays: 365,
    maxMemoryEntries: 10000,
    prioritizeImportantInfo: true,
    autoSummarization: true,
    hipaaCompliant: true,
    encryptSensitiveData: true
  };

  // Initialize or get memory configuration for user
  async getMemoryConfig(userId: string, agentId: string): Promise<MemoryConfig> {
    try {
      const [existing] = await db
        .select()
        .from(userPreferences)
        .where(and(
          eq(userPreferences.userId, userId),
          eq(userPreferences.key, `memory_config_${agentId}`)
        ));

      if (existing) {
        return { ...this.defaultConfig, ...JSON.parse(existing.value), userId, agentId } as MemoryConfig;
      }

      // Create default configuration
      const config: MemoryConfig = {
        ...this.defaultConfig,
        userId,
        agentId
      } as MemoryConfig;

      await this.updateMemoryConfig(config);
      return config;
    } catch (error) {
      console.error('Error getting memory config:', error);
      return { ...this.defaultConfig, userId, agentId } as MemoryConfig;
    }
  }

  // Update memory configuration
  async updateMemoryConfig(config: MemoryConfig): Promise<void> {
    try {
      const configData = {
        enableShortTermMemory: config.enableShortTermMemory,
        enableLongTermMemory: config.enableLongTermMemory,
        shortTermRetentionDays: config.shortTermRetentionDays,
        longTermRetentionDays: config.longTermRetentionDays,
        maxMemoryEntries: config.maxMemoryEntries,
        prioritizeImportantInfo: config.prioritizeImportantInfo,
        autoSummarization: config.autoSummarization,
        hipaaCompliant: config.hipaaCompliant,
        encryptSensitiveData: config.encryptSensitiveData
      };

      await db
        .insert(userPreferences)
        .values({
          userId: config.userId,
          key: `memory_config_${config.agentId}`,
          value: JSON.stringify(configData)
        })
        .onConflictDoUpdate({
          target: [userPreferences.userId, userPreferences.key],
          set: {
            value: JSON.stringify(configData),
            updatedAt: new Date()
          }
        });
    } catch (error) {
      console.error('Error updating memory config:', error);
    }
  }

  // Store memory entry
  async storeMemory(
    userId: string,
    agentId: string,
    conversationId: string,
    content: string,
    type: 'short-term' | 'long-term' | 'persistent',
    category: string,
    importance: number = 5,
    tags: string[] = [],
    metadata: any = {}
  ): Promise<string> {
    const config = await this.getMemoryConfig(userId, agentId);
    
    // Check if memory storage is enabled
    if (type === 'short-term' && !config.enableShortTermMemory) return '';
    if (type === 'long-term' && !config.enableLongTermMemory) return '';

    try {
      const now = new Date();
      const expiresAt = type === 'persistent' ? undefined :
        type === 'short-term' ? 
          new Date(now.getTime() + config.shortTermRetentionDays * 24 * 60 * 60 * 1000) :
          new Date(now.getTime() + config.longTermRetentionDays * 24 * 60 * 60 * 1000);

      // Encrypt sensitive content if required
      const processedContent = config.encryptSensitiveData && this.containsSensitiveInfo(content) ?
        await this.encryptContent(content) : content;

      const [memoryEntry] = await db
        .insert(memoryEntries)
        .values({
          userId,
          agentId,
          conversationId,
          type,
          category,
          content: processedContent,
          importance,
          tags: JSON.stringify(tags),
          createdAt: now,
          lastAccessed: now,
          expiresAt,
          encrypted: config.encryptSensitiveData && this.containsSensitiveInfo(content),
          metadata: JSON.stringify({
            ...metadata,
            medicalRelevance: this.calculateMedicalRelevance(content),
            patientSafety: this.checkPatientSafety(content),
            clinicalContext: this.extractClinicalContext(content),
            sourceType: 'conversation',
            confidence: this.calculateContentConfidence(content)
          })
        })
        .returning();

      // Update cache
      this.updateMemoryCache(userId, agentId, conversationId);

      // Clean up old memories if needed
      if (config.maxMemoryEntries > 0) {
        await this.cleanupOldMemories(userId, agentId, config);
      }

      return memoryEntry.id;
    } catch (error) {
      console.error('Error storing memory:', error);
      return '';
    }
  }

  // Retrieve conversation context with memory
  async getConversationContext(
    userId: string,
    agentId: string,
    conversationId: string,
    includeHistory: boolean = true
  ): Promise<ConversationContext> {
    const cacheKey = `${userId}_${agentId}_${conversationId}`;
    
    // Check cache first
    if (this.memoryCache.has(cacheKey)) {
      const cached = this.memoryCache.get(cacheKey)!;
      // Update last accessed time
      this.updateLastAccessed(cached.shortTermMemory.concat(cached.longTermMemory));
      return cached;
    }

    const config = await this.getMemoryConfig(userId, agentId);
    const context: ConversationContext = {
      userId,
      agentId,
      conversationId,
      shortTermMemory: [],
      longTermMemory: [],
      currentContext: ''
    };

    try {
      const now = new Date();

      // Fetch short-term memory
      if (config.enableShortTermMemory && includeHistory) {
        const shortTermEntries = await db
          .select()
          .from(memoryEntries)
          .where(and(
            eq(memoryEntries.userId, userId),
            eq(memoryEntries.agentId, agentId),
            eq(memoryEntries.type, 'short-term'),
            gte(memoryEntries.expiresAt, now)
          ))
          .orderBy(desc(memoryEntries.importance), desc(memoryEntries.lastAccessed))
          .limit(50);

        context.shortTermMemory = await this.processMemoryEntries(shortTermEntries, config);
      }

      // Fetch long-term memory
      if (config.enableLongTermMemory && includeHistory) {
        const longTermEntries = await db
          .select()
          .from(memoryEntries)
          .where(and(
            eq(memoryEntries.userId, userId),
            eq(memoryEntries.agentId, agentId),
            eq(memoryEntries.type, 'long-term'),
            gte(memoryEntries.expiresAt, now)
          ))
          .orderBy(desc(memoryEntries.importance), desc(memoryEntries.lastAccessed))
          .limit(100);

        context.longTermMemory = await this.processMemoryEntries(longTermEntries, config);
      }

      // Generate current context summary
      context.currentContext = await this.generateContextSummary(context);

      // Extract medical context if applicable
      context.medicalContext = this.extractMedicalContext(context);

      // Cache the context
      this.memoryCache.set(cacheKey, context);
      if (this.memoryCache.size > this.maxCacheSize) {
        const firstKey = this.memoryCache.keys().next().value;
        this.memoryCache.delete(firstKey);
      }

      return context;
    } catch (error) {
      console.error('Error getting conversation context:', error);
      return context;
    }
  }

  // Search memory with semantic similarity
  async searchMemory(query: MemoryQuery): Promise<MemoryEntry[]> {
    try {
      const config = await this.getMemoryConfig(query.userId, query.agentId);
      
      let conditions = [
        eq(memoryEntries.userId, query.userId),
        eq(memoryEntries.agentId, query.agentId)
      ];

      // Add type filter
      if (query.type && query.type !== 'both') {
        conditions.push(eq(memoryEntries.type, query.type));
      }

      // Add category filter
      if (query.category) {
        conditions.push(eq(memoryEntries.category, query.category));
      }

      // Add time range filter
      if (query.timeRange) {
        conditions.push(gte(memoryEntries.createdAt, query.timeRange.start));
        conditions.push(lte(memoryEntries.createdAt, query.timeRange.end));
      }

      // Add importance filter
      if (query.minimumImportance) {
        conditions.push(gte(memoryEntries.importance, query.minimumImportance));
      }

      const results = await db
        .select()
        .from(memoryEntries)
        .where(and(...conditions))
        .orderBy(desc(memoryEntries.importance), desc(memoryEntries.lastAccessed))
        .limit(query.limit || 20);

      const processedResults = await this.processMemoryEntries(results, config);

      // Perform text-based search if no embeddings available
      const filteredResults = processedResults.filter(entry =>
        entry.content.toLowerCase().includes(query.query.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query.query.toLowerCase()))
      );

      // Update last accessed time
      this.updateLastAccessed(filteredResults);

      return filteredResults;
    } catch (error) {
      console.error('Error searching memory:', error);
      return [];
    }
  }

  // Process and decrypt memory entries
  private async processMemoryEntries(entries: any[], config: MemoryConfig): Promise<MemoryEntry[]> {
    return Promise.all(entries.map(async (entry) => {
      let content = entry.content;
      if (entry.encrypted && config.encryptSensitiveData) {
        content = await this.decryptContent(content);
      }

      return {
        id: entry.id,
        userId: entry.userId,
        agentId: entry.agentId,
        conversationId: entry.conversationId,
        type: entry.type,
        category: entry.category,
        content,
        importance: entry.importance,
        tags: JSON.parse(entry.tags || '[]'),
        embedding: entry.embedding ? JSON.parse(entry.embedding) : undefined,
        createdAt: entry.createdAt,
        lastAccessed: entry.lastAccessed,
        expiresAt: entry.expiresAt,
        encrypted: entry.encrypted,
        metadata: JSON.parse(entry.metadata || '{}')
      };
    }));
  }

  // Generate context summary for current conversation
  private async generateContextSummary(context: ConversationContext): Promise<string> {
    const allMemories = [...context.shortTermMemory, ...context.longTermMemory];
    
    if (allMemories.length === 0) {
      return "New conversation with no previous context.";
    }

    // Sort by importance and recency
    const importantMemories = allMemories
      .filter(m => m.importance >= 7)
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 5);

    const recentMemories = allMemories
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .slice(0, 3);

    const contextItems = [];

    if (importantMemories.length > 0) {
      contextItems.push("Important context:");
      importantMemories.forEach(memory => {
        contextItems.push(`- ${memory.content.substring(0, 100)}...`);
      });
    }

    if (recentMemories.length > 0) {
      contextItems.push("\nRecent interactions:");
      recentMemories.forEach(memory => {
        contextItems.push(`- ${memory.content.substring(0, 100)}...`);
      });
    }

    return contextItems.join('\n');
  }

  // Extract medical context from conversation
  private extractMedicalContext(context: ConversationContext): any {
    const allMemories = [...context.shortTermMemory, ...context.longTermMemory];
    
    // Look for medical indicators
    const medicalKeywords = ['patient', 'diagnosis', 'treatment', 'medication', 'symptoms', 'clinical'];
    const hasMedicalContent = allMemories.some(memory =>
      medicalKeywords.some(keyword => 
        memory.content.toLowerCase().includes(keyword) ||
        memory.tags.includes('medical')
      )
    );

    if (!hasMedicalContent) return undefined;

    // Extract specialty
    const specialtyKeywords = {
      'cardiology': ['heart', 'cardiac', 'cardiology'],
      'neurology': ['brain', 'neurological', 'neurology'],
      'oncology': ['cancer', 'tumor', 'oncology'],
      'psychiatry': ['mental', 'psychiatric', 'therapy']
    };

    let detectedSpecialty = 'general';
    for (const [specialty, keywords] of Object.entries(specialtyKeywords)) {
      if (allMemories.some(memory =>
        keywords.some(keyword => memory.content.toLowerCase().includes(keyword))
      )) {
        detectedSpecialty = specialty;
        break;
      }
    }

    // Determine urgency level
    const urgencyKeywords = {
      'critical': ['emergency', 'critical', 'urgent', 'stat'],
      'high': ['important', 'priority', 'serious'],
      'medium': ['routine', 'follow-up'],
      'low': ['general', 'information']
    };

    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (allMemories.some(memory =>
        keywords.some(keyword => memory.content.toLowerCase().includes(keyword))
      )) {
        urgencyLevel = level as any;
        break;
      }
    }

    return {
      specialty: detectedSpecialty,
      patientContext: allMemories.some(m => m.category === 'medical-history'),
      clinicalSetting: 'consultation',
      urgencyLevel
    };
  }

  // Utility methods for content analysis
  private containsSensitiveInfo(content: string): boolean {
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /patient.*id|medical.*record|mrn/i // Medical identifiers
    ];
    
    return sensitivePatterns.some(pattern => pattern.test(content));
  }

  private calculateMedicalRelevance(content: string): number {
    const medicalTerms = [
      'diagnosis', 'treatment', 'medication', 'symptoms', 'patient',
      'clinical', 'medical', 'therapy', 'procedure', 'condition'
    ];
    
    const matches = medicalTerms.filter(term =>
      content.toLowerCase().includes(term)
    ).length;
    
    return Math.min(matches / medicalTerms.length * 10, 10);
  }

  private checkPatientSafety(content: string): boolean {
    const safetyKeywords = [
      'allergy', 'contraindication', 'adverse', 'reaction',
      'emergency', 'critical', 'urgent', 'warning'
    ];
    
    return safetyKeywords.some(keyword =>
      content.toLowerCase().includes(keyword)
    );
  }

  private extractClinicalContext(content: string): string {
    const contexts = {
      'consultation': ['consultation', 'visit', 'appointment'],
      'emergency': ['emergency', 'urgent', 'stat'],
      'follow-up': ['follow-up', 'followup', 'review'],
      'diagnostic': ['test', 'lab', 'imaging', 'diagnostic']
    };
    
    for (const [context, keywords] of Object.entries(contexts)) {
      if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
        return context;
      }
    }
    
    return 'general';
  }

  private calculateContentConfidence(content: string): number {
    // Simple confidence calculation based on content characteristics
    let confidence = 0.5;
    
    if (content.length > 50) confidence += 0.2;
    if (content.includes('?')) confidence -= 0.1;
    if (/\b(confirmed|diagnosed|established)\b/i.test(content)) confidence += 0.3;
    if (/\b(possible|maybe|uncertain)\b/i.test(content)) confidence -= 0.2;
    
    return Math.max(0, Math.min(1, confidence));
  }

  private async encryptContent(content: string): Promise<string> {
    // Implement encryption logic for sensitive content
    // This is a placeholder - use proper encryption in production
    return Buffer.from(content).toString('base64');
  }

  private async decryptContent(encryptedContent: string): Promise<string> {
    // Implement decryption logic
    // This is a placeholder - use proper decryption in production
    return Buffer.from(encryptedContent, 'base64').toString();
  }

  private updateLastAccessed(memories: MemoryEntry[]): void {
    const now = new Date();
    memories.forEach(async (memory) => {
      try {
        await db
          .update(memoryEntries)
          .set({ lastAccessed: now })
          .where(eq(memoryEntries.id, memory.id));
      } catch (error) {
        console.error('Error updating last accessed:', error);
      }
    });
  }

  private updateMemoryCache(userId: string, agentId: string, conversationId: string): void {
    const cacheKey = `${userId}_${agentId}_${conversationId}`;
    this.memoryCache.delete(cacheKey); // Invalidate cache to force refresh
  }

  private async cleanupOldMemories(userId: string, agentId: string, config: MemoryConfig): Promise<void> {
    try {
      const now = new Date();
      
      // Delete expired memories
      await db
        .delete(memoryEntries)
        .where(and(
          eq(memoryEntries.userId, userId),
          eq(memoryEntries.agentId, agentId),
          lte(memoryEntries.expiresAt, now)
        ));

      // Count current memories
      const memoryCount = await db
        .select({ count: memoryEntries.id })
        .from(memoryEntries)
        .where(and(
          eq(memoryEntries.userId, userId),
          eq(memoryEntries.agentId, agentId)
        ));

      // If over limit, remove least important/oldest memories
      if (memoryCount.length > config.maxMemoryEntries) {
        const excessCount = memoryCount.length - config.maxMemoryEntries;
        
        const oldestMemories = await db
          .select()
          .from(memoryEntries)
          .where(and(
            eq(memoryEntries.userId, userId),
            eq(memoryEntries.agentId, agentId)
          ))
          .orderBy(memoryEntries.importance, memoryEntries.lastAccessed)
          .limit(excessCount);

        for (const memory of oldestMemories) {
          await db
            .delete(memoryEntries)
            .where(eq(memoryEntries.id, memory.id));
        }
      }
    } catch (error) {
      console.error('Error cleaning up old memories:', error);
    }
  }

  // Clear all memory for a user/agent
  async clearMemory(
    userId: string, 
    agentId: string, 
    type?: 'short-term' | 'long-term' | 'all'
  ): Promise<boolean> {
    try {
      let conditions = [
        eq(memoryEntries.userId, userId),
        eq(memoryEntries.agentId, agentId)
      ];

      if (type && type !== 'all') {
        conditions.push(eq(memoryEntries.type, type));
      }

      await db
        .delete(memoryEntries)
        .where(and(...conditions));

      // Clear cache
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(`${userId}_${agentId}`)) {
          this.memoryCache.delete(key);
        }
      }

      return true;
    } catch (error) {
      console.error('Error clearing memory:', error);
      return false;
    }
  }

  // Get memory statistics
  async getMemoryStats(userId: string, agentId: string): Promise<any> {
    try {
      const stats = await db
        .select({
          type: memoryEntries.type,
          category: memoryEntries.category,
          count: memoryEntries.id
        })
        .from(memoryEntries)
        .where(and(
          eq(memoryEntries.userId, userId),
          eq(memoryEntries.agentId, agentId)
        ));

      const grouped = stats.reduce((acc, stat) => {
        if (!acc[stat.type]) acc[stat.type] = {};
        if (!acc[stat.type][stat.category]) acc[stat.type][stat.category] = 0;
        acc[stat.type][stat.category]++;
        return acc;
      }, {} as any);

      return {
        totalEntries: stats.length,
        byType: grouped,
        cacheSize: this.memoryCache.size
      };
    } catch (error) {
      console.error('Error getting memory stats:', error);
      return { totalEntries: 0, byType: {}, cacheSize: 0 };
    }
  }
}

// Export singleton instance
export const memoryService = new MemoryService();