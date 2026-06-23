async function syncTransactions() {
  const syncButton = document.getElementById("sync-all-transactions-btn");
  if (!syncButton || syncButton.disabled) return;

  syncButton.disabled = true;
  syncButton.textContent = "Syncing...";

  addAuditLog("SYNC_INITIATED", {
    total: transactionLogState.length
  });

  let successCount = 0;
  let failedCount = 0;

  const recordsToSync = transactionLogState.filter(t =>
    t.syncStatus === "PENDING" ||
    t.syncStatus === "PENDING_RETURN_SYNC" ||
    (t.syncStatus === "FAILED" && t.retryCount < 3)
  );

  if (recordsToSync.length === 0) {
  const statusEl =
    document.getElementById("status-notifications");

 showInfo(
"No pending records available for synchronization."
);

  syncButton.disabled = false;
  syncButton.textContent = "Sync Now";
  return;
}

  for (const transaction of recordsToSync) {
    try {
      await new Promise(r => setTimeout(r, 400));

      const payload = {
        transactionId: transaction.transactionId,
        kioskId: transaction.kioskId,
        bookTitle: transaction.bookTitle,
        patronId: transaction.patronId,
        checkoutTimestamp: transaction.checkoutTimestamp
      };

      const response = await fetch(
  "https://jsonplaceholder.typicode.com/posts",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }
);

if (!response.ok) {
  throw new Error("Sync failed");
}



transaction.syncStatus = "SYNCED";

      const data = await response.json();

      transaction.syncStatus = "SYNCED";
      transaction.remoteTransactionId = data.id;
      transaction.retryCount = 0;

      successCount++;

      addAuditLog("SYNC_RECORD_SUCCESS", {
        transactionId: transaction.transactionId
      });

    } catch (error) {
      transaction.syncStatus = "FAILED";
      transaction.retryCount++;

      failedCount++;

      addAuditLog("SYNC_RECORD_FAILED", {
        transactionId: transaction.transactionId,
        error: error.message
      });
    }
  }

  addAuditLog("SYNC_COMPLETE", { successCount, failedCount });

  saveTransactions();
  renderTransactionLogTable();

  document.getElementById("last-sync-time").textContent =
    "Last Sync: " + new Date().toLocaleString();

  const statusEl = document.getElementById("status-notifications");

   showSuccess(
`Sync Complete: ${successCount} successful, ${failedCount} failed`
);
      setTimeout(() => {
    statusEl.innerHTML = "";
  }, 5000);

  syncButton.disabled = false;
  syncButton.textContent = "Sync Now";
}


// expose globally (important for HTML button bindings)
window.syncTransactions = syncTransactions;