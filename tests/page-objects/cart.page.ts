import type { FrameLocator, Locator } from '@playwright/test';

export class CartPage {
  readonly frame: FrameLocator;

  readonly cartItems: Locator;
  readonly subtotalProductsLine: Locator;
  readonly subtotalProductsQuantity: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(frame: FrameLocator) {
    this.frame = frame;

    this.cartItems = this.frame.locator('.cart-item');
    this.subtotalProductsLine = this.frame.locator('#cart-subtotal-products');
    this.subtotalProductsQuantity = this.subtotalProductsLine.locator('.js-subtotal');
    this.proceedToCheckoutButton = this.frame.getByRole('link', {
      name: /proceed to checkout/i,
    });
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.first().click();
  }

  async getSubtotalProductCount(): Promise<number> {
    const text = await this.subtotalProductsQuantity.textContent();
    const match = text?.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }
}
