import {
  expect,
  type Page,
  type FrameLocator,
  type Locator,
} from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly frame: FrameLocator;

  readonly recommendedProducts: Locator;
  readonly firstRecommendedProduct: Locator;
  readonly secondRecommendedProduct: Locator;
  readonly addToCartButton: Locator;
  readonly cartModal: Locator;
  readonly continueShoppingButton: Locator;
  readonly proceedToCheckoutLink: Locator;
  readonly cartProductsCount: Locator;
  readonly sizeSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frame = page.frameLocator('#framelive');

    this.recommendedProducts = this.frame.locator('.product-miniature');
    this.firstRecommendedProduct = this.recommendedProducts.first();
    this.secondRecommendedProduct = this.recommendedProducts.nth(1);

    this.addToCartButton = this.frame.locator('[data-button-action="add-to-cart"]');
    this.cartModal = this.frame.locator('#blockcart-modal');
    this.continueShoppingButton = this.cartModal.getByRole('button', {
      name: /continue shopping/i,
    });
    this.proceedToCheckoutLink = this.cartModal.getByRole('link', {
      name: /proceed to checkout/i,
    });
    this.cartProductsCount = this.frame.locator('.cart-products-count');
    this.sizeSelect = this.frame.locator('#group_1');
  }

  async goto() {
    await this.page.goto('/');
    await this.frame.locator('body').waitFor();
    await this.recommendedProducts.first().waitFor({ state: 'visible' });
  }

  async addFirstProductToCart(quantity = 2, size = 'S') {
    await this.addRecommendedProductWithQuantityAndSize(quantity, size);
  }

  async addRecommendedProductWithQuantityAndSize(
    quantity: number,
    size: string,
  ) {
    await this.firstRecommendedProduct.scrollIntoViewIfNeeded();
    await this.firstRecommendedProduct.click();

    await this.page.waitForTimeout(5000);
    await expect(this.addToCartButton).toBeVisible({ timeout: 5000 });

    if (size) {
      await this.sizeSelect.selectOption({ label: size });
    }

    const itemsToAdd = quantity > 0 ? quantity : 1;

    for (let i = 0; i < itemsToAdd; i++) {
      await this.addToCartButton.click();

      const isLast = i === itemsToAdd - 1;
      if (!isLast) {
        await this.closeAddToCartModalContinueShopping();
        await expect(this.addToCartButton).toBeVisible({ timeout: 5000 });
      } else {
        await this.proceedToCheckoutFromModal();
      }
    }
  }

  async handleCartModal(action: 'continue' | 'checkout') {
    await this.cartModal.waitFor({ state: 'visible' });

    if (action === 'continue') {
      await this.continueShoppingButton.click();
      await this.cartModal.waitFor({ state: 'hidden' });
    } else {
      await this.proceedToCheckoutLink.click();
    }
  }

  async closeAddToCartModalContinueShopping() {
    await this.handleCartModal('continue');
  }

  async proceedToCheckoutFromModal() {
    await this.handleCartModal('checkout');
  }

  async getCartProductCount(): Promise<number> {
    const text = await this.cartProductsCount.textContent();
    return Number(text?.replace(/[()]/g, '') ?? '0');
  }
}
