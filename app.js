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
  selectedTransactionId: "txn-1",
  manualExpense: {
    merchant: "Cash Vegetable Shop",
    amount: "250",
    category: "Grocery",
    paymentMethod: "Cash",
    note: "Vegetables from market",
  },
  filters: {
    category: "All",
    app: "All",
    date: "All",
    status: "All",
    search: "",
  },
  transactions: [
    {
      id: "txn-1",
      merchant: "DMart",
      category: "Grocery",
      amount: 850,
      app: "GPay",
      time: "Today, 10:15 AM",
      date: "Today",
      status: "Paid",
      note: "Monthly grocery",
    },
    {
      id: "txn-2",
      merchant: "Zomato",
      category: "Food",
      amount: 320,
      app: "BHIM",
      time: "Yesterday",
      date: "This Week",
      status: "Paid",
      note: "Dinner order",
    },
    {
      id: "txn-3",
      merchant: "Electricity Board",
      category: "Bills",
      amount: 1200,
      app: "PhonePe",
      time: "21 Jun",
      date: "This Month",
      status: "Paid",
      note: "Electricity bill",
    },
    {
      id: "txn-4",
      merchant: "Apollo Pharmacy",
      category: "Medical",
      amount: 460,
      app: "GPay",
      time: "18 Jun",
      date: "This Month",
      status: "Paid",
      note: "Medicines",
    },
    {
      id: "txn-5",
      merchant: "PVR Cinemas",
      category: "Entertainment",
      amount: 780,
      app: "Paytm",
      time: "12 Jun",
      date: "This Month",
      status: "Paid",
      note: "Movie tickets",
    },
    {
      id: "txn-6",
      merchant: "Reliance Fresh",
      category: "Grocery",
      amount: 640,
      app: "BHIM",
      time: "Draft",
      date: "Today",
      status: "Pending",
      note: "Payment opened but not confirmed",
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
const manualPaymentMethods = ["Cash", "Card", "Bank Transfer", "UPI Outside HEMS"];
const budgetTargets = [
  { category: "Grocery", limit: 8000 },
  { category: "Food", limit: 5000 },
  { category: "Bills", limit: 6000 },
  { category: "Entertainment", limit: 2500 },
];
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
        id: `txn-${Date.now()}`,
        merchant: draft.merchant || "UPI payment",
        category: draft.category,
        amount,
        app: draft.paymentApp,
        time: "Just now",
        date: "Today",
        status: "Paid",
        note: draft.note || draft.category,
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
  const total = state.transactions
    .filter((item) => item.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

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

    <section class="card">
      <h3 class="card-title">Prototype screens</h3>
      <div class="quick-grid">
        ${quickAction("Reports", "Charts and insights", "reports")}
        ${quickAction("Budgets", "Monthly limits", "budgets")}
        ${quickAction("Categories", "Manage groups", "categories-management")}
        ${quickAction("Manual Expense", "Cash or missed payment", "manual-expense")}
        ${quickAction("Import", "Statement upload mock", "import-statement")}
        ${quickAction("Settings", "App preferences", "settings")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="category">Pay Now</button>
      <button class="button secondary" type="button" data-screen="transactions">View Transactions</button>
    </div>
  `;
}

function quickAction(title, subtitle, screen) {
  return `
    <button class="quick-action" type="button" data-screen="${screen}">
      <strong>${title}</strong>
      <span>${subtitle}</span>
    </button>
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

function transactionRow(item, interactive = true) {
  const icon = item.category.slice(0, 2);
  const tag = interactive ? "button" : "div";
  const attributes = interactive
    ? `class="transaction-row transaction-button" type="button" data-transaction-id="${item.id}"`
    : `class="transaction-row"`;

  return `
    <${tag} ${attributes}>
      <div class="avatar">${icon}</div>
      <div class="grow">
        <p class="row-title">${item.merchant}</p>
        <p class="row-subtitle">${item.category} via ${item.app} - ${item.time}</p>
        <p class="row-subtitle">${item.note || ""}</p>
      </div>
      <div class="amount-cell">
        <strong>${money(item.amount)}</strong>
        <span class="pill ${item.status === "Paid" ? "paid" : "pending"}">${item.status}</span>
      </div>
    </${tag}>
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
  const filteredTransactions = getFilteredTransactions();
  const total = filteredTransactions.reduce((sum, item) => sum + item.amount, 0);

  return `
    ${header("Transactions", "Search and filter tracked payments")}

    <section class="card stack">
      <div class="field">
        <label for="transactionSearch">Search merchant or note</label>
        <input
          id="transactionSearch"
          type="search"
          value="${state.filters.search}"
          placeholder="Example: DMart, grocery, bill"
          data-filter-input="search"
        />
      </div>

      ${filterSection("Category", "category", ["All", "Grocery", "Food", "Bills", "Medical", "Entertainment"])}
      ${filterSection("Payment app", "app", ["All", "GPay", "BHIM", "PhonePe", "Paytm"])}
      ${filterSection("Date", "date", ["All", "Today", "This Week", "This Month"])}
      ${filterSection("Status", "status", ["All", "Paid", "Pending"])}

      <button class="button secondary" type="button" data-action="clear-filters">Clear Filters</button>
    </section>

    <section class="card">
      <div class="list-summary">
        <div>
          <span class="muted">Showing</span>
          <strong>${filteredTransactions.length} transaction${filteredTransactions.length === 1 ? "" : "s"}</strong>
        </div>
        <div>
          <span class="muted">Total</span>
          <strong>${money(total)}</strong>
        </div>
      </div>
      <div class="transaction-list">
        ${
          filteredTransactions.length
            ? filteredTransactions.map(transactionRow).join("")
            : `<div class="empty-state">No transactions match these filters.</div>`
        }
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-action="pay-again">New Payment</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
    </div>
  `;
}

function getFilteredTransactions() {
  const search = state.filters.search.trim().toLowerCase();

  return state.transactions.filter((item) => {
    const matchesCategory =
      state.filters.category === "All" || item.category === state.filters.category;
    const matchesApp = state.filters.app === "All" || item.app === state.filters.app;
    const matchesDate = state.filters.date === "All" || item.date === state.filters.date;
    const matchesStatus =
      state.filters.status === "All" || item.status === state.filters.status;
    const matchesSearch =
      !search ||
      item.merchant.toLowerCase().includes(search) ||
      (item.note || "").toLowerCase().includes(search);

    return matchesCategory && matchesApp && matchesDate && matchesStatus && matchesSearch;
  });
}

function filterSection(title, type, options) {
  return `
    <div class="filter-section">
      <p class="filter-title">${title}</p>
      <div class="filter-chips">
        ${options
          .map(
            (option) => `
              <button
                class="filter-chip ${state.filters[type] === option ? "active" : ""}"
                type="button"
                data-filter-type="${type}"
                data-filter-value="${option}"
              >
                ${option}
              </button>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function reportsScreen() {
  const paidTransactions = getPaidTransactions();
  const total = paidTransactions.reduce((sum, item) => sum + item.amount, 0);
  const categoryTotals = getCategoryTotals(paidTransactions);
  const appTotals = getTotalsByKey(paidTransactions, "app");
  const largestCategory = categoryTotals[0] || { label: "None", amount: 0 };

  return `
    ${header("Reports", "Monthly spending insights")}

    <section class="card summary-card">
      <span class="label">June total spend</span>
      <p class="amount">${money(total)}</p>
      <div class="split">
        <div>
          <span class="label">Top category</span>
          <strong>${largestCategory.label}</strong>
        </div>
        <div>
          <span class="label">Tracked payments</span>
          <strong>${paidTransactions.length}</strong>
        </div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Category-wise spending</h3>
      <div class="bar-list">
        ${categoryTotals.map((item) => reportBar(item.label, item.amount, total)).join("")}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Payment app-wise spending</h3>
      <div class="bar-list">
        ${appTotals.map((item) => reportBar(item.label, item.amount, total)).join("")}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Month comparison</h3>
      <div class="comparison-grid">
        ${metricBox("This month", money(total))}
        ${metricBox("Last month", money(9500))}
        ${metricBox("Difference", "- " + money(1890))}
        ${metricBox("Trend", "16% lower")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button" type="button" data-screen="transactions">Open Transactions</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
    </div>
  `;
}

function budgetsScreen() {
  const categoryTotals = getCategoryTotals(getPaidTransactions());

  return `
    ${header("Budgets", "Track monthly limits")}

    <section class="card summary-card">
      <span class="label">Monthly budget</span>
      <p class="amount">${money(22000)}</p>
      <div class="split">
        <div>
          <span class="label">Spent</span>
          <strong>${money(getPaidTransactions().reduce((sum, item) => sum + item.amount, 0))}</strong>
        </div>
        <div>
          <span class="label">Remaining</span>
          <strong>${money(14390)}</strong>
        </div>
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Category budgets</h3>
      <div class="budget-list">
        ${budgetTargets
          .map((budget) => {
            const spent = categoryTotals.find((item) => item.label === budget.category)?.amount || 0;
            return budgetRow(budget.category, spent, budget.limit);
          })
          .join("")}
      </div>
    </section>

    <section class="card stack">
      <h3 class="card-title">Budget alerts</h3>
      <div class="notice">
        HEMS can warn when a category reaches 80% of the monthly limit, before you make another payment.
      </div>
      <button class="button secondary" type="button">Add Category Budget</button>
    </section>
  `;
}

function categoriesManagementScreen() {
  return `
    ${header("Categories", "Manage category names, icons, and rules")}

    <section class="card">
      <h3 class="card-title">Default categories</h3>
      <div class="category-list">
        ${categories
          .map(
            (category) => `
              <div class="category-row">
                <div class="row-inline">
                  <span class="avatar">${category.icon}</span>
                  <div>
                    <p class="row-title">${category.name}</p>
                    <p class="row-subtitle">${category.sample}</p>
                  </div>
                </div>
                <button class="mini-button" type="button">Edit</button>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="card stack">
      <h3 class="card-title">Add category</h3>
      ${readonlyField("Category name", "House Rent")}
      ${readonlyField("Icon short code", "Re")}
      <button class="button secondary" type="button">Preview Add Category</button>
    </section>

    <section class="card">
      <h3 class="card-title">Auto rules preview</h3>
      <div class="rule-list">
        ${ruleRow("If note has DMart or BigBasket", "Grocery")}
        ${ruleRow("If note has Zomato or Swiggy", "Food")}
        ${ruleRow("If note has Netflix or PVR", "Entertainment")}
      </div>
    </section>
  `;
}

function settingsScreen() {
  return `
    ${header("Settings", "Control app behavior")}

    <section class="card">
      <h3 class="card-title">Payment preferences</h3>
      <div class="detail-card">
        ${settingRow("Default payment app", "GPay", "Selected")}
        ${settingRow("Currency", "INR", "Active")}
        ${settingRow("Ask confirmation after return", "On", "On")}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Privacy and data</h3>
      <div class="detail-card">
        ${settingRow("App lock", "Fingerprint / PIN", "On")}
        ${settingRow("Local backup", "Enabled", "On")}
        ${settingRow("Cloud sync", "Future option", "Later")}
      </div>
    </section>

    <section class="card stack">
      <h3 class="card-title">Export</h3>
      <button class="button secondary" type="button">Export CSV</button>
      <button class="button secondary" type="button">Export PDF Report</button>
      <button class="button ghost" type="button">Reset Demo Data</button>
    </section>
  `;
}

function transactionDetailScreen() {
  const item =
    state.transactions.find((transaction) => transaction.id === state.selectedTransactionId) ||
    state.transactions[0];

  return `
    ${header("Transaction Detail", "View and correct one expense")}

    <section class="card summary-card">
      <span class="label">${item.status}</span>
      <p class="amount">${money(item.amount)}</p>
      <p>${item.merchant}</p>
    </section>

    <section class="card detail-card">
      ${detailRow("Category", item.category)}
      ${detailRow("Payment method", item.app)}
      ${detailRow("Date", item.time)}
      ${detailRow("Status", item.status)}
      ${detailRow("Note", item.note || "-")}
      ${detailRow("Transaction ID", item.id.toUpperCase())}
    </section>

    <section class="card stack">
      <button class="button secondary" type="button" data-screen="categories-management">Edit Category</button>
      ${
        item.status === "Pending"
          ? `<button class="button success" type="button" data-action="mark-selected-paid">Mark as Paid</button>`
          : ""
      }
      <button class="button ghost" type="button" data-screen="transactions">Back to Transactions</button>
    </section>
  `;
}

function manualExpenseScreen() {
  const draft = state.manualExpense;

  return `
    ${header("Manual Expense", "For cash or missed transactions")}

    <section class="card stack">
      ${manualInputField("merchant", "Merchant / reason", draft.merchant)}
      ${manualInputField("amount", "Amount", draft.amount, "number")}
      ${manualInputField("note", "Note", draft.note)}
    </section>

    <section class="card">
      <h3 class="card-title">Category</h3>
      <div class="filter-chips wrap">
        ${categories
          .map(
            (category) => `
              <button
                class="filter-chip ${draft.category === category.name ? "active" : ""}"
                type="button"
                data-manual-category="${category.name}"
              >
                ${category.name}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>

    <section class="card">
      <h3 class="card-title">Payment method</h3>
      <div class="filter-chips wrap">
        ${manualPaymentMethods
          .map(
            (method) => `
              <button
                class="filter-chip ${draft.paymentMethod === method ? "active" : ""}"
                type="button"
                data-manual-method="${method}"
              >
                ${method}
              </button>
            `,
          )
          .join("")}
      </div>
    </section>

    <div class="bottom-actions">
      <button class="button success" type="button" data-action="save-manual-expense">Save Manual Expense</button>
      <button class="button secondary" type="button" data-screen="home">Go Home</button>
    </div>
  `;
}

function importStatementScreen() {
  return `
    ${header("Import Statement", "Future fallback for CSV or UPI history")}

    <section class="card upload-card">
      <div class="upload-icon">CSV</div>
      <h3>Upload bank or UPI statement</h3>
      <p class="muted">
        This screen is for cases where payments were not started from HEMS.
      </p>
      <button class="button secondary" type="button">Choose File</button>
    </section>

    <section class="card">
      <h3 class="card-title">Detected preview</h3>
      <div class="transaction-list">
        ${transactionRow({
          id: "import-1",
          merchant: "Swiggy",
          category: "Food",
          amount: 410,
          app: "UPI",
          time: "Imported",
          status: "Pending",
          note: "Auto category suggestion",
        }, false)}
        ${transactionRow({
          id: "import-2",
          merchant: "Metro Recharge",
          category: "Travel",
          amount: 200,
          app: "UPI",
          time: "Imported",
          status: "Pending",
          note: "Needs review before saving",
        }, false)}
      </div>
    </section>

    <section class="card stack">
      <button class="button" type="button">Review and Import</button>
      <button class="button secondary" type="button" data-screen="transactions">Open Transactions</button>
    </section>
  `;
}

function getPaidTransactions() {
  return state.transactions.filter((item) => item.status === "Paid");
}

function getCategoryTotals(transactions) {
  return getTotalsByKey(transactions, "category");
}

function getTotalsByKey(transactions, key) {
  const totals = transactions.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + item.amount;
    return acc;
  }, {});

  return Object.entries(totals)
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
}

function reportBar(label, amount, total) {
  const percent = total > 0 ? Math.round((amount / total) * 100) : 0;

  return `
    <div class="bar-row">
      <div class="category-row">
        <strong>${label}</strong>
        <span>${money(amount)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="--bar-width: ${percent}%"></div>
      </div>
      <span class="muted">${percent}% of spending</span>
    </div>
  `;
}

function budgetRow(category, spent, limit) {
  const percent = Math.min(Math.round((spent / limit) * 100), 100);
  const remaining = Math.max(limit - spent, 0);

  return `
    <div class="budget-row">
      <div class="category-row">
        <strong>${category}</strong>
        <span>${money(spent)} / ${money(limit)}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${percent > 80 ? "warning-fill" : ""}" style="--bar-width: ${percent}%"></div>
      </div>
      <span class="muted">${money(remaining)} remaining</span>
    </div>
  `;
}

function metricBox(label, value) {
  return `
    <div class="metric">
      <span class="label">${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function settingRow(label, value, badge) {
  return `
    <div class="detail-row">
      <div>
        <p class="row-title">${label}</p>
        <p class="row-subtitle">${value}</p>
      </div>
      <span class="switch-pill">${badge}</span>
    </div>
  `;
}

function ruleRow(rule, category) {
  return `
    <div class="category-row">
      <span>${rule}</span>
      <strong>${category}</strong>
    </div>
  `;
}

function readonlyField(label, value) {
  return `
    <div class="field">
      <label>${label}</label>
      <input type="text" value="${value}" readonly />
    </div>
  `;
}

function manualInputField(name, label, value, type = "text") {
  return `
    <div class="field">
      <label for="manual-${name}">${label}</label>
      <input id="manual-${name}" type="${type}" value="${value || ""}" data-manual-input="${name}" />
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
    reports: reportsScreen,
    budgets: budgetsScreen,
    "categories-management": categoriesManagementScreen,
    settings: settingsScreen,
    "transaction-detail": transactionDetailScreen,
    "manual-expense": manualExpenseScreen,
    "import-statement": importStatementScreen,
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

  if (target.dataset.transactionId) {
    state.selectedTransactionId = target.dataset.transactionId;
    setScreen("transaction-detail");
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

  if (target.dataset.filterType) {
    state.filters = {
      ...state.filters,
      [target.dataset.filterType]: target.dataset.filterValue,
    };
    render();
    return;
  }

  if (target.dataset.manualCategory) {
    state.manualExpense = {
      ...state.manualExpense,
      category: target.dataset.manualCategory,
    };
    render();
    return;
  }

  if (target.dataset.manualMethod) {
    state.manualExpense = {
      ...state.manualExpense,
      paymentMethod: target.dataset.manualMethod,
    };
    render();
    return;
  }

  const actions = {
    back: () => setScreen("home"),
    "clear-filters": () => {
      state.filters = {
        category: "All",
        app: "All",
        date: "All",
        status: "All",
        search: "",
      };
      render();
    },
    "mark-selected-paid": () => {
      state.transactions = state.transactions.map((item) =>
        item.id === state.selectedTransactionId
          ? { ...item, status: "Paid", time: "Just now", date: "Today" }
          : item,
      );
      render();
    },
    "save-manual-expense": () => {
      const draft = state.manualExpense;
      const amount = Number(draft.amount || 0);

      if (amount <= 0) {
        return;
      }

      const transaction = {
        id: `manual-${Date.now()}`,
        merchant: draft.merchant || "Manual expense",
        category: draft.category,
        amount,
        app: draft.paymentMethod,
        time: "Just now",
        date: "Today",
        status: "Paid",
        note: draft.note || "Manual entry",
      };

      state.transactions = [transaction, ...state.transactions];
      state.selectedTransactionId = transaction.id;
      setScreen("transaction-detail");
    },
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
  const manualInput = event.target.dataset.manualInput;

  if (manualInput) {
    state.manualExpense = {
      ...state.manualExpense,
      [manualInput]: event.target.value,
    };
    return;
  }

  const filterInput = event.target.dataset.filterInput;

  if (filterInput) {
    state.filters = {
      ...state.filters,
      [filterInput]: event.target.value,
    };
    render();

    const updatedInput = app.querySelector(`[data-filter-input="${filterInput}"]`);
    if (updatedInput) {
      updatedInput.focus();
      updatedInput.setSelectionRange(event.target.value.length, event.target.value.length);
    }
    return;
  }

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
