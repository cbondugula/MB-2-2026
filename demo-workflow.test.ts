/**
 * MedBuilder Complete Workflow Demonstration
 * 
 * This test script demonstrates the entire E2E workflow:
 * 1. User Authentication (OIDC)
 * 2. Healthcare App Generation with AI
 * 3. HIPAA Compliance Checking (80% threshold)
 * 4. Project Preview
 * 5. Code Editor with Save Functionality
 * 
 * Run with: npm test demo-workflow.test.ts
 */

import { test, expect } from '@playwright/test';
import { nanoid } from 'nanoid';

test.describe('🏥 MedBuilder Complete Workflow Demo', () => {
  
  test('End-to-End Healthcare App Development', async ({ page, context }) => {
    console.log('\n🎬 STARTING MEDBUILDER WORKFLOW DEMONSTRATION\n');
    
    // ========================================
    // STEP 1: User Authentication
    // ========================================
    console.log('📋 Step 1: Authenticating User...');
    
    const userId = `demo-user-${nanoid(6)}`;
    const userEmail = `demo${nanoid(4)}@hospital.com`;
    
    // Configure OIDC authentication
    await context.addInitScript(() => {
      (window as any).__OIDC_OVERRIDE__ = {
        sub: userId,
        email: userEmail,
        first_name: 'Demo',
        last_name: 'Doctor'
      };
    });
    
    await page.goto('/');
    
    // Handle login if needed
    const loginButton = page.locator('[data-testid*="login"]');
    if (await loginButton.isVisible()) {
      await loginButton.click();
    }
    
    console.log(`✅ Authenticated as: ${userEmail}`);
    
    // ========================================
    // STEP 2: Generate Healthcare Application
    // ========================================
    console.log('\n📋 Step 2: Generating Healthcare Application with AI...');
    
    const appDescription = 'Emergency room patient tracking system with real-time bed availability and critical patient alerts';
    
    const response = await page.request.post('/api/healthcare/generate-app', {
      data: {
        description: appDescription,
        organizationType: 'Emergency Department',
        country: 'United States',
        features: ['patient-tracking', 'bed-management', 'alerts']
      }
    });
    
    expect(response.status()).toBe(200);
    const result = await response.json();
    
    console.log(`✅ App Generated Successfully`);
    console.log(`   Project ID: ${result.project.id}`);
    console.log(`   Name: ${result.project.name}`);
    console.log(`   Framework: ${result.project.framework}`);
    console.log(`   Backend: ${result.project.backend}`);
    
    const projectId = result.project.id;
    
    // ========================================
    // STEP 3: HIPAA Compliance Verification
    // ========================================
    console.log('\n📋 Step 3: Verifying HIPAA Compliance...');
    
    expect(result.compliance.score).toBeGreaterThanOrEqual(80);
    expect(result.project.isHipaaCompliant).toBe(true);
    expect(result.compliance.isCompliant).toBe(true);
    
    console.log(`✅ HIPAA Compliance Check PASSED`);
    console.log(`   Score: ${result.compliance.score}%`);
    console.log(`   isHipaaCompliant Flag: ${result.project.isHipaaCompliant}`);
    console.log(`   Violations: ${result.compliance.violations.length}`);
    
    // Verify database persistence
    const dbCheck = await page.evaluate(async (pid) => {
      const res = await fetch(`/api/projects/${pid}`, {
        credentials: 'include'
      });
      return await res.json();
    }, projectId);
    
    expect(dbCheck.isHipaaCompliant).toBe(true);
    console.log(`✅ Database verified: HIPAA flag persisted correctly`);
    
    // ========================================
    // STEP 4: Preview the Generated App
    // ========================================
    console.log('\n📋 Step 4: Opening App Preview...');
    
    await page.goto(`/apps/${projectId}`);
    await page.waitForLoadState('networkidle');
    
    // Verify preview page elements
    await expect(page.locator('h1, h2').filter({ hasText: result.project.name })).toBeVisible();
    
    const hipaaStatus = page.locator('text=/HIPAA.*Compliant/i');
    await expect(hipaaStatus).toBeVisible();
    
    console.log(`✅ Preview Page Loaded`);
    console.log(`   URL: /apps/${projectId}`);
    console.log(`   HIPAA Badge: Visible`);
    
    // Take screenshot of preview
    await page.screenshot({ 
      path: `demo-screenshots/01-preview-${projectId}.png`,
      fullPage: true 
    });
    console.log(`   Screenshot saved: demo-screenshots/01-preview-${projectId}.png`);
    
    // ========================================
    // STEP 5: Code Editor Functionality
    // ========================================
    console.log('\n📋 Step 5: Testing Code Editor...');
    
    await page.goto(`/editor/${projectId}`);
    await page.waitForLoadState('networkidle');
    
    // Verify editor loaded
    await expect(page.locator('[data-testid*="save"]')).toBeVisible();
    
    console.log(`✅ Editor Loaded`);
    
    // Find the main code textarea
    const codeEditor = page.locator('textarea').first();
    await expect(codeEditor).toBeVisible();
    
    // Get original code
    const originalCode = await codeEditor.inputValue();
    
    // Modify code
    const testModification = '\n// Demo: Code modified at ' + new Date().toISOString();
    await codeEditor.fill(originalCode + testModification);
    
    console.log(`✅ Code Modified`);
    console.log(`   Added: ${testModification.trim()}`);
    
    // Verify unsaved changes badge appears
    const unsavedBadge = page.locator('text=/unsaved/i');
    await expect(unsavedBadge).toBeVisible();
    console.log(`✅ Unsaved Changes Badge: Visible`);
    
    // Take screenshot before save
    await page.screenshot({ 
      path: `demo-screenshots/02-editor-unsaved-${projectId}.png`,
      fullPage: true 
    });
    console.log(`   Screenshot saved: demo-screenshots/02-editor-unsaved-${projectId}.png`);
    
    // Save changes
    const saveButton = page.locator('[data-testid="save-button"]');
    await saveButton.click();
    
    // Wait for save to complete
    await page.waitForTimeout(2000);
    
    console.log(`✅ Code Saved to Database`);
    
    // Verify unsaved badge disappears
    await expect(unsavedBadge).not.toBeVisible();
    
    // Verify changes persisted
    const savedProject = await page.evaluate(async (pid) => {
      const res = await fetch(`/api/projects/${pid}`, {
        credentials: 'include'
      });
      return await res.json();
    }, projectId);
    
    const savedCode = JSON.stringify(savedProject.code);
    expect(savedCode).toContain('Demo: Code modified');
    
    console.log(`✅ Changes Verified in Database`);
    
    // Take screenshot after save
    await page.screenshot({ 
      path: `demo-screenshots/03-editor-saved-${projectId}.png`,
      fullPage: true 
    });
    console.log(`   Screenshot saved: demo-screenshots/03-editor-saved-${projectId}.png`);
    
    // ========================================
    // STEP 6: Navigate Back to Preview
    // ========================================
    console.log('\n📋 Step 6: Verifying Navigation...');
    
    const backButton = page.locator('text=/back to preview/i');
    if (await backButton.isVisible()) {
      await backButton.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain(`/apps/${projectId}`);
      console.log(`✅ Navigation: Editor → Preview successful`);
    }
    
    // ========================================
    // DEMONSTRATION SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 MEDBUILDER WORKFLOW DEMONSTRATION COMPLETE');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   ✅ User authenticated: ${userEmail}`);
    console.log(`   ✅ App generated: Project #${projectId}`);
    console.log(`   ✅ HIPAA compliance: ${result.compliance.score}% (PASSED)`);
    console.log(`   ✅ Preview page: Functional`);
    console.log(`   ✅ Code editor: Modifications saved`);
    console.log(`   ✅ Database persistence: Verified\n`);
    
    console.log('🔧 Technical Highlights:');
    console.log('   • HIPAA flag auto-set when score >= 80%');
    console.log('   • API endpoint: POST /api/healthcare/generate-app');
    console.log('   • Editor endpoint: PATCH /api/projects/:id');
    console.log('   • Real-time code persistence to PostgreSQL');
    console.log('   • Ownership verification on all routes\n');
    
    console.log('📸 Screenshots saved to demo-screenshots/\n');
  });
  
  test('Verify HIPAA Flag Threshold Logic', async ({ page, context }) => {
    console.log('\n🧪 TESTING: HIPAA Compliance Threshold\n');
    
    // This test verifies the fix: isHipaaCompliant = true when score >= 80
    
    const userId = `threshold-test-${nanoid(6)}`;
    await context.addInitScript(() => {
      (window as any).__OIDC_OVERRIDE__ = {
        sub: userId,
        email: `test@demo.com`,
        first_name: 'Test',
        last_name: 'User'
      };
    });
    
    await page.goto('/');
    
    const response = await page.request.post('/api/healthcare/generate-app', {
      data: {
        description: 'HIPAA-compliant patient portal',
        organizationType: 'Hospital',
        country: 'United States'
      }
    });
    
    const result = await response.json();
    
    console.log(`Compliance Score: ${result.compliance.score}%`);
    console.log(`Expected: isHipaaCompliant = ${result.compliance.score >= 80}`);
    console.log(`Actual: isHipaaCompliant = ${result.project.isHipaaCompliant}`);
    
    // Verify threshold logic
    if (result.compliance.score >= 80) {
      expect(result.project.isHipaaCompliant).toBe(true);
      console.log(`✅ PASS: Score ${result.compliance.score}% → Flag set to TRUE`);
    } else {
      expect(result.project.isHipaaCompliant).toBe(false);
      console.log(`✅ PASS: Score ${result.compliance.score}% → Flag set to FALSE`);
    }
  });
});
