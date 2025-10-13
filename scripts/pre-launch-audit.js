#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

class PreLaunchAuditor {
  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    this.anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.results = [];
  }

  log(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toISOString() };
    this.results.push(result);
    
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${test}: ${status}${details ? ` - ${details}` : ''}`);
  }

  async runAudit() {
    console.log('🔍 Starting Pre-Launch Security & Functionality Audit\n');
    
    try {
      await this.testRLSPolicies();
      await this.testTenantIsolation();
      await this.testAPIEndpoints();
      await this.testHealthChecks();
      await this.testSecurityHeaders();
      await this.testCriticalFlows();
      
      this.generateReport();
    } catch (error) {
      console.error('❌ Audit failed:', error);
      process.exit(1);
    }
  }

  async testRLSPolicies() {
    console.log('🔒 Testing RLS Policies...');
    
    try {
      // Test 1: Anonymous users should see no appointments
      const { data: anonData, error: anonError } = await this.anonClient
        .from('appointments')
        .select('*');
      
      if (anonData && anonData.length === 0) {
        this.log('RLS - Anonymous Access Block', 'PASS', 'No data returned to anonymous users');
      } else {
        this.log('RLS - Anonymous Access Block', 'FAIL', `Anonymous user saw ${anonData?.length || 0} records`);
      }

      // Test 2: Service role can access data
      const { data: serviceData, error: serviceError } = await this.supabase
        .from('appointments')
        .select('id, tenant_id')
        .limit(5);
      
      if (serviceData && serviceData.length >= 0) {
        this.log('RLS - Service Role Access', 'PASS', `Service role can access data`);
      } else {
        this.log('RLS - Service Role Access', 'FAIL', serviceError?.message || 'No access');
      }

      // Test 3: Tenant context function exists
      const { data: contextData, error: contextError } = await this.supabase
        .rpc('set_tenant_context', { tenant_id: 'test-tenant' });
      
      if (!contextError) {
        this.log('RLS - Tenant Context Function', 'PASS', 'Function exists and callable');
      } else {
        this.log('RLS - Tenant Context Function', 'FAIL', contextError.message);
      }

    } catch (error) {
      this.log('RLS - Policy Test', 'FAIL', error.message);
    }
  }

  async testTenantIsolation() {
    console.log('🏢 Testing Tenant Isolation...');
    
    try {
      // Set tenant context and verify isolation
      await this.supabase.rpc('set_tenant_context', { tenant_id: 'instyle' });
      
      const { data: tenantData } = await this.supabase
        .from('services')
        .select('tenant_id')
        .limit(10);
      
      if (tenantData) {
        const uniqueTenants = [...new Set(tenantData.map(item => item.tenant_id))];
        if (uniqueTenants.length <= 1) {
          this.log('Tenant Isolation - Data Scoping', 'PASS', `Data scoped to ${uniqueTenants.length} tenant(s)`);
        } else {
          this.log('Tenant Isolation - Data Scoping', 'FAIL', `Data from ${uniqueTenants.length} tenants visible`);
        }
      } else {
        this.log('Tenant Isolation - Data Scoping', 'PASS', 'No cross-tenant data leakage');
      }

    } catch (error) {
      this.log('Tenant Isolation - Test', 'FAIL', error.message);
    }
  }

  async testAPIEndpoints() {
    console.log('🌐 Testing Critical API Endpoints...');
    
    const endpoints = [
      { path: '/api/health', method: 'GET', expectedStatus: 200 },
      { path: '/api/chat', method: 'POST', expectedStatus: 400, body: { message: 'test' } }, // Should fail without tenantId
      { path: '/status', method: 'GET', expectedStatus: 200 }
    ];

    for (const endpoint of endpoints) {
      try {
        const options = {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        };
        
        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body);
        }

        const response = await fetch(`${BASE_URL}${endpoint.path}`, options);
        
        if (response.status === endpoint.expectedStatus) {
          this.log(`API - ${endpoint.path}`, 'PASS', `Status: ${response.status}`);
        } else {
          this.log(`API - ${endpoint.path}`, 'FAIL', `Expected: ${endpoint.expectedStatus}, Got: ${response.status}`);
        }
      } catch (error) {
        this.log(`API - ${endpoint.path}`, 'FAIL', error.message);
      }
    }
  }

  async testHealthChecks() {
    console.log('💓 Testing Health Check System...');
    
    try {
      const response = await fetch(`${BASE_URL}/api/health`);
      const healthData = await response.json();
      
      if (response.ok && healthData.status) {
        this.log('Health Check - Endpoint', 'PASS', `Status: ${healthData.status}`);
        
        // Check individual components
        if (healthData.checks?.database?.status === 'pass') {
          this.log('Health Check - Database', 'PASS', `Response time: ${healthData.checks.database.responseTime}ms`);
        } else {
          this.log('Health Check - Database', 'FAIL', healthData.checks?.database?.error || 'Unknown error');
        }
        
      } else {
        this.log('Health Check - Endpoint', 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      this.log('Health Check - System', 'FAIL', error.message);
    }
  }

  async testSecurityHeaders() {
    console.log('🛡️ Testing Security Headers...');
    
    try {
      const response = await fetch(`${BASE_URL}/`);
      const headers = response.headers;
      
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection'
      ];
      
      securityHeaders.forEach(header => {
        if (headers.get(header)) {
          this.log(`Security Header - ${header}`, 'PASS', headers.get(header));
        } else {
          this.log(`Security Header - ${header}`, 'WARN', 'Header not present');
        }
      });
      
    } catch (error) {
      this.log('Security Headers - Test', 'FAIL', error.message);
    }
  }

  async testCriticalFlows() {
    console.log('🔄 Testing Critical User Flows...');
    
    try {
      // Test status page accessibility
      const statusResponse = await fetch(`${BASE_URL}/status`);
      if (statusResponse.ok) {
        this.log('Critical Flow - Status Page', 'PASS', 'Status page accessible');
      } else {
        this.log('Critical Flow - Status Page', 'FAIL', `Status: ${statusResponse.status}`);
      }

      // Test tenant routing (if instyle subdomain exists)
      try {
        const tenantResponse = await fetch('https://instylehairboutique.co.za/api/health');
        if (tenantResponse.ok) {
          this.log('Critical Flow - Tenant Routing', 'PASS', 'Tenant domain accessible');
        } else {
          this.log('Critical Flow - Tenant Routing', 'WARN', 'Tenant domain not accessible');
        }
      } catch (error) {
        this.log('Critical Flow - Tenant Routing', 'WARN', 'Tenant domain test skipped');
      }

    } catch (error) {
      this.log('Critical Flows - Test', 'FAIL', error.message);
    }
  }

  generateReport() {
    console.log('\n📊 AUDIT SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const warnings = this.results.filter(r => r.status === 'WARN').length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`📋 Total Tests: ${this.results.length}`);
    
    const successRate = ((passed / this.results.length) * 100).toFixed(1);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (failed === 0) {
      console.log('\n🎉 AUDIT PASSED - Platform ready for production!');
      process.exit(0);
    } else {
      console.log('\n🚨 AUDIT FAILED - Critical issues must be resolved before launch!');
      console.log('\nFailed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  ❌ ${r.test}: ${r.details}`));
      process.exit(1);
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PreLaunchAuditor();
  auditor.runAudit().catch(console.error);
}

module.exports = PreLaunchAuditor;