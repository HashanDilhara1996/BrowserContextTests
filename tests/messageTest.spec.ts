import { test, expect } from '@playwright/test';

test.describe('Customer and Admin Operations', () => {

  test('test', async ({ browser }) => {
    // Create a new browser context for the customer with saved authentication state
    const customerContext = await browser.newContext({ storageState: 'customerAuth.json' });
    const customerPage = await customerContext.newPage();

    // Customer operations
    await customerPage.goto('https://practicesoftwaretesting.com/#/account');
    await customerPage.locator('[data-test="nav-contact"]').click();
    await customerPage.locator('[data-test="subject"]').selectOption('customer-service');
    await customerPage.locator('[data-test="message"]').fill('Hi This is a test message to get customer service.');
    await customerPage.locator('[data-test="contact-submit"]').click();

    // Create a new browser context for the admin with saved authentication state
    const adminContext = await browser.newContext({ storageState: 'adminAuth.json' });
    const adminPage = await adminContext.newPage();

    // Admin operations
    await adminPage.goto('https://practicesoftwaretesting.com/#/admin/dashboard');
    await adminPage.locator('[data-test="nav-menu"]').click();
    await adminPage.locator('[data-test="nav-admin-messages"]').click();
    await adminPage.locator("(//table[@class='table table-hover']//a)[1]").click();
    await expect(adminPage.locator("//p[text()='Hi This is a test message to get customer service.']")).toHaveText("Hi This is a test message to get customer service.");
    await adminPage.locator('[data-test="message"]').fill('Hi, This is a test reply for the message inquiry.');
    await adminPage.locator('[data-test="reply-submit"]').click();

    // Customer operations to check the reply
    await customerPage.goto('https://practicesoftwaretesting.com/#/account');
    await customerPage.locator('[data-test="nav-messages"]').click();
    await customerPage.getByRole('cell', { name: 'Details' }).first().click();
    await expect(customerPage.getByText('Hi, This is a test reply for')).toHaveText("Hi, This is a test reply for the message inquiry.");
  });
});
