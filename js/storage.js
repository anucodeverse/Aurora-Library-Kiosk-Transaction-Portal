function loadTransactions() {
  try {
    const data = localStorage.getItem("aurora_kiosk_transactions");

    const parsed = data ? JSON.parse(data) : [];

    if (!Array.isArray(parsed)) throw new Error("Invalid data");

    transactionLogState = parsed;

  } catch (error) {
    console.error("Storage corrupted:", error);
    transactionLogState = [];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(
      "aurora_kiosk_transactions",
      JSON.stringify(transactionLogState)
    );
  } catch (error) {
    console.error("Failed to save transactions", error);
  }
}