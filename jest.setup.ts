process.env.CIELO_MERCHANT_ID  = 'TEST_ENV_MERCHANT_ID';
process.env.CIELO_MERCHANT_KEY = 'TEST_ENV_MERCHANT_KEY';
process.env.CIELO_ENVIRONMENT  = 'sandbox';

// ---------------------------------------------------------------------------
// Global fetch mock — prevents unit tests from hitting the real Cielo network.
// Tests that need specific responses can override with jest.spyOn(global, 'fetch').
// ---------------------------------------------------------------------------
global.fetch = jest.fn().mockImplementation((url: string, options?: RequestInit) => {
    const method = options?.method?.toUpperCase() ?? 'GET';

    // PUT /capture  → simulate captured response
    if (method === 'PUT' && String(url).includes('/capture')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                Status:        2,
                ReturnCode:    '6',
                ReturnMessage: 'Operation Successful',
            }),
        } as Response);
    }

    // GET /sales/:id → simulate query response (uses apiquerysandbox URL)
    if (method === 'GET' && String(url).includes('/sales/')) {
        return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({
                Payment: {
                    PaymentId:     'mock-payment-uuid-0001',
                    Status:        1,
                    ReturnCode:    '4',
                    ReturnMessage: 'Operation Successful',
                },
            }),
        } as Response);
    }

    // POST /sales/  → simulate authorized response
    return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({
            Payment: {
                PaymentId:     'mock-payment-uuid-0001',
                Status:        1,
                ReturnCode:    '4',
                ReturnMessage: 'Operation Successful',
            },
        }),
    } as Response);
}) as jest.Mock;
