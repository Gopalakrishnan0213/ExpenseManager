# Cursor Prompt: Build the Full HEMS Mobile App

Copy this prompt into Cursor on Windows when you are ready to build the real app.

```text
You are a senior mobile app engineer. Build the complete HEMS app: Home Expense
Management System.

Context:
- This repository currently contains a clickable browser prototype in:
  - index.html
  - styles.css
  - app.js
- Use that prototype as the product reference for screens, flow, labels, and
  visual direction.
- The real app should be a mobile app, Android-first, because the main use case
  is paying through GPay, BHIM, PhonePe, Paytm, or another UPI app.

Goal:
Build a working React Native mobile app where the user starts payments from HEMS
so the expense is tracked before the payment happens. The app should reduce
manual notebook tracking and reduce dependence on bank statements.

Recommended stack:
- React Native with Expo
- TypeScript
- Expo Router or React Navigation
- Local persistent storage using SQLite or AsyncStorage
- Expo Camera for UPI QR scanning
- Expo Linking / Android intents for opening UPI payment screens
- Keep UI mobile-first and close to the existing prototype design

Important product flow:
1. User opens HEMS.
2. User taps Pay Now.
3. User selects category: Grocery, Food, Bills, Travel, Shopping, Medical,
   Entertainment, Others.
4. User scans UPI QR or manually enters UPI ID.
5. If QR contains amount, prefill amount.
6. If QR does not contain amount, ask user to enter amount.
7. User confirms merchant, UPI ID, amount, note, and category.
8. User chooses payment app: GPay, BHIM, PhonePe, Paytm, or default UPI app.
9. App opens the UPI payment screen using a UPI deep link:
   upi://pay?pa=<upiId>&pn=<payeeName>&am=<amount>&cu=INR&tn=<note>
10. User completes payment in selected UPI app.
11. User returns to HEMS.
12. If payment result is available, save status automatically.
13. If payment result is not available, show one-tap confirmation:
    - Yes, Save Transaction
    - No, Cancel Tracking
    - Edit Details

Important limitation:
Do not claim that GPay/BHIM/PhonePe will always return exact transaction status.
Some UPI apps may not return full status. HEMS must handle this gracefully with a
manual confirmation screen after returning from the payment app.

Screens to build:

1. Home Dashboard
- Monthly total spending
- Today's spending
- Top category
- Category summary
- Recent transactions
- Primary Pay Now button
- Shortcuts to Transactions, Reports, Budgets, Categories, Manual Expense,
  Import Statement, Settings

2. Category Selection
- Grid of categories with icon/short code
- Continue button

3. Payment Details
- Scan UPI QR
- Enter UPI ID manually
- Merchant name
- UPI ID
- Amount
- Note
- Continue to confirmation

4. QR Scanner
- Use camera to scan QR
- Parse UPI QR links
- Extract:
  - pa: UPI ID
  - pn: payee name
  - am: amount, if available
  - tn: transaction note, if available
  - cu: currency
- Show scanned details before continuing

5. Confirm Payment
- Category
- Merchant
- UPI ID
- Amount
- Note
- Payment app selector
- Pay Now button
- Edit Details button

6. External Payment Launch
- Build UPI deep link safely with URL encoding
- Open payment app/payment sheet
- Prefer selected app when possible on Android
- If selected app cannot open, fall back to system UPI chooser
- If no UPI app exists, show helpful error

7. Payment Result
- Show transaction summary
- If callback gives success/failure, use it
- Otherwise ask:
  - Yes, Save Transaction
  - No, Cancel Tracking
  - Edit Details

8. Transaction Saved
- Show saved amount, merchant, category, payment app, date/time
- Actions:
  - Pay Again
  - Go Home
  - View Transactions

9. Transactions List
- Search by merchant or note
- Filter by category
- Filter by payment app/payment method
- Filter by date: Today, This Week, This Month, Custom
- Filter by status: Paid, Pending, Cancelled
- Show filtered total amount
- Show matching transaction count
- Empty state when no records match
- Tap a transaction to open Transaction Detail

10. Transaction Detail
- Amount
- Merchant
- Category
- UPI ID, if available
- Payment method/app
- Date/time
- Status
- Note
- Transaction reference, if available
- Actions:
  - Edit category
  - Edit note
  - Mark pending as paid
  - Delete transaction

11. Reports / Analytics
- Monthly total
- Category-wise spending
- Payment app-wise spending
- Merchant-wise spending
- Month comparison
- Use simple native bar charts first; avoid heavy chart dependencies unless
  necessary

12. Budgets
- Monthly total budget
- Category budgets
- Spent vs remaining
- Warning when category reaches 80% of budget
- Warning before payment if selected category is near/over budget

13. Categories Management
- Default categories
- Add category
- Rename category
- Change icon/color
- Archive/delete category if safe
- Auto-category rules preview:
  - DMart, BigBasket -> Grocery
  - Zomato, Swiggy -> Food
  - Netflix, PVR -> Entertainment

14. Manual Expense
- For cash payments or missed transactions
- Merchant/reason
- Amount
- Category
- Payment method: Cash, Card, Bank Transfer, UPI Outside HEMS
- Note
- Save transaction

15. Import Statement
- Allow selecting a CSV file
- Parse basic transaction rows
- Show detected preview
- Auto-suggest category based on notes/merchant keywords
- Let user review before saving
- This is a fallback, not the main flow

16. Settings
- Default payment app
- Currency: INR
- Ask confirmation after return: on/off
- App lock placeholder
- Backup/export data
- Export CSV
- Reset local data
- About app

Data model:

Transaction:
- id: string
- amount: number
- currency: "INR"
- merchantName: string
- upiId?: string
- categoryId: string
- paymentMethod: "GPay" | "BHIM" | "PhonePe" | "Paytm" | "Cash" | "Card" |
  "Bank Transfer" | "UPI Outside HEMS"
- status: "Paid" | "Pending" | "Cancelled" | "Failed"
- note?: string
- transactionRef?: string
- createdAt: ISO string
- paidAt?: ISO string
- source: "HEMS_UPI" | "Manual" | "Import"

Category:
- id: string
- name: string
- icon: string
- color: string
- archived: boolean

Budget:
- id: string
- categoryId?: string
- month: YYYY-MM
- limit: number

Settings:
- defaultPaymentApp
- currency
- askConfirmationAfterReturn
- appLockEnabled

UPI QR parsing:
- Support QR contents that are already UPI links:
  upi://pay?pa=merchant@upi&pn=MerchantName&am=850&cu=INR&tn=Grocery
- Parse query params using URL or a safe parser.
- Handle missing amount.
- Handle missing payee name.
- Validate UPI ID format lightly before proceeding.

UPI deep link generation:
- Encode all query values.
- Required:
  - pa
  - am
  - cu=INR
- Optional:
  - pn
  - tn
- Example:
  upi://pay?pa=dmart-store%40upi&pn=DMart&am=850&cu=INR&tn=Grocery

Persistence:
- Store all transactions, categories, budgets, and settings locally.
- Data must remain after app restart.
- Seed default categories on first launch.
- Seed demo transactions only in development/demo mode.

UI requirements:
- Use the current prototype as visual reference.
- Keep design clean, mobile-first, and simple.
- Large Pay Now action should be easy to access.
- Use cards, category chips, filters, and simple progress bars.
- Support small Android screens.
- Avoid overly complex animations.

Quality requirements:
- Use TypeScript types for data models.
- Keep business logic separate from screen components where reasonable.
- Add helper functions for:
  - UPI QR parsing
  - UPI link generation
  - category totals
  - filters
  - budget calculations
- Add basic tests for pure helpers if the project test setup is available.
- Do not hardcode all behavior inside components.

Suggested project structure:

src/
  app/
    screens or routes
  components/
    Button.tsx
    Card.tsx
    CategoryChip.tsx
    TransactionRow.tsx
    FilterChips.tsx
    ProgressBar.tsx
  data/
    defaultCategories.ts
    demoData.ts
  models/
    transaction.ts
    category.ts
    budget.ts
    settings.ts
  services/
    storage.ts
    upi.ts
    importCsv.ts
  utils/
    money.ts
    dates.ts
    reports.ts

Acceptance checks:
- App runs on Android through Expo.
- User can create a payment draft from category + QR/manual UPI + amount.
- App can generate and open a UPI payment link.
- User can return and save/cancel the transaction.
- Saved transactions appear in list and dashboard totals.
- Transactions filters work.
- Manual expense save works.
- Reports calculate from stored transactions.
- Budgets show spent and remaining.
- Categories can be viewed and managed at prototype-level.
- Settings screen is present.
- Data persists after app restart.

Implementation approach:
1. Create the Expo React Native TypeScript app inside this repository.
2. Port the static prototype flow into real mobile screens.
3. Implement local persistence.
4. Implement UPI QR parsing and UPI link generation.
5. Implement transaction creation and filters.
6. Implement reports, budgets, categories, manual expense, import, and settings.
7. Run formatting, type checks, and app startup verification.
8. Update README with setup and run instructions for Windows.

Windows run instructions to include in README:
- Install Node.js LTS.
- Install Expo Go on Android phone.
- Run npm install.
- Run npx expo start.
- Scan QR from terminal/browser with Expo Go.
- For UPI intent testing, use an Android device with a UPI app installed.

Do not remove the current prototype unless you replace it with equivalent app
documentation or keep it as a design reference.
```
