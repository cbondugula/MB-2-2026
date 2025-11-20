import { db } from "./db";
import {
  platformMetrics,
  revenueProjections,
  competitiveAnalysis,
  ipPortfolio,
} from "@shared/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export class PlatformAnalyticsService {
  /**
   * Get revenue projections for all years and tiers
   */
  async getRevenueProjections(scenario: string = "realistic") {
    const projections = await db
      .select()
      .from(revenueProjections)
      .where(eq(revenueProjections.scenario, scenario))
      .orderBy(revenueProjections.year, revenueProjections.tier);

    // Group by year
    const byYear: Record<number, any> = {};
    for (const projection of projections) {
      if (!byYear[projection.year]) {
        byYear[projection.year] = {
          year: projection.year,
          tiers: [],
          totalARR: 0,
          totalCustomers: 0,
        };
      }

      byYear[projection.year].tiers.push({
        tier: projection.tier,
        customerCount: projection.customerCount,
        pricePerMonth: projection.pricePerMonth / 100, // Convert cents to dollars
        monthlyRecurringRevenue: projection.monthlyRecurringRevenue / 100,
        annualRecurringRevenue: projection.annualRecurringRevenue / 100,
        churnRate: projection.churnRate / 100, // Convert to percentage
      });

      byYear[projection.year].totalARR += projection.annualRecurringRevenue;
      byYear[projection.year].totalCustomers += projection.customerCount || 0;
    }

    // Convert to array and format totals
    return Object.values(byYear).map((year: any) => ({
      ...year,
      totalARR: year.totalARR / 100, // Convert cents to dollars
    }));
  }

  /**
   * Get revenue summary for specific year
   */
  async getRevenueSummary(year: number, scenario: string = "realistic") {
    const projections = await db
      .select()
      .from(revenueProjections)
      .where(
        and(
          eq(revenueProjections.year, year),
          eq(revenueProjections.scenario, scenario)
        )
      );

    const totalARR = projections.reduce(
      (sum, p) => sum + (p.annualRecurringRevenue || 0),
      0
    );
    const totalCustomers = projections.reduce(
      (sum, p) => sum + (p.customerCount || 0),
      0
    );

    return {
      year,
      scenario,
      totalARR: totalARR / 100, // Convert cents to dollars
      totalCustomers,
      tiers: projections.map((p) => ({
        tier: p.tier,
        customerCount: p.customerCount,
        arr: (p.annualRecurringRevenue || 0) / 100,
        churnRate: (p.churnRate || 0) / 100,
      })),
    };
  }

  /**
   * Get market size metrics
   */
  async getMarketMetrics() {
    const metrics = await db
      .select()
      .from(platformMetrics)
      .where(eq(platformMetrics.metricType, "market_size"))
      .orderBy(platformMetrics.year);

    return metrics.map((m) => ({
      year: m.year,
      amount: (m.value as any).amount / 100, // Convert cents to dollars
      unit: m.unit,
      source: m.source,
      confidence: m.confidence,
    }));
  }

  /**
   * Get IP portfolio valuation over time
   */
  async getIpValuation() {
    const metrics = await db
      .select()
      .from(platformMetrics)
      .where(eq(platformMetrics.metricType, "ip_value"))
      .orderBy(platformMetrics.year);

    return metrics.map((m) => ({
      year: m.year,
      min: (m.value as any).min / 100, // Convert cents to dollars
      max: (m.value as any).max / 100,
      source: m.source,
      confidence: m.confidence,
      calculationMethod: m.calculationMethod,
    }));
  }

  /**
   * Get all competitors with analysis
   */
  async getCompetitors() {
    const competitors = await db
      .select()
      .from(competitiveAnalysis)
      .where(eq(competitiveAnalysis.isActive, true))
      .orderBy(desc(competitiveAnalysis.marketShare));

    return competitors.map((c) => ({
      id: c.id,
      name: c.competitorName,
      type: c.competitorType,
      category: c.category,
      strengths: c.strengths as string[],
      weaknesses: c.weaknesses as string[],
      pricing: c.pricing,
      marketShare: (c.marketShare || 0) / 100, // Convert to percentage
      customerBase: c.customerBase,
      funding: (c.funding || 0) / 100, // Convert cents to dollars
      valuation: (c.valuation || 0) / 100,
      differentiators: c.differentiators as string[],
      threats: c.threats as string[],
      opportunities: c.opportunities as string[],
    }));
  }

  /**
   * Get IP portfolio details
   */
  async getIpPortfolio() {
    const portfolio = await db
      .select()
      .from(ipPortfolio)
      .where(eq(ipPortfolio.isActive, true))
      .orderBy(desc(ipPortfolio.estimatedValue));

    return portfolio.map((ip) => ({
      id: ip.id,
      name: ip.innovationName,
      type: ip.innovationType,
      category: ip.category,
      description: ip.description,
      filingStatus: ip.filingStatus,
      filingNumber: ip.filingNumber,
      estimatedValue: (ip.estimatedValue || 0) / 100, // Convert cents to dollars
      valuationMethod: ip.valuationMethod,
      implementationStatus: ip.implementationStatus,
      implementationProof: ip.implementationProof,
      relatedServices: ip.relatedServices as string[],
      competitiveAdvantage: ip.competitiveAdvantage,
      marketImpact: ip.marketImpact,
    }));
  }

  /**
   * Get complete platform analysis dashboard data
   */
  async getDashboardData() {
    const [
      revenueProjections,
      marketMetrics,
      ipValuation,
      competitors,
      ipPortfolio,
      currentYearSummary,
      year5Summary,
    ] = await Promise.all([
      this.getRevenueProjections(),
      this.getMarketMetrics(),
      this.getIpValuation(),
      this.getCompetitors(),
      this.getIpPortfolio(),
      this.getRevenueSummary(2025),
      this.getRevenueSummary(2029),
    ]);

    return {
      revenue: {
        projections: revenueProjections,
        currentYear: currentYearSummary,
        year5: year5Summary,
      },
      market: {
        size: marketMetrics,
        competitors: competitors,
      },
      ip: {
        valuation: ipValuation,
        portfolio: ipPortfolio,
        totalPatents: ipPortfolio.length,
      },
      summary: {
        currentARR: currentYearSummary.totalARR,
        year5ARR: year5Summary.totalARR,
        totalCustomers: currentYearSummary.totalCustomers,
        year5Customers: year5Summary.totalCustomers,
        ipValue: ipValuation[ipValuation.length - 1],
        competitorCount: competitors.length,
      },
    };
  }

  /**
   * Get customer count projections
   */
  async getCustomerProjections() {
    const metrics = await db
      .select()
      .from(platformMetrics)
      .where(eq(platformMetrics.metricType, "customers"))
      .orderBy(platformMetrics.year);

    return metrics.map((m) => ({
      year: m.year,
      count: (m.value as any).count,
      source: m.source,
      confidence: m.confidence,
    }));
  }
}

export const platformAnalyticsService = new PlatformAnalyticsService();
