function getStatusClass(status) {
  switch (status) {
    case "PENDING": return "pending";
    case "SYNCED": return "synced";
    case "FAILED": return "failed";
    case "PENDING_RETURN_SYNC": return "return-sync";
    default: return "";
  }
}
/* ================= TRANSACTION LOG TABLE ================= */
function renderTransactionLogTable() {
  const tbody = document.getElementById("transaction-records-body");
  if (!transactionLogState.length) {
  tbody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center;padding:20px;">
        No transactions available
      </td>
    </tr>
  `;
  updateSummary();
  return;
}
  tbody.innerHTML = "";

  transactionLogState.forEach(transaction => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${transaction.transactionId}</td>
      <td>${transaction.bookTitle}</td>
      <td>${transaction.patronId}</td>
      <td>${new Date(transaction.checkoutTimestamp).toLocaleString()}</td>

      <td class="${getStatusClass(transaction.syncStatus)}">
        ${transaction.syncStatus.replaceAll("_", " ")}
      </td>

      <td>
        <div class="action-cell">
          <button class="remove-record-btn"
            data-transaction-id="${transaction.transactionId}">
            Remove
          </button>

          <button class="mark-returned-btn"
            data-transaction-id="${transaction.transactionId}"
            ${transaction.syncStatus !== "SYNCED" ? "disabled" : ""}>
            Mark Returned
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  updateSummary();
}
/* ================= UPDATE SUMMARY================= */
function updateSummary() {
  const total = transactionLogState.length;
  const pending = transactionLogState.filter(t => t.syncStatus === "PENDING").length;
  const synced = transactionLogState.filter(t => t.syncStatus === "SYNCED").length;

  document.getElementById("summary-footer").innerHTML = `
    <tr>
      <td colspan="6">
        Total: ${total} | Pending: ${pending} | Synced: ${synced}
      </td>
    </tr>
  `;
}

document.getElementById("transaction-records-table")
  .addEventListener("click", handleTableClick);

  /* ================= HANDLE TABLE CLICK ================= */

function handleTableClick(e) {

  const id = e.target.dataset.transactionId;

  if (e.target.classList.contains("remove-record-btn")) {
    if (!confirm("Delete transaction?")) return;

    transactionLogState = transactionLogState.filter(
      t => t.transactionId !== id
    );

    addAuditLog("RECORD_DELETED", { transactionId: id });

    saveTransactions();
    renderTransactionLogTable();
  }

  if (e.target.classList.contains("mark-returned-btn")) {
    const transaction = transactionLogState.find(t => t.transactionId === id);

    if (!transaction) return;

    transaction.returnTimestamp = new Date().toISOString();
    transaction.syncStatus = "PENDING_RETURN_SYNC";

    saveTransactions();
    renderTransactionLogTable();
  }
}