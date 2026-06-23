const defaultTransaction = {
  category: "Grocery",
  categoryIcon: "Gr",
  merchant: "DMart",
  upiId: "dmart-store@upi",
  amount: "850",
  note: "Monthly grocery",
  paymentApp: "GPay",
  status: "Draft",
};

const state = {
  screen: "home",
  transaction: { ...defaultTransaction },
  transactions: [
    {
      merchant: "DMart",
      category: "Grocery",
      amount: 850,
      app: "GPay",
      time: "Today, 10:15 AM",
    },
    {
      merchant: "Zomato",
      category: "Food",
      amount: 320,
      app: "BHIM",
      time: "Yesterday",
    },
    {
      merchant: "Electricity Board",
      category: "Bills",
      amount: 1200,
      app: "PhonePe",
      time: "21 Jun",
    },
  ],
};

const categories = [
  { name: "Grocery", icon: "Gr", sample: "DMart, BigBasket" },
  { name: "Food", icon: "Fo", sample: "Zomato, hotel" },
  { name: "Bills", icon: "Bi", sample: "EB, gas, water" },
  { name: "Travel", icon: "Tr", sample: "Fuel, bus, taxi" },
  { name: "Shopping", icon: "Sh", sample: "Amazon, clothes" },
  { name: "Medical", icon: "Me", sample: "Pharmacy, doctor" },
  { name: "Entertainment", icon: "En", sample: "Movie, OTT" },
  { name: "Others", icon: "Ot", sample: "Anything else" },
];

const paymentApps = ["GPay", "BHIM", "PhonePe", "Paytm"];
const app = document.querySelector("#app");

function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
}

function setScreen(screen) {
  state.screen = screen;
  render();
}

function updateTransaction(partial) {
  state.transaction = { ...state.transaction, ...partial };
  render();
}

function resetDraft() {
  state.transaction = { ...defaultTransaction, status: "Draft" };
  render();
}

function saveTransaction(status = "Paid") {
  const draft = state.transaction;
  const amount = Number(draft.amount || 0);

  if (status === "Paid" && amount > 0) {
    state.transactions = [
      {
        merchant: draft.merchant || "UPI payment",
        category: draft.category,
        amount,
        app: draft.paymentApp,
        time: "Just now",
      },
      ...state.transactions,
    ];
  }

  state.transaction = { ...draft, status };
  setScreen(status === "Paid" ? "saved" : "cancelled");
}

function header(title, subtitle, showBack = true) {
  return `
    <div class="screen-header">
      <div>
        <h2 class="screen-title">${title}</h2>
        ${subtitle ? `<p class="screen-subtitle">${subtitle}</p>` : ""}
      </div>
      ${
        showBack
          ? `<button class="icon-button" type="button" data-action="back" aria-label="Go back">Back</button>`
          : ""
      }
    </div>
  `;
}

function homeScreen() {
  const total = state.transactions.reduce((sum, item) => sum + item.amount, 0);

  return `
    ${header("HEMS", "Track expense before payment", false)}

    <section class="card summary-card">
      <span class="label">This month spent</span>
      <p class="amount">${money(total)}</p>
      <div class="split">
        <div>
          <span class="label">Today</span>
          <strong>${money(850)}</strong>
        </div>
        <div>
          <span class="label">Top category</span>
          <strong>Grocery</strong>
        </div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Category summary</h3>
      <div class="category-list">
        ${summaryRow("Grocery", 6200)}
        ${summaryRow("Food", 4100)}
        ${summaryRow("Bills", 5000)}
        ${summaryRow("Travel", 2000)}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Recent transactions</h3>
      <div class="transaction-list">
        ${state.transactions.slice(0, 3).map(transactionRow).join("")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="category">Pay Now</button>
      <button class="button secondary" type="button" data-screen="transactions">View Transactions</button>
    </div>
  `;
}

function summaryRow(label, amount) {
  return `
    <div class="category-row">
      <strong>${label}</strong>
      <span>${money(amount)}</span>
    </div>
  `;
}

function transactionRow(item) {
  const icon = item.category.slice(0, 2);

  return `
    <div class="transaction-row">
      <div class="avatar">${icon}</div>
      <div class="grow">
        <p class="row-title">${item.merchant}</p>
        <p class="row-subtitle">${item.category} via ${item.app} - ${item.time}</p>
      </div>
      <strong>${money(item.amount)}</strong>
    </div>
  `;
}

function categoryScreen() {
  return `
    ${header("Select Category", "Pick category before starting payment")}

    <div class="category-grid">
      ${categories
        .map(
          (category) => `
            <button
              class="select-card ${state.transaction.category === category.name ? "active" : ""}"
              type="button"
              data-category="${category.name}"
              data-category-icon="${category.icon}"
            >
              <span class="avatar">${category.icon}</span>
              <strong>${category.name}</strong>
              <span class="muted">${category.sample}</span>
            </button>
          `,
        )
        .join("")}
    </div>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="payment-details">Continue</button>
    </div>
  `;
}

function paymentDetailsScreen() {
  const transaction = state.transaction;

  return `
    ${header(`${transaction.category} Payment`, "Choose QR scan or manual UPI")}

    <section class="card stack">
      <button class="button" type="button" data-screen="scanner">Scan UPI QR</button>
      <button class="button secondary" type="button" data-action="manual-upi">Enter UPI ID Manually</button>
      <div class="notice">
        If the merchant QR already has an amount, HEMS will read it and fill the amount automatically.
      </div>
    </section>

    <section class="card stack">
      ${inputField("merchant", "Merchant name", transaction.merchant)}
      ${inputField("upiId", "UPI ID", transaction.upiId)}
      ${inputField("amount", "Amount", transaction.amount, "number")}
      ${inputField("note", "Note", transaction.note)}
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="confirm">Continue to App Selection</button>
    </div>
  `;
}

function inputField(name, label, value, type = "text") {
  return `
    <div class="field">
      <label for="${name}">${label}</label>
      <input id="${name}" name="${name}" type="${type}" value="${value || ""}" data-input="${name}" />
    </div>
  `;
}

function scannerScreen() {
  return `
    ${header("Scan Merchant QR", "Prototype simulates a QR with amount")}

    <section class="qr-box">
      <div class="qr-frame">UPI QR</div>
      <div class="scan-line"></div>
    </section>

    <section class="card">
      <h3 class="card-title">Detected after scan</h3>
      <div class="detail-card">
        ${detailRow("Merchant", "DMart")}
        ${detailRow("UPI ID", "dmart-store@upi")}
        ${detailRow("Amount from QR", money(850))}
        ${detailRow("Note", state.transaction.category)}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button success" type="button" data-action="use-scanned-qr">Use This QR</button>
      <button class="button secondary" type="button" data-screen="payment-details">Enter UPI ID Instead</button>
    </div>
  `;
}

function confirmScreen() {
  const transaction = state.transaction;

  return `
    ${header("Confirm Payment", "HEMS knows these details before payment")}

    <section class="card detail-card">
      ${detailRow("Category", transaction.category)}
      ${detailRow("Merchant", transaction.merchant || "Not entered")}
      ${detailRow("UPI ID", transaction.upiId || "Not entered")}
      ${detailRow("Amount", money(transaction.amount))}
      ${detailRow("Note", transaction.note || transaction.category)}
    </section>

    <section class="card">
      <h3 class="card-title">Pay using</h3>
      <div class="app-grid">
        ${paymentApps
          .map(
            (paymentApp) => `
              <button
                class="select-card ${transaction.paymentApp === paymentApp ? "active" : ""}"
                type="button"
                data-payment-app="${paymentApp}"
              >
                <span class="avatar">${paymentApp.slice(0, 2)}</span>
                <strong>${paymentApp}</strong>
              </button>
            `,
          )
          .join("")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="payment-app">Pay Now</button>
      <button class="button secondary" type="button" data-screen="payment-details">Edit Details</button>
    </div>
  `;
}

function paymentAppScreen() {
  const transaction = state.transaction;

  return `
    ${header(transaction.paymentApp, "This simulates the selected UPI app")}

    <section class="payment-app">
      <div class="payment-logo">${transaction.paymentApp.slice(0, 2)}</div>
      <div>
        <p class="muted">Payment screen opens directly with details filled</p>
        <h2>${money(transaction.amount)}</h2>
      </div>
      <div class="card detail-card">
        ${detailRow("Payee", transaction.merchant)}
        ${detailRow("UPI ID", transaction.upiId)}
        ${detailRow("Note", transaction.note)}
      </div>
      <button class="button success" type="button" data-screen="result">Simulate Payment Completed</button>
      <button class="button secondary" type="button" data-screen="result">Return Without Auto Status</button>
    </section>
  `;
}

function resultScreen() {
  const transaction = state.transaction;

  return `
    ${header("Payment Result", "Some UPI apps may not share final status")}

    <section class="card detail-card">
      ${detailRow("Amount", money(transaction.amount))}
      ${detailRow("Category", transaction.category)}
      ${detailRow("Merchant", transaction.merchant)}
      ${detailRow("Payment app", transaction.paymentApp)}
    </section>

    <section class="card">
      <h3 class="card-title">Did payment complete?</h3>
      <p class="muted">
        If the payment app returns success, HEMS can save automatically. If not, this one-tap confirmation keeps the record correct.
      </p>
    </section>

    <div class="bottom-actions">
      <button class="button success" type="button" data-action="save-paid">Yes, Save Transaction</button>
      <button class="button secondary" type="button" data-action="save-cancelled">No, Cancel Tracking</button>
      <button class="button ghost" type="button" data-screen="payment-details">Edit Details</button>
    </div>
  `;
}

function savedScreen() {
  const transaction = state.transaction;

  return `
    ${header("Transaction Saved", "Your expense is now tracked", false)}

    <section class="card payment-app">
      <div class="big-check">OK</div>
      <div>
        <h2>${money(transaction.amount)} saved</h2>
        <p class="muted">
          Saved under ${transaction.category} from ${transaction.merchant} using ${transaction.paymentApp}.
        </p>
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-action="pay-again">Pay Again</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
      <button class="button ghost" type="button" data-screen="transactions">View Transactions</button>
    </div>
  `;
}

function cancelledScreen() {
  return `
    ${header("Tracking Cancelled", "No expense was saved", false)}

    <section class="card">
      <h3 class="card-title">Payment not saved</h3>
      <p class="muted">
        Use this when you opened the payment app but did not finish the payment.
      </p>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-action="pay-again">Try Again</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
    </div>
  `;
}

function transactionsScreen() {
  return `
    ${header("Transactions", "All tracked payments")}

    <section class="card">
      <div class="transaction-list">
        ${state.transactions.map(transactionRow).join("")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-action="pay-again">New Payment</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
    </div>
  `;
}

function detailRow(label, value) {
  return `
    <div class="detail-row">
      <span class="muted">${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function render() {
  const screens = {
    home: homeScreen,
    category: categoryScreen,
    "payment-details": paymentDetailsScreen,
    scanner: scannerScreen,
    confirm: confirmScreen,
    "payment-app": paymentAppScreen,
    result: resultScreen,
    saved: savedScreen,
    cancelled: cancelledScreen,
    transactions: transactionsScreen,
  };

  app.innerHTML = screens[state.screen]();
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button");

  if (!target) {
    return;
  }

  if (target.dataset.screen) {
    setScreen(target.dataset.screen);
    return;
  }

  if (target.dataset.category) {
    updateTransaction({
      category: target.dataset.category,
      categoryIcon: target.dataset.categoryIcon,
      note: target.dataset.category,
    });
    return;
  }

  if (target.dataset.paymentApp) {
    updateTransaction({ paymentApp: target.dataset.paymentApp });
    return;
  }

  const actions = {
    back: () => setScreen("home"),
    "manual-upi": () =>
      updateTransaction({
        merchant: "",
        upiId: "",
        amount: "",
        note: state.transaction.category,
      }),
    "use-scanned-qr": () => {
      updateTransaction({
        merchant: "DMart",
        upiId: "dmart-store@upi",
        amount: "850",
        note: state.transaction.category,
      });
      setScreen("confirm");
    },
    "save-paid": () => saveTransaction("Paid"),
    "save-cancelled": () => saveTransaction("Cancelled"),
    "pay-again": () => {
      resetDraft();
      setScreen("category");
    },
  };

  if (actions[target.dataset.action]) {
    actions[target.dataset.action]();
  }
});

app.addEventListener("input", (event) => {
  const inputName = event.target.dataset.input;

  if (!inputName) {
    return;
  }

  state.transaction = {
    ...state.transaction,
    [inputName]: event.target.value,
  };
});

render();
