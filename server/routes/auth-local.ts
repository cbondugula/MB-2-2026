import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { storage } from "../storage";
import { signupSchema, loginSchema } from "@shared/schema";
import { nanoid } from "nanoid";

const router = Router();

router.post("/api/auth/signup", async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { email, password, firstName, lastName } = validation.data;

    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = nanoid();

    const user = await storage.upsertUser({
      id: userId,
      email,
      passwordHash,
      authProvider: "local",
      firstName: firstName || null,
      lastName: lastName || null,
      profileImageUrl: null,
    });

    const sessionUser = {
      claims: {
        sub: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        profile_image_url: user.profileImageUrl,
      },
      expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      access_token: nanoid(32),
      refresh_token: null,
    };

    req.login(sessionUser, (err) => {
      if (err) {
        console.error("Session login error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "An error occurred during signup" });
  }
});

router.post("/api/auth/login", async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { email, password } = validation.data;

    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const sessionUser = {
      claims: {
        sub: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        profile_image_url: user.profileImageUrl,
      },
      expires_at: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      access_token: nanoid(32),
      refresh_token: null,
    };

    req.login(sessionUser, (err) => {
      if (err) {
        console.error("Session login error:", err);
        return res.status(500).json({ message: "Failed to create session" });
      }
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

router.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
      }
      res.json({ success: true });
    });
  });
});

export const authLocalRouter = router;
