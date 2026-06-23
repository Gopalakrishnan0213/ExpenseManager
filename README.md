# ExpenseManager

HEMS is a prototype for a home expense management app that tracks expenses before
the payment is made.

## Prototype goal

The idea is to avoid manual notebook entry and avoid waiting for bank or UPI
statements. Instead, the user starts payment from HEMS:

1. Select an expense category.
2. Scan a merchant UPI QR or enter a UPI ID.
3. Confirm the amount and note.
4. Choose a payment app such as GPay, BHIM, PhonePe, or Paytm.
5. Complete payment in the selected app.
6. Return to HEMS and save or cancel the tracked transaction.

## How to view

Open `index.html` in a browser.

For a simple local server, run:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Prototype screens

- Home dashboard
- Category selection
- Payment details
- QR scanner simulation
- Payment confirmation
- Payment app simulation
- Payment result confirmation
- Saved transaction
- Transactions list with search and filters
- Transaction detail
- Reports and analytics
- Category management
- Budgets
- Manual expense entry
- Import statement mock
- Settings

## Notes

This is a visual and clickable prototype. It does not perform real UPI payments.
In a real Android app, the payment screen would be opened using UPI deep links or
Android intents.
