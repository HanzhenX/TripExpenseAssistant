# Project Proposal: TripMate

## 1. Motivation

### Problem Statement
Splitting expenses among friends, family, or colleagues while traveling can lead to confusion. Manual tracking using spreadsheets or messaging apps results in errors, delays, and confusion over who owes what. There is a lack of quick solutions that make it easy to track group expenses, settle debts, and store receipts.

### Why This Project?
This project aims to solve these issues by providing a simple group expense tracking system. It will:
- **Simplify expense tracking** by allowing users to input and categorize expenses easily.
- **Automate debt calculation** using an efficient, optimized algorithm to determine minimal transactions needed for debt settlement.
- **Ensure transparency** by providing updates, a history of transactions, and receipt storage.
- **Enhance usability** with an intuitive UI and integration with modern authentication systems.

### Target Users
- **Travelers & Tourists** who share accommodation, food, and activities.
- **Roommates** who split rent, utilities, and groceries.
- **Event organizers** who need to track shared expenses efficiently.
- **Families & Friends** managing shared expenses over time, such as birthdays, gifts, and vacations.

### Existing Solutions & Their Limitations
- **Splitwise**: Requires manual refreshes, lacks real-time updates, and is not open-source.
- **Google Sheets**: Users must manually input and track expenses, leading to potential errors.
- **Venmo/PayPal**: Only facilitates payments but does not track shared expenses.

**Our solution combines** tracking, automatic debt simplification, receipt storage, and a user-friendly experience into a **single, secure, and scalable web application**.

---

## 2. Objective and Key Features

### Project Objective
Develop a **full-stack web application** using **Next.js** that enables users to **create trip groups, add expenses, track balances, and settle debts efficiently**, all while ensuring **data integrity, security, and collaboration**.

### Technical Implementation Approach
- **Frontend**: Next.js 13+ with App Router, Tailwind CSS, and shadcn/ui.
- **Backend**: Next.js API Routes for backend logic.
- **Database**: PostgreSQL for structured data storage.
- **Cloud Storage**: AWS S3 for receipt file handling.
- **Authentication**: NextAuth.js with Google OAuth.

---

## Core Features & Functionality

### User Authentication & Authorization
- Google OAuth-based authentication via NextAuth.js.
- Secure session management using JWT and server-side validation.
- Role-based access control to ensure only group members can add expenses or settle debts.

### Home Page (`/`)
- Displays **user’s avatar** and a **list of groups** that the user is part of.
- **Buttons:**
  - `Create a Group`: Allows users to create a new group with a trip name and description.
  - `Join a Group`: Users can enter an invitation code to join an existing group.
- **Loading and error handling** for fetching user groups.

### Group Page (`/group/[id]`)
#### **Left Panel**
- Displays the **list of users** in the group.

#### **Right Panel**
- Displays the **list of expenses** added by users within the group.
- Each expense should have:
  - `Edit` button to navigate to edit expenses.
  - `Delete` button to trigger deletion confirmation.

#### **Each Expense Entry Shows:**
- Who paid.
- Total amount.
- List of participants (who owes the payer and by how much).
- Timestamp (ordered by the time added).

#### **Submit New Expense Button**
- Allows users to **submit a new expense** paid by them.
- Redirects to **Expense Management**.
- Users can select which group members owe them.
- **Default**: All group members split the expense equally.
- **Formula**:
  ```math
  (Total Expense) / (Number of Participants + 1) = Amount Each Participant Owes
  ```

#### **Settle Button (Group Creator Only)**
- Computes and simplifies transactions to determine who owes whom.
- Displays **minimal set of payments needed** to settle the group debts.

#### **Group Invitation Code**
- Displayed prominently on the **Group Page**.
- Users can **copy & share** the code to invite others.

### Expense Management (`/group/[id]/add-expense`)
#### **Form Fields**
- **Expense Description** (Required, text input)
- **Amount** (Required, decimal input)
- **Paid by** (Dropdown of group members)
- **Participants** (Multi-select dropdown)
- **Category Selection** (Food, Travel, Lodging, Miscellaneous)
- **Upload Receipt** (Optional, file upload to AWS S3)


### Edit Expense Route (`/group/[id]/edit-expense/[expenseId]`)
#### **Page Layout**
- **Main heading:** `Edit Expense`
- **Pre-populated form** with existing expense details.

#### **Form Fields**
- **Expense Description** (Required, text input)
- **Amount** (Required, decimal input, min=0.01)
- **Paid By** (Dropdown of group members; defaults to original payer)
- **Participants** (Multi-select dropdown; defaults to original selections)
- **Category Selection** (Dropdown: Food, Travel, Lodging, Miscellaneous)
- **Upload Receipt** (Optional, allows replacing existing receipt)


### Delete Functionality
- Each expense should have a **`Delete Expense`** button.
- Clicking the delete button triggers a **confirmation dialog**:
  "Are you sure you want to delete [expense description]?"
- **If OK is clicked**:
  - Deletes the expense from the database.
  - Displays `Expense deleted successfully`.
- **If Cancel is clicked**:
  - Closes the dialog without action.
- **If deletion fails**:
  - Displays `Error deleting expense`.


### Settle Debts (`/group/[id]/settle`)
- Only the **group creator** can click `Settle`.
- Computes a **final settlement summary**.
- `Mark as Settled` updates the database & notifies group members.
- Allows **manual payment recording**.
- Stores **settlement history** for future reference.

---

## **Database Schema**

### Tables

#### Users
```
Table users {
  id integer [primary key]
  name varchar
  email varchar [unique, not null]
  created_at timestamp
}
```

#### Groups
```
Table groups {
  id integer [primary key]
  name varchar [not null]
  manager_id integer [not null]
  status varchar [not null, default: 'active']
  settled_at timestamp
  created_at timestamp
}
```

#### Group Members
```
Table group_members {
  id integer [primary key]
  group_id integer [not null]
  user_id integer [not null]
  joined_at timestamp
}
```

#### Expenses
```
Table expenses {
  id integer [primary key]
  group_id integer [not null]
  created_by integer [not null]
  name varchar [not null]
  amount decimal(10,2) [not null]
  paid_by integer [not null]
  notes text
  created_at timestamp
}
```

#### Expense Participants
```
Table expense_participants {
  id integer [primary key]
  expense_id integer [not null]
  user_id integer [not null]
  share decimal(10,2) [not null]
}
```

#### Expense Media
```
Table expense_media {
  id integer [primary key]
  expense_id integer [not null]
  media_url varchar [not null]
  media_type varchar [not null, default: 'image']
  uploaded_at timestamp
}
```

### Relationships

```
Ref: groups.manager_id > users.id
Ref: group_members.group_id > groups.id
Ref: group_members.user_id > users.id
Ref: expenses.group_id > groups.id
Ref: expenses.created_by > users.id
Ref: expenses.paid_by > users.id
Ref: expense_participants.expense_id > expenses.id
Ref: expense_participants.user_id > users.id
Ref: expense_media.expense_id > expenses.id
```

## 3. Tentative Plan
### Step-by-Step Implementation

#### **Week 1-2: Project Setup & Authentication**
- Initialize Next.js project & set up PostgreSQL with Prisma ORM.
- Implement Google OAuth authentication.
- Develop Home Page UI and API routes for user authentication.

#### **Week 3-4: Group Management**
- Implement Group Page UI with list of users & expenses.
- Develop Create Group and Join Group via Invitation Code features.

#### **Week 5-6: Expense Handling**
- Build Add Expense Form and expense list display.

#### **Week 7-8: Debt Simplification & Settlements**
- Implement algorithm for minimizing transactions.
- Create Settle button to finalize group balances.

#### **Week 9-10: Receipt Upload & Optimizations**
- Develop AWS S3 storage for receipts.
- Improve performance, error handling, and UI responsiveness.

#### **Week 11-12: Deployment & Finalization**
- Deploy on frontend & PostgreSQL.
- Final testing, bug fixes, and preparation of final report & video demo.

---
## 4. Team Responsibilities
Since this project is developed by **two partners**, the responsibilities are split as follows:

### **Partner 1: Frontend & UI Development**
- Develop and style the **Next.js frontend** using Tailwind CSS and shadcn/ui.
- Implement **user authentication** via NextAuth.js.
- Design and integrate the **expense tracking UI** with API calls.
- Ensure **responsive design** and UI improvements.

### **Partner 2: Backend & Database Development**
- Set up **PostgreSQL database** schema using Prisma ORM.
- Develop **Next.js API routes** for managing groups, expenses, and settlements.
- Implement the **debt minimization algorithm** for optimal transaction settlements.
- Integrate **AWS S3 for receipt storage** and implement secure file handling.

### **Joint Responsibilities**
- Testing, debugging, and performance optimizations.
- Reviewing each other’s code to ensure best practices.
- Writing project documentation and preparing the final report and demo.
