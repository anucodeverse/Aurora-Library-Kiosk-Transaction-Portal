let transactionLogState = [];
let isSyncing = false;

const KIOSK_IDENTIFIER = "AURORA-K101";

document.addEventListener("DOMContentLoaded", initApp);

/* ================= INIT ================= */

function initApp() {
  try {
    loadTransactions();
    updateNetworkStatus();

    window.addEventListener("online", () => {
      updateNetworkStatus();
      syncTransactions(); // auto-sync on reconnect 
    });

    window.addEventListener("offline", updateNetworkStatus);

    addAuditLog("APP_LOADED", { kioskId: KIOSK_IDENTIFIER });

    document
      .getElementById("transaction-entry-form")
      .addEventListener("submit", handleSubmit);

    document
      .getElementById("patron-id-input")
      .addEventListener("blur", handlePatronBlur);

    document
      .getElementById("book-title-input")
      .addEventListener("input", debounce(showSuggestions, 300));

    document
      .getElementById("sync-all-transactions-btn")
      .addEventListener("click", syncTransactions);

    renderTransactionLogTable();
  } catch (error) {
    console.error("App initialization failed:", error);
  }
}

/* ================= SUBMIT ================= */

async function handleSubmit(e) {
  e.preventDefault();

  const title =
    document.getElementById("book-title-input").value.trim();

  const patron =
    document.getElementById("patron-id-input").value.trim();

  let errors = validateBookTitle(title) || [];

  if (!validatePatronFormat(patron)) {
    errors.push("Invalid Patron ID (Format: P12345)");
  }

  // Validation Errors
  if (errors.length > 0) {
    showError(errors.join(" | "));
    return;
  }

  document.getElementById("patron-loading").innerHTML =
    "Checking Patron...";

  const patronExists = await validatePatronAPI(patron);

  document.getElementById("patron-loading").innerHTML = "";

  // Patron Not Found
  if (!patronExists) {
    showError("Patron ID not found or invalid.");
    return;
  }

  // Duplicate Transaction
  if (isDuplicateTransaction(title, patron)) {
    showError("Duplicate transaction not allowed.");
    return;
  }

  // Success
  createTransaction(title, patron);
}
/* ================= DUPLICATE CHECK ================= */

function isDuplicateTransaction(title, patron) {
  return transactionLogState.some(
    (t) =>
      t.bookTitle === title &&
      t.patronId === patron &&
      t.syncStatus !== "FAILED"
  );
}

/* ================= PATRON BLUR ================= */

async function handlePatronBlur() {
  const patron = document.getElementById("patron-id-input").value.trim();
  if (!patron) return;

  document.getElementById("patron-loading").innerHTML = "Checking Patron...";

 const exists = await validatePatronAPI(patron);

document.getElementById("patron-loading").innerHTML = "";

if (!exists) {
  showError("Patron ID not found or invalid.");
}
}

/* ================= VALIDATION API ================= */

async function validatePatronAPI(patronId) {
  await new Promise((r) => setTimeout(r, 300));

  const isValidFormat = /^P[0-9]{5}$/.test(patronId);
  if (!isValidFormat) return false;

 
  return /^P[0-9]{5}$/.test(patronId);
}

/* ================= CREATE TRANSACTION ================= */

function createTransaction(title, patron) {
  const transaction = {
    transactionId:
      crypto.randomUUID?.() ||
      Date.now() + "-" + Math.random().toString(16).slice(2),

    kioskId: KIOSK_IDENTIFIER,
    bookTitle: title,
    patronId: patron,
    checkoutTimestamp: new Date().toISOString(),
    returnTimestamp: null,
    syncStatus: "PENDING",
    remoteTransactionId: null,
    retryCount: 0,
  };

  transactionLogState.push(transaction);
  saveTransactions();

  addAuditLog("TRANSACTION_SUBMITTED", {
    transactionId: transaction.transactionId,
  });

  document.getElementById("book-title-input").value = "";
  document.getElementById("patron-id-input").value = "";

  showSuccess("Transaction Logged Successfully");

  renderTransactionLogTable();
}

/* ================= TOAST ================= */

function showToast(message) {
  const el = document.getElementById("status-notifications");
  el.innerHTML = message;

  setTimeout(() => {
    el.innerHTML = "";
  }, 2500);
}

/* ================= SUGGESTIONS ================= */

async function showSuggestions(e) {
  const query = e.target.value.trim().toLowerCase();
  const dropdown = document.getElementById("book-suggestions-dropdown");

  if (query.length < 2) {
    dropdown.style.display = "none";
    return;
  }

  dropdown.innerHTML = "";

  const titles = [
    ...new Set(
      transactionLogState.map(t => t.bookTitle)
    )
  ];

  const matches = titles.filter(title =>
    title.toLowerCase().includes(query)
  );

  matches.slice(0, 5).forEach(title => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.textContent = title;

    div.addEventListener("click", () => {
      document.getElementById("book-title-input").value = title;
      dropdown.style.display = "none";
    });

    dropdown.appendChild(div);
  });

  dropdown.style.display =
    matches.length > 0 ? "block" : "none";
}

/* ================= NETWORK ================= */

function updateNetworkStatus() {
  const indicator =
    document.getElementById("offline-indicator");

  const syncButton =
    document.getElementById("sync-all-transactions-btn");

  if (navigator.onLine) {

    indicator.textContent = "ONLINE";
    indicator.style.background = "#22c55e";

    syncButton.disabled = false;

  } else {

    indicator.textContent = "OFFLINE";
    indicator.style.background = "#ef4444";

    syncButton.disabled = true;
  }
}
/* ================= SHOW SUCCESS ================= */
function showSuccess(message) {
  const el = document.getElementById("status-notifications");

  el.style.display = "block";
  el.className = "success-alert";
  el.textContent = message;

  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}

function showError(message) {
  const el = document.getElementById("status-notifications");

  el.style.display = "block";
  el.className = "error-alert";
  el.textContent = message;

  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}

function showInfo(message) {
  const el = document.getElementById("status-notifications");

  el.style.display = "block";
  el.className = "info-alert";
  el.textContent = message;

  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}