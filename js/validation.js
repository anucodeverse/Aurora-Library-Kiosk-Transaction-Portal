function validateBookTitle(title) {
  const errors = [];

  const trimmed = title ? title.trim() : "";

  if (!trimmed) {
    errors.push("Book title is required");
  } else if (trimmed.length < 3) {
    errors.push("Book title must be at least 3 characters");
  }
  if (trimmed.length > 100) {
    errors.push("Book title is too long");
  }

  return errors;
}

/* ================= PATRON FORMAT VALIDATION ================= */

function validatePatronFormat(id) {
  if (!id) return false;

  const regex = /^P[0-9]{5}$/;
  return regex.test(id.trim());
}

/* ================= PATRON API VALIDATION ================= */

async function validatePatronAPI(patronId) {
  try {
    if (!patronId) return false;

    const trimmedId = patronId.trim();

    // format check first 
    if (!validatePatronFormat(trimmedId)) {
      return false;
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?id=${trimmedId}`
    );

    if (!response.ok) {
      console.warn("Patron API failed with status:", response.status);
      return false;
    }

    const data = await response.json();

    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error("Patron validation error:", error);
    return false;
  }
}