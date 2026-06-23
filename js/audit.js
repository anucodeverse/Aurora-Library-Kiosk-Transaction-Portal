let auditLogState = loadAuditLogs();

function loadAuditLogs() {
  try {
    const data = localStorage.getItem("aurora_kiosk_audit_trail");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Audit log corrupted, resetting...");
    return [];
  }
}

function addAuditLog(eventType, details = {}) {
  auditLogState.push({
    timestamp: new Date().toISOString(),
    eventType,
    details
  });

  // keep last 500 only (prevents localStorage bloat)
  if (auditLogState.length > 500) {
    auditLogState = auditLogState.slice(-500);
  }

  try {
    localStorage.setItem(
      "aurora_kiosk_audit_trail",
      JSON.stringify(auditLogState)
    );
  } catch (e) {
    console.error("Audit save failed", e);
  }
}