/**
 * MedBuilder Testing Agent
 * Automated testing for VIEW DEMO functionality and dynamic data verification
 */

class MedBuilderTestingAgent {
  constructor() {
    this.results = [];
    this.apiData = {};
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, type, message };
    this.results.push(logEntry);
    
    const styles = {
      info: 'color: #0066cc; font-weight: bold;',
      success: 'color: #00cc00; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold;',
      warning: 'color: #cc6600; font-weight: bold;'
    };
    
    console.log(`%c[Testing Agent] ${message}`, styles[type] || styles.info);
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testAPIEndpoints() {
    this.log('Testing API endpoints...', 'info');
    
    const endpoints = [
      '/api/ml/metrics',
      '/api/ml/training-status', 
      '/api/ml/models'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (response.ok) {
          this.apiData[endpoint] = data;
          this.log(`✅ ${endpoint} - Status: ${response.status}, Data keys: ${Object.keys(data).join(', ')}`, 'success');
        } else {
          this.log(`❌ ${endpoint} - Status: ${response.status}, Error: ${data.message}`, 'error');
        }
      } catch (error) {
        this.log(`❌ ${endpoint} - Network Error: ${error.message}`, 'error');
      }
    }
  }

  async clickViewDemoButton() {
    this.log('Looking for VIEW DEMO button...', 'info');
    
    // Find the VIEW DEMO button
    const buttons = document.querySelectorAll('button');
    let viewDemoButton = null;
    
    for (const button of buttons) {
      if (button.textContent.includes('View Demo') || button.textContent.includes('Hide Demo')) {
        viewDemoButton = button;
        break;
      }
    }
    
    if (!viewDemoButton) {
      this.log('❌ VIEW DEMO button not found!', 'error');
      return false;
    }
    
    const buttonText = viewDemoButton.textContent.trim();
    this.log(`Found button: "${buttonText}"`, 'success');
    
    // Click the button
    viewDemoButton.click();
    this.log(`Clicked button: "${buttonText}"`, 'success');
    
    // Wait for UI to update
    await this.sleep(1000);
    
    return true;
  }

  async checkDemoSection() {
    this.log('Checking for demo section...', 'info');
    
    // Look for demo section
    const demoSection = document.querySelector('[data-testid="demo-section"]');
    
    if (!demoSection) {
      this.log('❌ Demo section not found! Element with data-testid="demo-section" does not exist.', 'error');
      return false;
    }
    
    // Check if demo section is visible
    const isVisible = demoSection.offsetHeight > 0 && demoSection.offsetWidth > 0;
    
    if (!isVisible) {
      this.log('❌ Demo section exists but is not visible!', 'error');
      return false;
    }
    
    this.log('✅ Demo section found and is visible', 'success');
    
    // Check for key elements in demo section
    const elements = {
      title: demoSection.querySelector('h2'),
      mlPlatformTitle: demoSection.querySelector('h3'),
      metricsCards: demoSection.querySelectorAll('.bg-gray-800'),
      errorMessage: demoSection.querySelector('.bg-red-900')
    };
    
    if (elements.title) {
      this.log(`✅ Found demo title: "${elements.title.textContent}"`, 'success');
    } else {
      this.log('❌ Demo title not found', 'error');
    }
    
    if (elements.mlPlatformTitle) {
      this.log(`✅ Found ML platform title: "${elements.mlPlatformTitle.textContent}"`, 'success');
    }
    
    if (elements.errorMessage) {
      this.log('⚠️ Error message visible in demo section', 'warning');
    }
    
    this.log(`Found ${elements.metricsCards.length} metric cards in demo section`, 'info');
    
    return true;
  }

  async verifyDynamicData() {
    this.log('Verifying dynamic data display...', 'info');
    
    const demoSection = document.querySelector('[data-testid="demo-section"]');
    if (!demoSection) {
      this.log('❌ Cannot verify data - demo section not found', 'error');
      return false;
    }

    // Check for ML Predictions data
    const predictionElements = Array.from(demoSection.querySelectorAll('p')).filter(p => 
      p.textContent.includes('ML Predictions') || 
      p.textContent.includes('predictions') ||
      p.classList.contains('text-xl')
    );
    
    if (predictionElements.length > 0) {
      predictionElements.forEach((el, index) => {
        this.log(`✅ Found data element ${index + 1}: "${el.textContent.trim()}"`, 'success');
      });
    } else {
      this.log('❌ No ML prediction data elements found', 'error');
    }

    // Check if data matches API responses
    const apiMetrics = this.apiData['/api/ml/metrics'];
    if (apiMetrics) {
      const expectedPredictions = apiMetrics.totalPredictions?.toLocaleString();
      const hasMatchingData = Array.from(demoSection.querySelectorAll('*')).some(el => 
        el.textContent.includes(expectedPredictions)
      );
      
      if (hasMatchingData) {
        this.log(`✅ Found matching API data in UI: ${expectedPredictions} predictions`, 'success');
      } else {
        this.log(`❌ API data not reflected in UI. Expected: ${expectedPredictions}`, 'error');
      }
    }

    return true;
  }

  async testReactQueryRefresh() {
    this.log('Testing React Query data refresh...', 'info');
    
    // Store initial API data
    const initialData = { ...this.apiData };
    
    // Wait for refresh interval (5 seconds for metrics)
    this.log('Waiting 6 seconds for data refresh...', 'info');
    await this.sleep(6000);
    
    // Fetch new data
    await this.testAPIEndpoints();
    
    // Compare data
    const metricsChanged = JSON.stringify(initialData['/api/ml/metrics']) !== 
                          JSON.stringify(this.apiData['/api/ml/metrics']);
    
    if (metricsChanged) {
      this.log('✅ Data successfully refreshed - values changed', 'success');
    } else {
      this.log('⚠️ Data may not be refreshing or values identical', 'warning');
    }
  }

  async runFullTest() {
    this.log('🚀 Starting MedBuilder Demo Testing Agent...', 'info');
    
    try {
      // Test 1: API Endpoints
      await this.testAPIEndpoints();
      
      // Test 2: Click VIEW DEMO button
      const buttonClicked = await this.clickViewDemoButton();
      if (!buttonClicked) return this.generateReport();
      
      // Test 3: Check demo section appears
      const demoVisible = await this.checkDemoSection();
      if (!demoVisible) return this.generateReport();
      
      // Test 4: Verify dynamic data
      await this.verifyDynamicData();
      
      // Test 5: Test data refresh
      await this.testReactQueryRefresh();
      
      this.log('🎉 Testing complete!', 'success');
      
    } catch (error) {
      this.log(`💥 Test failed with error: ${error.message}`, 'error');
      console.error(error);
    }
    
    return this.generateReport();
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.results.length,
      successes: this.results.filter(r => r.type === 'success').length,
      errors: this.results.filter(r => r.type === 'error').length,
      warnings: this.results.filter(r => r.type === 'warning').length,
      results: this.results,
      apiData: this.apiData
    };
    
    console.log('%c=== MedBuilder Testing Agent Report ===', 'color: #fff; background: #333; padding: 10px; font-size: 16px;');
    console.table(report);
    
    this.log(`📊 Test Summary: ${report.successes} successes, ${report.errors} errors, ${report.warnings} warnings`, 'info');
    
    return report;
  }
}

// Auto-start testing agent
window.MedBuilderTestingAgent = MedBuilderTestingAgent;

// Start test automatically when loaded
setTimeout(() => {
  const agent = new MedBuilderTestingAgent();
  agent.runFullTest();
}, 2000);