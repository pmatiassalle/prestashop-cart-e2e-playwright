import { test, expect } from '@playwright/test';
import { HomePage } from './page-objects/home.page';
import { CartPage } from './page-objects/cart.page';
import { CheckoutPage } from './page-objects/checkout.page';

test.describe('Cart functionality - PrestaShop demo', () => {
  test('User can add more than one product to the cart', async ({ page }) => {
    const home = new HomePage(page);
    const desiredQuantity = 4;
    const size = 'M';

    await home.goto();
    await home.addFirstProductToCart(desiredQuantity, size);

    const cartPage = new CartPage(home.frame);

    const subtotalCount = await cartPage.getSubtotalProductCount();
    const headerCartCount = await home.getCartProductCount();

    expect(subtotalCount).toBe(desiredQuantity);
    expect(subtotalCount).toBeGreaterThan(1);
    expect(subtotalCount).toBe(headerCartCount);
  });

  test('User can place an order from the cart', async ({ page }) => {
    const home = new HomePage(page);
    const desiredQuantity = 2;
    const size = 'L';

    await home.goto();
    await home.addFirstProductToCart(desiredQuantity, size);

    const cartPage = new CartPage(home.frame);

    const subtotalCount = await cartPage.getSubtotalProductCount();

    expect(subtotalCount).toBe(desiredQuantity);
    expect(subtotalCount).toBeGreaterThan(1);

    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillPersonalInformation({
      gender: 'mr',
      firstName: 'John',
      lastName: 'Doe',
      email: `test+${Date.now()}@example.com`,
      birthdate: '01/01/1990'
    });

    await checkoutPage.fillAddress({
      address: '123 Main Street',
      city: 'Paris',
      zip: '10001',
      country: 'France',
      phone: '5551234567'
    });

    await checkoutPage.chooseDelivery();
    await checkoutPage.payByBankWireAndConfirm();
    await checkoutPage.assertOrderIsConfirmed();
  });
});
