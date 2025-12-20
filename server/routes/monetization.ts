import { Router } from "express";
import { storage } from "../storage";
import { nanoid } from "nanoid";
import { z } from "zod";

export const monetizationRouter = Router();

const CREDIT_COSTS = {
  ai_generation: 100, // $1.00 per generation
  project_creation: 0, // Free
  deployment: 500, // $5.00 per deployment
  export: 200, // $2.00 per export
};

const CREDIT_PACKAGES = [
  { id: 1, name: "Starter Pack", credits: 10, priceInCents: 500, bonusCredits: 0, isPopular: false },
  { id: 2, name: "Builder Pack", credits: 50, priceInCents: 2000, bonusCredits: 5, isPopular: true },
  { id: 3, name: "Pro Pack", credits: 200, priceInCents: 6000, bonusCredits: 40, isPopular: false },
  { id: 4, name: "Enterprise Pack", credits: 1000, priceInCents: 20000, bonusCredits: 300, isPopular: false },
];

monetizationRouter.post("/guest-session", async (req, res) => {
  try {
    const sessionId = nanoid(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const guestSession = await storage.createGuestSession({
      sessionId,
      fingerprint: req.body.fingerprint || null,
      ipAddress: req.ip || null,
      creditsRemaining: 3,
      projectsCreated: 0,
      aiGenerationsUsed: 0,
      expiresAt,
    });

    res.json({
      sessionId: guestSession.sessionId,
      creditsRemaining: guestSession.creditsRemaining,
      expiresAt: guestSession.expiresAt,
    });
  } catch (error: any) {
    console.error("Error creating guest session:", error);
    res.status(500).json({ error: "Failed to create guest session" });
  }
});

monetizationRouter.get("/guest-session/:sessionId", async (req, res) => {
  try {
    const session = await storage.getGuestSession(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      return res.status(410).json({ error: "Session expired" });
    }

    res.json({
      creditsRemaining: session.creditsRemaining,
      projectsCreated: session.projectsCreated,
      aiGenerationsUsed: session.aiGenerationsUsed,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    console.error("Error fetching guest session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

monetizationRouter.post("/use-credit", async (req, res) => {
  try {
    const { sessionId, userId, creditType } = req.body;

    if (!creditType || !CREDIT_COSTS[creditType as keyof typeof CREDIT_COSTS]) {
      return res.status(400).json({ error: "Invalid credit type" });
    }

    if (sessionId) {
      const session = await storage.getGuestSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      if ((session.creditsRemaining || 0) <= 0) {
        return res.status(402).json({ 
          error: "No credits remaining",
          requiresPayment: true,
          message: "Sign up or purchase credits to continue"
        });
      }

      await storage.useGuestCredit(sessionId);
      const updated = await storage.getGuestSession(sessionId);

      res.json({
        creditsRemaining: updated?.creditsRemaining || 0,
        creditUsed: 1,
      });
    } else if (userId) {
      const quota = await storage.getUserQuota(userId);
      if (!quota) {
        return res.status(404).json({ error: "User quota not found" });
      }

      const cost = CREDIT_COSTS[creditType as keyof typeof CREDIT_COSTS];
      
      if (creditType === "ai_generation") {
        if ((quota.aiCallsUsed || 0) >= (quota.aiCallsLimit || 50)) {
          if ((quota.creditsBalance || 0) < cost) {
            return res.status(402).json({
              error: "Credit limit reached",
              requiresPayment: true,
              message: "Purchase credits to continue"
            });
          }
          await storage.deductCredits(userId, cost);
        }
        await storage.incrementAiCalls(userId);
      }

      res.json({
        success: true,
        aiCallsUsed: (quota.aiCallsUsed || 0) + 1,
        aiCallsLimit: quota.aiCallsLimit,
      });
    } else {
      return res.status(400).json({ error: "sessionId or userId required" });
    }
  } catch (error: any) {
    console.error("Error using credit:", error);
    res.status(500).json({ error: "Failed to use credit" });
  }
});

monetizationRouter.get("/credit-packages", async (req, res) => {
  try {
    res.json(CREDIT_PACKAGES);
  } catch (error: any) {
    console.error("Error fetching credit packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

monetizationRouter.post("/purchase-credits", async (req: any, res) => {
  try {
    const { packageId, sessionId } = req.body;
    const userId = req.user?.claims?.sub;

    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!pkg) {
      return res.status(400).json({ error: "Invalid package" });
    }

    const Stripe = (await import('stripe')).default;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Payment system not configured" });
    }

    if (!stripeSecretKey.startsWith('sk_')) {
      return res.status(500).json({ error: "Invalid Stripe configuration" });
    }

    const stripe = new Stripe(stripeSecretKey);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: pkg.priceInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        packageId: pkg.id.toString(),
        packageName: pkg.name,
        credits: pkg.credits.toString(),
        bonusCredits: pkg.bonusCredits.toString(),
        userId: userId || "",
        sessionId: sessionId || "",
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      package: pkg,
    });
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

monetizationRouter.post("/confirm-purchase", async (req: any, res) => {
  try {
    const { paymentIntentId, sessionId } = req.body;
    const userId = req.user?.claims?.sub;

    const Stripe = (await import('stripe')).default;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
      return res.status(500).json({ error: "Payment system not configured" });
    }

    const stripe = new Stripe(stripeSecretKey);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const { credits, bonusCredits, packageName } = paymentIntent.metadata;
    const totalCredits = parseInt(credits) + parseInt(bonusCredits);

    if (userId) {
      await storage.addCredits(userId, totalCredits);
      const quota = await storage.getUserQuota(userId);
      res.json({
        success: true,
        creditsAdded: totalCredits,
        newBalance: quota?.creditsBalance || totalCredits,
        packageName,
      });
    } else if (sessionId) {
      await storage.addGuestCredits(sessionId, totalCredits);
      const session = await storage.getGuestSession(sessionId);
      res.json({
        success: true,
        creditsAdded: totalCredits,
        creditsRemaining: session?.creditsRemaining || totalCredits,
        packageName,
      });
    } else {
      return res.status(400).json({ error: "No user or session provided" });
    }
  } catch (error: any) {
    console.error("Error confirming purchase:", error);
    res.status(500).json({ error: error.message });
  }
});

monetizationRouter.post("/convert-guest", async (req: any, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user?.claims?.sub;

    if (!userId) {
      return res.status(401).json({ error: "Must be logged in to convert session" });
    }

    const session = await storage.getGuestSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    await storage.convertGuestToUser(sessionId, userId);

    res.json({
      success: true,
      message: "Session converted successfully",
    });
  } catch (error: any) {
    console.error("Error converting guest session:", error);
    res.status(500).json({ error: "Failed to convert session" });
  }
});

monetizationRouter.get("/usage-stats", async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { sessionId } = req.query;

    if (userId) {
      const quota = await storage.getUserQuota(userId);
      res.json({
        tier: quota?.tier || "free",
        aiCallsUsed: quota?.aiCallsUsed || 0,
        aiCallsLimit: quota?.aiCallsLimit || 50,
        projectsUsed: quota?.projectsUsed || 0,
        projectsLimit: quota?.projectsLimit || 3,
        creditsBalance: quota?.creditsBalance || 0,
        resetsAt: quota?.resetsAt,
      });
    } else if (sessionId) {
      const session = await storage.getGuestSession(sessionId as string);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json({
        tier: "guest",
        creditsRemaining: session.creditsRemaining || 0,
        aiGenerationsUsed: session.aiGenerationsUsed || 0,
        projectsCreated: session.projectsCreated || 0,
        expiresAt: session.expiresAt,
      });
    } else {
      res.json({
        tier: "anonymous",
        creditsRemaining: 0,
        message: "Create a session to start building",
      });
    }
  } catch (error: any) {
    console.error("Error fetching usage stats:", error);
    res.status(500).json({ error: "Failed to fetch usage stats" });
  }
});
