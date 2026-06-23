# Aurora Library Kiosk Transaction Portal

## Overview

Aurora Library Kiosk Transaction Portal is an offline-first web application designed for managing library book checkout transactions from self-service kiosks.

The system allows librarians or patrons to log book checkouts, validate patron IDs, track transaction statuses, synchronize records with a remote server, and maintain a complete audit trail of activities.

---

## Features

### Transaction Management

* Create new checkout transactions
* Generate unique transaction IDs
* Store transaction details locally
* Delete transactions with confirmation

### Patron Validation

* Patron ID format validation (`P12345`)
* Simulated API-based patron verification
* Real-time validation feedback

### Offline-First Support

* Works without internet connection
* Stores transactions in Local Storage
* Synchronizes pending transactions when online
* Network status monitoring

### Synchronization System

* Manual Sync Now functionality
* Automatic sync when connection is restored
* Retry mechanism for failed sync attempts
* Sync status tracking

### Return Processing

* Mark books as returned
* Return synchronization workflow
* Transaction lifecycle tracking

### Audit Trail

* Application startup logging
* Transaction creation logging
* Sync event logging
* Delete operation logging

### Book Title Suggestions

* Auto-suggest previously entered book titles
* Debounced search input
* Quick title selection

### Responsive Design

* Mobile-friendly layout
* Tablet support
* Desktop optimized interface

---

## Technology Stack

* HTML5
* CSS3
* JavaScript (ES6+)
* Local Storage API
* Fetch API
* JSONPlaceholder Mock API

---

## Project Structure

```text
project/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── table.js
│   ├── sync.js
│   ├── validation.js
│   ├── audit.js
│   └── util.js
│
└── README.md
```

---

## Installation

1. Clone the repository

```bash
git clone <https://github.com/anucodeverse/Aurora-Library-Kiosk-Transaction-Portal>
```

2. Open the project folder

```bash
cd aurora-library-kiosk
```

3. Run the application

Open `index.html` in a browser

or

Use VS Code Live Server.

---

## Usage

### Create Transaction

1. Enter Book Title
2. Enter Patron ID
3. Click Log Transaction

### Synchronize Records

1. Ensure internet connection is available
2. Click Sync Now
3. Pending transactions will be synchronized

### Return Book

1. Locate a synced transaction
2. Click Mark Returned
3. Sync again to complete return processing

---

## Validation Rules

### Book Title

* Required
* Minimum 3 characters

### Patron ID

Format:

```text
P12345
```

Pattern:

```regex
^P[0-9]{5}$
```

---

## Transaction Statuses

| Status              | Description                        |
| ------------------- | ---------------------------------- |
| PENDING             | Waiting for synchronization        |
| SYNCED              | Successfully synchronized          |
| FAILED              | Synchronization failed             |
| PENDING_RETURN_SYNC | Waiting for return synchronization |

---

## Local Storage Keys

### Transactions

```text
aurora_kiosk_transactions
```

### Audit Trail

```text
aurora_kiosk_audit_trail
```

---

## Testing Checklist

* Create transaction
* Validate patron ID
* Delete transaction
* Offline transaction creation
* Sync pending records
* Mark returned workflow
* Auto-sync after reconnect
* Audit trail generation
* Responsive layout validation

---

## Future Enhancements

* Real backend integration
* Authentication system
* User roles and permissions
* Advanced search and filtering
* Export transactions to CSV
* Dashboard analytics

---

## Author

Ananthalakshmi

Built as part of a JavaScript application development project demonstrating offline-first architecture, transaction management, synchronization workflows, and client-side data persistence.
