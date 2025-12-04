import { db } from "./db";
import { eq, desc, asc, and, ilike, gte, lte, sql, or } from "drizzle-orm";
import {
  publicTemplates,
  sharedLinks,
  showcases,
  showcaseVotes,
  usageQuotas,
  wearableIntegrations,
  wearableData,
  telehealthSessions,
  ehrIntegrations,
  ehrSyncLogs,
  voiceCommands,
  voiceModels,
  translations,
  locales,
  offlineManifests,
  syncQueue,
  marketplaceTemplates,
  marketplacePurchases,
  marketplaceReviews,
  badges,
  userBadges,
  userPoints,
  courses,
  lessons,
  enrollments,
  teams,
  teamMembers,
  teamInvites,
  whiteLabelBranding,
  complianceRecommendations,
  complianceEvents,
  templates,
  projects,
  type PublicTemplate,
  type InsertPublicTemplate,
  type SharedLink,
  type InsertSharedLink,
  type Showcase,
  type InsertShowcase,
  type ShowcaseVote,
  type InsertShowcaseVote,
  type UsageQuota,
  type InsertUsageQuota,
  type WearableIntegration,
  type InsertWearableIntegration,
  type WearableData,
  type InsertWearableData,
  type TelehealthSession,
  type InsertTelehealthSession,
  type EhrIntegration,
  type InsertEhrIntegration,
  type VoiceCommand,
  type InsertVoiceCommand,
  type Translation,
  type Locale,
  type MarketplaceTemplate,
  type InsertMarketplaceTemplate,
  type MarketplacePurchase,
  type InsertMarketplacePurchase,
  type Badge,
  type UserBadge,
  type InsertUserBadge,
  type UserPoints,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type Team,
  type InsertTeam,
  type TeamMember,
  type InsertTeamMember,
  type TeamInvite,
  type InsertTeamInvite,
  type WhiteLabelBranding,
  type InsertWhiteLabelBranding,
  type ComplianceRecommendation,
  type InsertComplianceRecommendation,
  type ComplianceEvent,
  type InsertComplianceEvent,
} from "@shared/schema";

export const viralGrowthStorage = {
  // ============================================
  // PUBLIC TEMPLATES
  // ============================================
  
  async getPublicTemplates(options: { category?: string; search?: string; sort?: string }): Promise<PublicTemplate[]> {
    const { category, search, sort = "popular" } = options;
    
    let query = db.select().from(publicTemplates).where(eq(publicTemplates.visibility, "public"));
    
    const results = await query;
    
    let filtered = results;
    if (category) {
      filtered = filtered.filter(t => (t.tags as string[])?.includes(category));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.ogTitle?.toLowerCase().includes(searchLower) || 
        t.ogDescription?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort
    if (sort === "popular") {
      filtered.sort((a, b) => (b.forkCount || 0) - (a.forkCount || 0));
    } else if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    } else if (sort === "views") {
      filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    }
    
    return filtered;
  },
  
  async getPublicTemplateBySlug(slug: string): Promise<PublicTemplate | null> {
    const [template] = await db.select().from(publicTemplates).where(eq(publicTemplates.shareSlug, slug));
    return template || null;
  },
  
  async createPublicTemplate(data: InsertPublicTemplate): Promise<PublicTemplate> {
    const [template] = await db.insert(publicTemplates).values(data).returning();
    return template;
  },
  
  async incrementPublicTemplateViews(id: number): Promise<void> {
    await db.update(publicTemplates)
      .set({ viewCount: sql`${publicTemplates.viewCount} + 1` })
      .where(eq(publicTemplates.id, id));
  },
  
  async incrementPublicTemplateForks(templateId: number): Promise<void> {
    await db.update(publicTemplates)
      .set({ forkCount: sql`${publicTemplates.forkCount} + 1` })
      .where(eq(publicTemplates.templateId, templateId));
  },
  
  async forkTemplate(templateId: number, userId: string): Promise<any> {
    const [template] = await db.select().from(templates).where(eq(templates.id, templateId));
    if (!template) throw new Error("Template not found");
    
    const [project] = await db.insert(projects).values({
      name: `${template.name} (Fork)`,
      description: template.description,
      userId,
      templateId,
      framework: template.framework,
      backend: template.backend,
      projectType: template.projectType,
      code: template.code,
      isHipaaCompliant: template.isHipaaCompliant,
    }).returning();
    
    return project;
  },
  
  // ============================================
  // SHARED LINKS
  // ============================================
  
  async createSharedLink(data: InsertSharedLink): Promise<SharedLink> {
    const [link] = await db.insert(sharedLinks).values(data).returning();
    return link;
  },
  
  async getSharedLinkBySlug(slug: string): Promise<SharedLink | null> {
    const [link] = await db.select().from(sharedLinks)
      .where(and(eq(sharedLinks.slug, slug), eq(sharedLinks.isActive, true)));
    return link || null;
  },
  
  async incrementSharedLinkViews(id: number): Promise<void> {
    await db.update(sharedLinks)
      .set({ viewCount: sql`${sharedLinks.viewCount} + 1` })
      .where(eq(sharedLinks.id, id));
  },
  
  // ============================================
  // SHOWCASES
  // ============================================
  
  async getShowcases(options: { category?: string; sort?: string; page?: number; limit?: number }): Promise<{ showcases: Showcase[]; total: number }> {
    const { category, sort = "popular", page = 1, limit = 20 } = options;
    
    let query = db.select().from(showcases).where(eq(showcases.status, "approved"));
    
    const results = await query;
    
    let filtered = results;
    if (category) {
      filtered = filtered.filter(s => s.category === category);
    }
    
    // Sort
    if (sort === "popular") {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    } else if (sort === "views") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return { showcases: paginated, total: filtered.length };
  },
  
  async getFeaturedShowcases(): Promise<Showcase[]> {
    return db.select().from(showcases)
      .where(eq(showcases.isFeatured, true))
      .orderBy(desc(showcases.featuredAt))
      .limit(10);
  },
  
  async createShowcase(data: InsertShowcase): Promise<Showcase> {
    const [showcase] = await db.insert(showcases).values(data).returning();
    return showcase;
  },
  
  async getShowcaseVote(showcaseId: number, userId: string): Promise<ShowcaseVote | null> {
    const [vote] = await db.select().from(showcaseVotes)
      .where(and(eq(showcaseVotes.showcaseId, showcaseId), eq(showcaseVotes.userId, userId)));
    return vote || null;
  },
  
  async createShowcaseVote(data: InsertShowcaseVote): Promise<ShowcaseVote> {
    const [vote] = await db.insert(showcaseVotes).values(data).returning();
    return vote;
  },
  
  async updateShowcaseVote(id: number, voteType: string): Promise<void> {
    await db.update(showcaseVotes).set({ voteType }).where(eq(showcaseVotes.id, id));
  },
  
  async updateShowcaseLikes(showcaseId: number): Promise<void> {
    const votes = await db.select().from(showcaseVotes).where(eq(showcaseVotes.showcaseId, showcaseId));
    const likes = votes.filter(v => v.voteType === "up").length - votes.filter(v => v.voteType === "down").length;
    await db.update(showcases).set({ likes }).where(eq(showcases.id, showcaseId));
  },
  
  // ============================================
  // USAGE QUOTAS
  // ============================================
  
  async getUsageQuota(userId: string): Promise<UsageQuota | null> {
    const [quota] = await db.select().from(usageQuotas).where(eq(usageQuotas.userId, userId));
    return quota || null;
  },
  
  async createUsageQuota(data: InsertUsageQuota): Promise<UsageQuota> {
    const [quota] = await db.insert(usageQuotas).values(data).returning();
    return quota;
  },
  
  async incrementProjectsUsed(userId: string): Promise<void> {
    await db.update(usageQuotas)
      .set({ projectsUsed: sql`${usageQuotas.projectsUsed} + 1` })
      .where(eq(usageQuotas.userId, userId));
  },
  
  async incrementAiCallsUsed(userId: string): Promise<void> {
    await db.update(usageQuotas)
      .set({ aiCallsUsed: sql`${usageQuotas.aiCallsUsed} + 1` })
      .where(eq(usageQuotas.userId, userId));
  },
  
  // ============================================
  // WEARABLES
  // ============================================
  
  async createWearableIntegration(data: InsertWearableIntegration): Promise<WearableIntegration> {
    const [integration] = await db.insert(wearableIntegrations).values(data).returning();
    return integration;
  },
  
  async getWearableData(options: { userId: string; provider?: string; projectId?: number; dataType?: string; startDate?: Date; endDate?: Date }): Promise<WearableData[]> {
    const integrations = await db.select().from(wearableIntegrations)
      .where(eq(wearableIntegrations.userId, options.userId));
    
    if (integrations.length === 0) return [];
    
    const integrationIds = integrations.map(i => i.id);
    let results = await db.select().from(wearableData)
      .where(sql`${wearableData.integrationId} IN ${integrationIds}`);
    
    if (options.dataType) {
      results = results.filter(d => d.dataType === options.dataType);
    }
    if (options.startDate) {
      results = results.filter(d => new Date(d.recordedAt) >= options.startDate!);
    }
    if (options.endDate) {
      results = results.filter(d => new Date(d.recordedAt) <= options.endDate!);
    }
    
    return results;
  },
  
  // ============================================
  // TELEHEALTH
  // ============================================
  
  async createTelehealthSession(data: InsertTelehealthSession): Promise<TelehealthSession> {
    const [session] = await db.insert(telehealthSessions).values(data).returning();
    return session;
  },
  
  async getTelehealthSession(id: number): Promise<TelehealthSession | null> {
    const [session] = await db.select().from(telehealthSessions).where(eq(telehealthSessions.id, id));
    return session || null;
  },
  
  async updateTelehealthSession(id: number, data: Partial<TelehealthSession>): Promise<TelehealthSession> {
    const [session] = await db.update(telehealthSessions).set(data).where(eq(telehealthSessions.id, id)).returning();
    return session;
  },
  
  // ============================================
  // EHR
  // ============================================
  
  async createEhrIntegration(data: InsertEhrIntegration): Promise<EhrIntegration> {
    const [integration] = await db.insert(ehrIntegrations).values(data).returning();
    return integration;
  },
  
  async getEhrIntegrations(projectId: number): Promise<EhrIntegration[]> {
    return db.select().from(ehrIntegrations).where(eq(ehrIntegrations.projectId, projectId));
  },
  
  // ============================================
  // VOICE COMMANDS
  // ============================================
  
  async createVoiceCommand(data: InsertVoiceCommand): Promise<VoiceCommand> {
    const [command] = await db.insert(voiceCommands).values(data).returning();
    return command;
  },
  
  async updateVoiceCommand(id: number, data: Partial<VoiceCommand>): Promise<VoiceCommand> {
    const [command] = await db.update(voiceCommands).set(data).where(eq(voiceCommands.id, id)).returning();
    return command;
  },
  
  async getVoiceCommands(projectId: number, userId: string): Promise<VoiceCommand[]> {
    return db.select().from(voiceCommands)
      .where(and(eq(voiceCommands.projectId, projectId), eq(voiceCommands.userId, userId)))
      .orderBy(desc(voiceCommands.createdAt))
      .limit(50);
  },
  
  // ============================================
  // TRANSLATIONS
  // ============================================
  
  async getLocales(): Promise<Locale[]> {
    return db.select().from(locales).where(eq(locales.isActive, true));
  },
  
  async getTranslations(locale: string, namespace: string): Promise<Translation[]> {
    return db.select().from(translations)
      .where(and(eq(translations.locale, locale), eq(translations.namespace, namespace)));
  },
  
  // ============================================
  // MARKETPLACE
  // ============================================
  
  async getMarketplaceTemplates(options: { category?: string; sort?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }): Promise<{ templates: MarketplaceTemplate[]; total: number }> {
    const { category, sort = "popular", minPrice, maxPrice, page = 1, limit = 20 } = options;
    
    let results = await db.select().from(marketplaceTemplates)
      .where(eq(marketplaceTemplates.status, "approved"));
    
    if (category) {
      results = results.filter(t => t.category === category);
    }
    if (minPrice !== undefined) {
      results = results.filter(t => (t.price || 0) >= minPrice);
    }
    if (maxPrice !== undefined) {
      results = results.filter(t => (t.price || 0) <= maxPrice);
    }
    
    if (sort === "popular") {
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sort === "recent") {
      results.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    } else if (sort === "price_low") {
      results.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price_high") {
      results.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "rating") {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + limit);
    
    return { templates: paginated, total: results.length };
  },
  
  async getMarketplaceTemplate(id: number): Promise<MarketplaceTemplate | null> {
    const [template] = await db.select().from(marketplaceTemplates).where(eq(marketplaceTemplates.id, id));
    return template || null;
  },
  
  async createMarketplaceListing(data: InsertMarketplaceTemplate): Promise<MarketplaceTemplate> {
    const [listing] = await db.insert(marketplaceTemplates).values(data).returning();
    return listing;
  },
  
  async createMarketplacePurchase(data: InsertMarketplacePurchase): Promise<MarketplacePurchase> {
    const [purchase] = await db.insert(marketplacePurchases).values(data).returning();
    return purchase;
  },
  
  async incrementMarketplaceDownloads(id: number): Promise<void> {
    await db.update(marketplaceTemplates)
      .set({ downloads: sql`${marketplaceTemplates.downloads} + 1` })
      .where(eq(marketplaceTemplates.id, id));
  },
  
  // ============================================
  // BADGES & GAMIFICATION
  // ============================================
  
  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges).where(eq(badges.isActive, true));
  },
  
  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    const userBadgeList = await db.select().from(userBadges).where(eq(userBadges.userId, userId));
    const result = [];
    
    for (const ub of userBadgeList) {
      const [badge] = await db.select().from(badges).where(eq(badges.id, ub.badgeId));
      if (badge) {
        result.push({ ...ub, badge });
      }
    }
    
    return result;
  },
  
  async getUserPoints(userId: string): Promise<UserPoints | null> {
    const [points] = await db.select().from(userPoints).where(eq(userPoints.userId, userId));
    return points || null;
  },
  
  async awardBadge(userId: string, badgeCode: string): Promise<UserBadge | null> {
    const [badge] = await db.select().from(badges).where(eq(badges.code, badgeCode));
    if (!badge) return null;
    
    // Check if already has badge
    const [existing] = await db.select().from(userBadges)
      .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badge.id)));
    if (existing) return existing;
    
    const [userBadge] = await db.insert(userBadges).values({ userId, badgeId: badge.id }).returning();
    
    // Award points
    await db.update(userPoints)
      .set({ totalPoints: sql`${userPoints.totalPoints} + ${badge.points || 10}` })
      .where(eq(userPoints.userId, userId));
    
    return userBadge;
  },
  
  async getLeaderboard(timeframe: string, limit: number): Promise<UserPoints[]> {
    return db.select().from(userPoints)
      .orderBy(desc(userPoints.totalPoints))
      .limit(limit);
  },
  
  // ============================================
  // COURSES / ACADEMY
  // ============================================
  
  async getCourses(options: { category?: string; difficulty?: string; isFree?: boolean }): Promise<Course[]> {
    let results = await db.select().from(courses).where(eq(courses.isPublished, true));
    
    if (options.category) {
      results = results.filter(c => c.category === options.category);
    }
    if (options.difficulty) {
      results = results.filter(c => c.difficulty === options.difficulty);
    }
    if (options.isFree !== undefined) {
      results = results.filter(c => c.isFree === options.isFree);
    }
    
    return results;
  },
  
  async getCourseBySlug(slug: string): Promise<Course | null> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course || null;
  },
  
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    return db.select().from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.sortOrder));
  },
  
  async getLesson(id: number): Promise<Lesson | null> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || null;
  },
  
  async getCourseLessonCount(courseId: number): Promise<number> {
    const lessonList = await db.select().from(lessons).where(eq(lessons.courseId, courseId));
    return lessonList.length;
  },
  
  async getEnrollment(userId: string, courseId: number): Promise<Enrollment | null> {
    const [enrollment] = await db.select().from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || null;
  },
  
  async createEnrollment(data: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(data).returning();
    return enrollment;
  },
  
  async updateEnrollment(id: number, data: Partial<Enrollment>): Promise<Enrollment> {
    const [enrollment] = await db.update(enrollments).set(data).where(eq(enrollments.id, id)).returning();
    return enrollment;
  },
  
  async incrementCourseEnrollments(courseId: number): Promise<void> {
    await db.update(courses)
      .set({ enrollmentCount: sql`${courses.enrollmentCount} + 1` })
      .where(eq(courses.id, courseId));
  },
  
  // ============================================
  // TEAMS
  // ============================================
  
  async createTeam(data: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(data).returning();
    return team;
  },
  
  async getTeam(id: number): Promise<Team | null> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team || null;
  },
  
  async getUserTeams(userId: string): Promise<(Team & { role: string })[]> {
    const memberships = await db.select().from(teamMembers).where(eq(teamMembers.userId, userId));
    const result = [];
    
    for (const m of memberships) {
      const [team] = await db.select().from(teams).where(eq(teams.id, m.teamId));
      if (team) {
        result.push({ ...team, role: m.role || "member" });
      }
    }
    
    return result;
  },
  
  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  },
  
  async getTeamMember(teamId: number, userId: string): Promise<TeamMember | null> {
    const [member] = await db.select().from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
    return member || null;
  },
  
  async createTeamInvite(data: InsertTeamInvite): Promise<TeamInvite> {
    const [invite] = await db.insert(teamInvites).values(data).returning();
    return invite;
  },
  
  async getTeamInviteByToken(token: string): Promise<TeamInvite | null> {
    const [invite] = await db.select().from(teamInvites).where(eq(teamInvites.token, token));
    return invite || null;
  },
  
  async updateTeamInvite(id: number, data: Partial<TeamInvite>): Promise<void> {
    await db.update(teamInvites).set(data).where(eq(teamInvites.id, id));
  },
  
  async incrementTeamSeats(teamId: number): Promise<void> {
    await db.update(teams)
      .set({ usedSeats: sql`${teams.usedSeats} + 1` })
      .where(eq(teams.id, teamId));
  },
  
  // ============================================
  // WHITE LABEL
  // ============================================
  
  async getWhiteLabelBranding(teamId: number): Promise<WhiteLabelBranding | null> {
    const [branding] = await db.select().from(whiteLabelBranding).where(eq(whiteLabelBranding.teamId, teamId));
    return branding || null;
  },
  
  async upsertWhiteLabelBranding(data: InsertWhiteLabelBranding): Promise<WhiteLabelBranding> {
    const existing = await this.getWhiteLabelBranding(data.teamId);
    
    if (existing) {
      const [updated] = await db.update(whiteLabelBranding)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(whiteLabelBranding.teamId, data.teamId))
        .returning();
      return updated;
    }
    
    const [branding] = await db.insert(whiteLabelBranding).values(data).returning();
    return branding;
  },
  
  // ============================================
  // COMPLIANCE
  // ============================================
  
  async getComplianceRecommendations(projectId: number): Promise<ComplianceRecommendation[]> {
    return db.select().from(complianceRecommendations)
      .where(eq(complianceRecommendations.projectId, projectId))
      .orderBy(desc(complianceRecommendations.createdAt));
  },
  
  async createComplianceRecommendation(data: InsertComplianceRecommendation): Promise<ComplianceRecommendation> {
    const [rec] = await db.insert(complianceRecommendations).values(data).returning();
    return rec;
  },
  
  async resolveComplianceRecommendation(id: number, userId: string): Promise<ComplianceRecommendation> {
    const [rec] = await db.update(complianceRecommendations)
      .set({ status: "resolved", resolvedAt: new Date(), resolvedBy: userId })
      .where(eq(complianceRecommendations.id, id))
      .returning();
    return rec;
  },
  
  async createComplianceEvent(data: InsertComplianceEvent): Promise<ComplianceEvent> {
    const [event] = await db.insert(complianceEvents).values(data).returning();
    return event;
  },
};
