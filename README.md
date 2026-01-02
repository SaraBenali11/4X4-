# Sutraty - Online Boutique Platform

## Overview

Sutraty is a modern e-commerce platform built for a women's clothing boutique. The system allows business owners to manage their inventory and customers to browse and purchase items online. It's built as two separate React applications connected through Supabase, with email notifications powered by EmailJS.

---

## What Does This Project Do?

This is a complete online shopping system with two sides: one for customers buying clothes and another for the business owner managing everything.

### For Customers

When you visit the store, you can:

- Browse all available clothing items with images and descriptions
- Filter products by category or price range
- Sort results by newest items, price, or alphabetically
- View detailed information about each item (sizes, colors, availability)
- Add items to your shopping cart with your preferred size and color
- Fill out an order form with your delivery address
- Get an email confirming your order

There's also a contact form if customers want to send a message directly to the store.

### For the Business Owner

The admin dashboard lets you:

- Log in securely to manage your business
- See all orders from customers in real-time
- Change order statuses as you process them (pending, in progress, or returned)
- Filter and organize orders by their current status
- Accept or reject orders from the dashboard
- Manage your product catalog (add new items, edit prices, update descriptions)
- Edit product details like available sizes and colors
- View your profile and change your password
- See statistics about orders and shipping

---

## How It's Built

The project uses a modern tech stack split into two main applications:

### Customer Application (`normaluser/` folder)

Built with React 19.2.0, this is what customers see when they visit the store. It includes:

- Product browsing and filtering
- Shopping cart functionality
- Order checkout form
- Contact form for customer inquiries
- Nice responsive design that works on phones and computers

### Admin Application (`admin/` folder)

Also built with React 19.2.0, this is the private dashboard for business owners. It provides:

- Secure login system
- Order management interface
- Product CRUD operations
- Admin profile and settings
- Password management

### Database and Services

Both applications connect to a Supabase database that stores:

- All product information
- Customer orders and order details
- Admin user accounts
- Product categories, sizes, and colors

Email notifications are sent through EmailJS, which handles:

- Order confirmations to customers
- Contact form submissions to the store
- Order rejection notifications

---

## Key Features

### Customer Side

- Browse products with full details and images
- Filter by category and price
- Add items to cart with size/color selection
- Place orders with validation
- Receive order confirmation emails
- Send contact messages to the store
- See newest arrivals on the homepage
- Mobile-friendly responsive design

### Admin Side

- Secure admin login with password authentication
- View all customer orders in real-time
- Update order status (Pending → In Progress → Returned)
- Filter orders by status
- Accept or reject pending orders
- Delete orders and notify customers
- Full product management (add, edit, delete)
- Edit product attributes (sizes, colors, prices)
- Change admin password with validation
- View profile information and account statistics

### Email System

- Automatic order confirmation emails to customers
- Contact form submissions routed to the store
- Order rejection notifications when orders are deleted
- Customizable email templates
- Error tracking for email delivery issues

---

## Project Structure

```
4X4-/
├── admin/                          # Admin dashboard application
│   └── src/frontend/
│       ├── views/                  # Pages and layouts
│       ├── components/             # Reusable React components
│       ├── services/               # API calls to Supabase
│       ├── context/                # Authentication state
│       └── styles/                 # CSS styling
│
├── normaluser/                     # Customer storefront
│   └── src/frontend/
│       ├── views/                  # Product pages, checkout, etc.
│       ├── components/             # Header, footer, product cards
│       ├── services/               # Product and order services
│       ├── config/                 # Settings and configuration
│       ├── context/                # Shopping cart state
│       └── styles/                 # CSS styling
│
└── documentation/                  # Architecture and setup guides

We used a modules folder for reusable functionalities or the ones we can improve in the future inshallah

```

---

## Technology Used

### Frontend

- React 19.2.0 - User interface library
- React Router - Navigation between pages
- Lucide React - Icons for the UI
- React Icons - Additional icon set

### Backend & Database

- Supabase - Cloud database and authentication
- PostgreSQL - Relational database system

### Email Service

- EmailJS - Sends transactional emails

### Development Tools

- npm - Package manager
- React Scripts - Build and development tools
- Prettier & ESLint - Code formatting and linting

---

## How Data Flows

### When a Customer Browses Products

The React app fetches all products from Supabase and displays them. When you filter or sort, the app updates what's shown without needing to refresh.

### When a Customer Places an Order

The order form collects customer details, validates the information, then sends it to Supabase. Once saved, an order confirmation email is automatically sent to the customer through EmailJS.

### When an Admin Changes Order Status

The admin clicks on an order's status badge, selects a new status, and the system updates the database. The order immediately reorganizes itself into the correct status section on the dashboard.

### Contact Form Submissions

When a customer sends a message through the contact form, it gets emailed directly to the store's email address using the same EmailJS service.

---

## Database Tables

The Supabase database includes these main tables:

- **products** - All clothing items with name, price, category, images
- **product_images** - Image URLs for each product
- **product_sizes** - Available sizes for each product
- **product_colors** - Available colors for each product
- **categories** - Product categories (dresses, shirts, etc.)
- **orders** - Customer orders with shipping address and status
- **order_items** - Individual items within each order
- **admins** - Admin user accounts with encrypted passwords

---

## Getting Started

### Running the Customer Store

```bash
cd normaluser
npm install
npm start
```

The store will open at http://localhost:3000

### Running the Admin Dashboard

```bash
cd admin
npm install
npm start
```

The admin panel will open at http://localhost:3000 (or a different port if 3000 is busy)

### Requirements

- Node.js installed on your computer
- Supabase account with the database configured
- EmailJS account with service and template IDs set up

---

## Security

- Admin accounts require email and password authentication
- Passwords are hashed using bcryptjs before storage
- Admin sessions are managed securely
- EmailJS credentials are safely configured
- Form inputs are validated on both frontend and backend

---

## Design

The interface uses a warm color palette with rose and brown tones to match the boutique aesthetic. The typography combines elegant serif fonts for headings with clean sans-serif fonts for body text. The design is fully responsive and works smoothly on phones, tablets, and desktop computers.

---

## What's Next?

Future improvements could include:

- Payment processing integration (Stripe, PayPal)
- Customer accounts and order history
- Product reviews and ratings
- Wishlist functionality
- Inventory management with low-stock alerts
- Analytics and sales reporting
- SMS notifications for orders
- Multi-language support

---

## Support

If you have questions or run into issues, check the documentation folder for setup guides and architecture details. The code is well-commented throughout both applications.
