# 🛒 PrestaShop Cart Automation – Playwright + TypeScript

This repository contains automated end-to-end tests for the cart and checkout flow of the **PrestaShop demo store**:
[https://demo.prestashop.com/](https://demo.prestashop.com/)

The work is based on the user story requesting support for adding multiple items to the cart and completing an order from the cart. The goal of the automation is to validate the implemented functionality from an end-user perspective and ensure the flow behaves as expected.

---

## 📌 User Story & Acceptance Criteria

### **User Story**

> As a user of the online store, I want to add multiple products to the cart and place an order from the cart.

### **Acceptance Criteria**

* The user can add more than one product to the cart.
* The user can place an order from the cart.

Both flows are fully automated and validated through the test suite included in this repository.

---

# 🧠 Approach & Testing Strategy

The focus of this automation was to replicate how a real user interacts with the PrestaShop storefront while keeping the solution organized, easy to maintain, and aligned with Playwright best practices.

### ✔ 1. **Page Object Model (POM)**

The project is structured using a clean and modular POM:

* **HomePage**
  Handles selecting a recommended product, choosing size, adding multiple quantities, and interacting with the cart modal.

* **CartPage**
  Validates item counts and proceeds to checkout.

* **CheckoutPage**
  Manages the full checkout process: personal info, address, delivery, payment, and final confirmation.

This separation keeps the tests readable and makes extending coverage straightforward.

---

### ✔ 2. **Realistic User Journey**

The tests intentionally avoid shortcuts or internal API calls.
They follow the same steps an actual customer would:

* Navigate inside PrestaShop’s embedded iframe
* Open a product from the recommended section
* Select a size and add a chosen quantity
* Proceed through the guest checkout
* Choose delivery method
* Select “Pay by Bank Wire”
* Confirm the order

This ensures the end-to-end path is stable and accurately reflects production behavior.

---

### ✔ 3. **Clear and Direct Validations**

The suite validates the core functionality defined in the acceptance criteria:

#### **Adding multiple products**

* Ability to specify a desired quantity
* Correct opening and behavior of the cart modal
* Header cart badge count
* Subtotal quantity (`cart-subtotal-products`)

#### **Completing an order**

* Filling personal and address details
* Handling country/state selectors
* Delivery selection
* Payment method
* Accepting terms & conditions
* Successfully reaching the confirmation page
  → Verified with: **“Your order is confirmed”**

---

### ✔ 4. **Technical Considerations**

**Iframe handling**
The store is rendered inside `#framelive`, so all selectors are scoped accordingly using Playwright’s `FrameLocator`.

**Selector strategy**
A mix of:

* accessible roles (`getByRole`)
* labels (`getByLabel`)
* stable CSS selectors
* explicit locators declared in the POM

This keeps everything clean and avoids fragile element lookups.

**Wait strategy**
To avoid flaky behavior:

* `waitForLoadState('networkidle')`
* visibility checks
* no hardcoded sleeps unless unavoidable

This provides stability without sacrificing execution speed.

---

### ✔ 5. **Mobile Execution**

The project also includes a mobile viewport (Pixel 7) to validate that the flow works consistently in mobile scenarios.

---

# 🧪 Tests Included

The main test suite is located at:

```
tests/cart.spec.ts
```

It contains:

1. **Add multiple items to the cart**
2. **Place an order end-to-end**

Both desktop and mobile executions are supported through Playwright projects.

---

# ⚙️ Setup

```bash
npm install
npx playwright install
```

# ▶️ Running the Tests

### All tests

```bash
npx playwright test
```

### Desktop only

```bash
npx playwright test --project=chromium-desktop
```

### Mobile only

```bash
npx playwright test --project=chromium-mobile
```

### Playwright UI

```bash
npm run test:ui
```

---

# ✅ Summary

This project validates the full cart and checkout flow of the PrestaShop demo store, covering the key behaviors requested in the user story.
The solution uses a clean POM structure, stable selectors, and a realistic user flow executed through Playwright + TypeScript.
It’s designed to be understandable, maintainable, and easy to extend for future functionality.
