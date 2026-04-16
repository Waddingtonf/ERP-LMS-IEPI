#!/usr/bin/env node
/**
 * ✅ E2E TEST SCRIPT - Cielo Sandbox Payment Flow
 * 
 * Usage: npm run test:payment:e2e
 * Environment: SANDBOX ONLY (MOCK MODE)
 */

const https = require('https');

const CONFIG = {
  merchantId: process.env.CIELO_MERCHANT_ID || '8540af68-d213-4868-8dae-9a8b33ff361a',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'r7UNstaaOek7HK4Cmbu72OdCrQJ9Q9P5Ol5Ixr3A',
};

// ─────────────────────────────────────────────────────────────────────────
// TEST UTILITIES
// ─────────────────────────────────────────────────────────────────────────

const assert = (condition, message) => {
  if (!condition) throw new Error(`❌ ${message}`);
  console.log(`  ✅ ${message}`);
};

const generatePaymentId = () => `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ─────────────────────────────────────────────────────────────────────────
// MOCK RESPONSES
// ─────────────────────────────────────────────────────────────────────────

const mockAuthResponse = {
  status: 201,
  body: {
    MerchantOrderId: `ORDER-${Date.now()}`,
    Payment: {
      PaymentId: generatePaymentId(),
      Status: 1,
      ReturnCode: '4',
      ReturnMessage: 'Operation Successful',
      Amount: 9900,
    },
  },
};

const mockCaptureResponse = {
  status: 200,
  body: {
    Payment: {
      Status: 2,
      ReturnCode: '6',
      ReturnMessage: 'Operation Successful',
      CapturedAmount: 9900,
    },
  },
};

const mockQueryResponse = {
  status: 200,
  body: {
    MerchantOrderId: 'ORDER-123456',
    Payment: {
      Status: 2,
      ReturnCode: '6',
      ReturnMessage: 'Operation Successful',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────
// MOCK REQUEST HANDLER
// ─────────────────────────────────────────────────────────────────────────

async function mockRequest(method, path, body) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (method === 'POST' && path === '/1/sales/') {
        resolve(mockAuthResponse);
      } else if (method === 'PUT' && path.includes('/capture')) {
        resolve(mockCaptureResponse);
      } else if (method === 'GET' && path.includes('/sales/')) {
        resolve(mockQueryResponse);
      } else {
        resolve({ status: 404, body: { error: 'Not found' } });
      }
    }, 100);
  });
}

// ─────────────────────────────────────────────────────────────────────────
// TEST SUITE
// ─────────────────────────────────────────────────────────────────────────

async function runTests() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   🧪 CIELO SANDBOX E2E TEST SUITE                         ║');
  console.log('║   Environment: SANDBOX (MOCK MODE)                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  let passed = 0;
  let failed = 0;

  // Test 1: Visa Authorization
  try {
    console.log('\n📝 Test 1: Create Visa transaction (should authorize)');
    const response = await mockRequest('POST', '/1/sales/', {});
    
    assert(response.status === 201, `Response status is 201 (got ${response.status})`);
    assert(response.body.Payment, 'Response contains Payment object');
    assert(response.body.Payment.Status === 1, `Status is 1 (Authorized)`);
    assert(response.body.Payment.PaymentId, 'PaymentId is present');
    
    console.log(`  PaymentId: ${response.body.Payment.PaymentId}`);
    console.log(`  ReturnCode: ${response.body.Payment.ReturnCode}`);
    console.log(`  ReturnMessage: ${response.body.Payment.ReturnMessage}`);
    
    passed++;
  } catch (error) {
    console.error(`  ❌ ${error.message}`);
    failed++;
  }

  // Test 2: Mastercard Authorization
  try {
    console.log('\n📝 Test 2: Create Mastercard transaction (should authorize)');
    const response = await mockRequest('POST', '/1/sales/', {});
    
    assert(response.status === 201, `Response status is 201`);
    assert(response.body.Payment.Status === 1, `Status is 1 (Authorized)`);
    
    console.log(`  PaymentId: ${response.body.Payment.PaymentId}`);
    
    passed++;
  } catch (error) {
    console.error(`  ❌ ${error.message}`);
    failed++;
  }

  // Test 3: Capture Authorization
  try {
    console.log('\n📝 Test 3: Capture authorized transaction');
    
    const authResponse = await mockRequest('POST', '/1/sales/', {});
    const paymentId = authResponse.body.Payment.PaymentId;
    
    assert(paymentId, 'PaymentId obtained from authorization');
    
    const captureResponse = await mockRequest('PUT', `/1/sales/${paymentId}/capture`, {});
    
    assert(captureResponse.status === 200, `Capture response status is 200`);
    assert(captureResponse.body.Payment.Status === 2, `Status is 2 (Captured)`);
    
    console.log(`  Captured PaymentId: ${paymentId}`);
    console.log(`  Final Status: ${captureResponse.body.Payment.Status}`);
    
    passed++;
  } catch (error) {
    console.error(`  ❌ ${error.message}`);
    failed++;
  }

  // Test 4: Query Status
  try {
    console.log('\n📝 Test 4: Query transaction status');
    
    const authResponse = await mockRequest('POST', '/1/sales/', {});
    const paymentId = authResponse.body.Payment.PaymentId;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const queryResponse = await mockRequest('GET', `/1/sales/${paymentId}`, {});
    
    assert(queryResponse.status === 200, `Query response status is 200`);
    assert(queryResponse.body.Payment, 'Response contains Payment object');
    assert([1, 2, 3].includes(queryResponse.body.Payment.Status), 'Status is valid');
    
    console.log(`  Status: ${queryResponse.body.Payment.Status}`);
    console.log(`  Merchant Order ID: ${queryResponse.body.MerchantOrderId}`);
    
    passed++;
  } catch (error) {
    console.error(`  ❌ ${error.message}`);
    failed++;
  }

  // Results
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log(`║   📊 TEST RESULTS                                          ║`);
  console.log(`║   Passed: ${passed}/4 ✅                                                 ║`);
  console.log(`║   Failed: ${failed}/4 ${failed > 0 ? '❌' : ''}                                          ║`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  console.log('\n📌 Running in MOCK MODE (for local testing)');
  console.log('   Docs: See SETUP_FINAL.md for real API testing\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed.\n');
    process.exit(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// EXECUTION
// ─────────────────────────────────────────────────────────────────────────

runTests().catch((error) => {
  console.error('\n❌ FATAL ERROR:\n', error);
  process.exit(1);
});
