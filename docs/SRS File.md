# Software Requirements Specification (SRS)
## Project: Sutraty – Online Boutique Platform
### Version 1.0

---

## 1. Introduction

### 1.1 Purpose
The purpose of this SRS is to describe the functional and non-functional requirements of **Sutraty**, an online boutique platform where business owners can display and manage items, and customers can browse, filter, and purchase items.

This document is intended for:
- Product owners  
- Developers  
- Testers  
- UI/UX designers  

### 1.2 Scope
**Sutraty** provides:
- An attractive landing page to attract visitors  
- A customer interface for browsing, filtering, and purchasing items  
- A business owner dashboard for managing inventory and transactions  
- Management of returned items and completed sales  
- Clear and categorized navigation for both business owners and clients  

The system consists of:
- A Frontend web application  
- A Backend API  
- A database for items, users, and transactions  

---

## 2. Overall Description

### 2.1 Product Perspective
**Sutraty** is a standalone ecommerce platform tailored for small business owners.

It contains two main environments:
1. **Public User Interface** (for customers)  
2. **Business Owner Dashboard** (admin-level interface for shop owners)

### 2.2 User Classes

| User Type        | Description                                                |
|------------------|------------------------------------------------------------|
| Client/Customer  | Browses items, filters results, views details, purchases items |
| Business Owner   | Manages items, prices, returned products, transactions     |
| System Admin     | Handles platform maintenance *(optional)*                  |

### 2.3 System Environment
- Web browser interface  
- Database storage (SQL)  
- Secure backend server  

---

## 3. Functional Requirements

### 3.1 Client Requirements

#### **FR-1 Viewing Items**
**User Story:** “As a client of Sutraty, I want to see all available items.”

- The system shall display all active items on the platform.  
- Items shall include basic information (name, image, price).  

#### **FR-2 Filtering Items**
**User Story:** “As a client of Sutraty, I want to filter through available items.”

- The system shall provide filtering options (category, price).  
- The system shall update results dynamically based on filters.  

#### **FR-3 Viewing Item Information**
**User Story:** “As a client, I want to know all the needed information about items (size, colors, etc.).”

- The system shall show detailed item information, including:  
  - Sizes  
  - Colors  
  - Photos  
  - Price  
  - Availability  

#### **FR-4 Purchasing Items**
**User Story:** “As a customer, I want to buy the items that I like.”

- The system shall allow users to add items to a shopping cart.  
- The system shall process purchases through a checkout flow.  
- The system shall generate confirmation for the purchase.  

---

### 3.2 Business Owner Requirements

#### **FR-5 Landing Page Appeal**
**User Story:** “As a business owner, I want to have a catching landing page.”

- The system shall provide a visually appealing landing page layout.  
- The design shall highlight featured items or promotions.  

#### **FR-6 Dashboard Management**
**User Story:** “As a business owner, I want to have a dashboard where I can manage my added and removed items.”

- The system shall provide a secure dashboard for business owners.  
- The dashboard shall show item lists and allow editing/deleting items.  

#### **FR-7 Add New Items**
**User Story:** “As a business owner, I want to add new items to sell.”

- The system shall allow owners to upload new items with details:  
  - Photos  
  - Description  
  - Size  
  - Color  
  - Price  
  - Quantity  

#### **FR-8 Navigation Structure**
**User Story:** “As a business owner, I want to have a header which makes navigation clear as well as categorized navigation.”

- The system shall include a responsive header with categories and dashboard shortcuts.  
- The system shall separate client navigation from business-owner navigation.  

#### **FR-9 Manage Returned Items**
**User Story:** “As a business owner, I want to manage the returned items.”

- The system shall track returned items.  
- The dashboard shall allow marking items as returned and updating stock.  

#### **FR-10 Manage Purchased Items**
**User Story:** “As a business owner, I want to manage bought items.”

- The dashboard shall display a list of purchased orders.  
- Owners shall be able to update order status (Processing, Shipped, Delivered).  

#### **FR-11 Store Transactions**
**User Story:** “As a business owner, I want to store my transactions.”

- The system shall maintain a transaction history for each purchase.  
- The system shall allow exporting or filtering transaction records.  

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- Item list must load in less than **2 seconds**.  
- Filtering results must appear in less than **1 second**.  
- Dashboard pages must load in less than **3 seconds**.  

### 4.2 Security Requirements
- Business owners must authenticate before accessing the dashboard.  
- Passwords must be encrypted.  
- Checkout must use HTTPS encryption.  
- System must enforce roles (client vs business owner).  

### 4.3 Usability Requirements
- Clean and intuitive UI.  
- Mobile-responsive design.  
- Clear category navigation.  

### 4.4 Reliability Requirements
- The system should have **99% uptime**.  
- Transactions must not be lost in case of network interruption.  

---

## 5. System Models

### 5.1 Use Case Diagram
![Use Case Diagram](docs/use_case_diagram.png)

---

## 6. Acceptance Criteria
- Clients can browse all items and filter them successfully.  
- Each item displays complete information.  
- Business owners can add/remove/update items from the dashboard.  
- Purchases appear instantly in the business owner dashboard.  
- Returned items can be tracked and updated.  
- Transactions are stored correctly and accessible.  

