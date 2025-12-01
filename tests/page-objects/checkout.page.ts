import {
  expect,
  type Page,
  type FrameLocator,
  type Locator,
} from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly frame: FrameLocator;

  readonly socialTitleMr: Locator;
  readonly socialTitleMrs: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly birthdateInput: Locator;

  readonly termsCheckbox: Locator;
  readonly customerPrivacyCheckbox: Locator;

  readonly continueButton: Locator;
  readonly genericContinueButton: Locator;

  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipInput: Locator;
  readonly phoneInput: Locator;
  readonly countrySelect: Locator;
  readonly stateSelect: Locator;

  readonly payByBankWireLink: Locator;
  readonly placeOrderButton: Locator;
  readonly paymentTermsCheckbox: Locator;
  readonly orderConfirmationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frame = page.frameLocator('#framelive');

    this.socialTitleMr = this.frame.locator('input#field-id_gender-1');
    this.socialTitleMrs = this.frame.locator('input#field-id_gender-2');

    this.firstNameInput = this.frame.getByLabel(/first name/i);
    this.lastNameInput = this.frame.getByLabel(/last name/i);
    this.emailInput = this.frame.getByLabel(/email/i);
    this.birthdateInput = this.frame.getByLabel(/birthdate/i);

    this.termsCheckbox = this.frame.getByLabel(/agree to the terms/i);
    this.customerPrivacyCheckbox = this.frame.getByLabel(/customer data privacy/i);

    this.continueButton = this.frame.getByRole('button', { name: /continue/i });
    this.genericContinueButton = this.frame.locator('#checkout-delivery-step button.continue');

    this.addressInput = this.frame.locator('#field-address1');
    this.cityInput = this.frame.locator('#field-city');
    this.zipInput = this.frame.locator('#field-postcode');
    this.phoneInput = this.frame.locator('#field-phone');
    this.countrySelect = this.frame.locator('#field-id_country');
    this.stateSelect = this.frame.locator('#field-id_state');

    this.payByBankWireLink = this.frame.locator('#payment-option-1');
    this.paymentTermsCheckbox = this.frame.locator('#conditions_to_approve\\[terms-and-conditions\\]');
    this.placeOrderButton = this.frame.getByRole('button', { name: /place order/i });


    this.orderConfirmationHeading = this.frame.getByRole('heading', {
        name: /your order is confirmed/i,
    });
  }

  async fillPersonalInformation(params: {
    gender: 'mr' | 'mrs';
    firstName: string;
    lastName: string;
    email: string;
    birthdate?: string;
  }) {
    if (params.gender === 'mr') await this.socialTitleMr.check();
    else await this.socialTitleMrs.check();

    await this.firstNameInput.fill(params.firstName);
    await this.lastNameInput.fill(params.lastName);
    await this.emailInput.fill(params.email);

    if (params.birthdate) await this.birthdateInput.fill(params.birthdate);

    if (await this.termsCheckbox.isVisible()) await this.termsCheckbox.check();
    if (await this.customerPrivacyCheckbox.isVisible()) await this.customerPrivacyCheckbox.check();

    await this.continueButton.click();
  }

  async fillAddress(params: {
  address: string;
  city: string;
  zip: string;
  country?: string;
  state?: string;
  phone?: string;
}) {
  await this.countrySelect.selectOption({ label: params.country });

  await this.addressInput.fill(params.address);
  await this.cityInput.fill(params.city);
  await this.zipInput.fill(params.zip);

  if (params.state) {
    if (await this.stateSelect.isVisible()) {
      await this.stateSelect.selectOption({ label: params.state });
    }
  }

  if (params.phone && (await this.phoneInput.isVisible())) {
    await this.phoneInput.fill(params.phone);
  }

  await this.continueButton.click();
}


  async chooseDelivery() {
    await this.genericContinueButton.click();
  }

  async payByBankWireAndConfirm() {
    await this.payByBankWireLink.click();
    await this.paymentTermsCheckbox.click();
    await this.placeOrderButton.click();
  }

  async assertOrderIsConfirmed() {
    await expect(this.orderConfirmationHeading).toBeVisible();
  }
}
