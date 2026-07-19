import { test as base, chromium, expect, TestInfo } from '@playwright/test';

const capabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    build: 'TestMuAI Workspace Build',
    user: process.env.LT_USERNAME,
    accessKey: process.env.LT_ACCESS_KEY,
    network: true,
    video: true,
    visual: true,
    console: true,
  },
};

export const test = base.extend<{ page: import('@playwright/test').Page }>({
  page: async ({}, use, testInfo) => {
    const caps = {
      ...capabilities,
      'LT:Options': {
        ...capabilities['LT:Options'],
        name: testInfo.title,
      },
    };

    const browser = await chromium.connect({
      wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
        JSON.stringify(caps)
      )}`,
    });

    const page = await browser.newPage();

    try {
      await use(page);
    } finally {
      // Report actual Playwright test status to TestMu AI dashboard
      await page.evaluate(
        (_) => {},
        `lambdatest_action: ${JSON.stringify({
          action: 'setTestStatus',
          arguments: {
            status: testInfo.status,
            remark: testInfo.error?.message || 'OK',
          },
        })}`
      );
      await browser.close();
    }
  },
});

export { expect };
