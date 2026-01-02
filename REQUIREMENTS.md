# Sutraty Project - Complete Requirements

Hello! We are 4X4- team, welcome to our project! this file lists everything you need to install and set up to run the Sutraty project successfully.

## System Requirements

### Operating System

- Windows 10 or later
- macOS 10.13 or later
- Linux (Ubuntu 18.04 or later)

### Required Software

- **Node.js** version 16.0.0 or higher (includes npm)

  - Download from: https://nodejs.org/
  - Verify installation: `node --version` and `npm --version`

- **Git** (optional, for version control)
  - Download from: https://git-scm.com/

## Node.js Packages - Admin Dashboard

Navigate to the `admin/` folder and install these packages:

```bash
cd admin
npm install
```

### Dependencies for Admin:

- `react` (19.2.0) - Core React library
- `react-dom` (19.2.0) - React rendering
- `react-router-dom` (7.9.6) - Page navigation
- `@supabase/supabase-js` (2.88.0) - Database connection
- `emailjs-com` (3.2.0) - Email sending
- `lucide-react` (0.555.0) - Icons
- `react-icons` (5.5.0) - Additional icons
- `react-colorful` (5.6.1) - Color picker component
- `bcryptjs` (3.0.3) - Password hashing
- `prop-types` (15.8.1) - Type checking

### Dev Dependencies for Admin:

- `react-scripts` (5.0.1) - Build tools
- `@testing-library/react` (16.3.0) - Testing utilities
- `@testing-library/jest-dom` (6.9.1) - Testing helpers
- `web-vitals` (2.1.4) - Performance metrics

## Node.js Packages - Customer Storefront

Navigate to the `normaluser/` folder and install these packages:

```bash
cd normaluser
npm install
```

### Dependencies for Normaluser:

- `react` (19.2.0) - Core React library
- `react-dom` (19.2.0) - React rendering
- `react-router-dom` (7.9.6) - Page navigation
- `@supabase/supabase-js` (2.89.0) - Database connection
- `emailjs-com` (3.2.0) - Email sending
- `lucide-react` (0.555.0) - Icons
- `react-icons` (5.5.0) - Additional icons
- `react-colorful` (5.6.1) - Color picker component
- `prop-types` (15.8.1) - Type checking

### Dev Dependencies for Normaluser:

- `react-scripts` (5.0.1) - Build tools
- `@testing-library/react` (16.3.0) - Testing utilities
- `@testing-library/jest-dom` (6.9.1) - Testing helpers
- `web-vitals` (2.1.4) - Performance metrics

## External Services Required

### 1. Supabase Account

Required for database storage and authentication.

**Setup Steps:**

1. Go to https://supabase.com/
2. Sign up for a free account
3. Create a new project
4. Get your project credentials:
   - Project URL
   - Anonymous Key
   - Service Role Key
5. Save these in your `.env.local` files

**Database Tables Needed:**

- products
- product_images
- product_sizes
- product_colors
- categories
- orders
- order_items
- admins

### 2. EmailJS Account

Required for sending order confirmations and contact form emails.

**Setup Steps:**

1. Go to https://www.emailjs.com/
2. Create a free account
3. Set up email service (Gmail, Outlook, etc.)
4. Create email templates
5. Get your credentials:
   - Service ID
   - Template ID
   - Public Key
6. Save these in your application configuration

**Templates Needed:**

- Order confirmation template
- Contact form template
- Order rejection template

## Environment Configuration Files

### Admin Application

Create file: `admin/.env.local`

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
REACT_APP_EMAILJS_SERVICE_ID=service_j0tmr7g
REACT_APP_EMAILJS_TEMPLATE_ID=template_pywan6o
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### Customer Application

Create file: `normaluser/.env.local`

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
REACT_APP_EMAILJS_SERVICE_ID=service_j0tmr7g
REACT_APP_EMAILJS_TEMPLATE_ID=template_pywan6o
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

## Browser Requirements

### Supported Browsers

- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Safari (latest version)
- Edge (latest version)

### Minimum Requirements

- JavaScript enabled
- Cookies enabled
- localStorage support

## Development Tools (Optional but Recommended)

### Code Editor

- **Visual Studio Code** (https://code.visualstudio.com/)
  - Recommended Extensions:
    - ES7+ React/Redux/React-Native snippets
    - Prettier - Code formatter
    - ESLint
    - Thunder Client (for API testing)

### Browser Extensions

- React Developer Tools (Chrome/Firefox)
- Redux DevTools (optional, for state management debugging)

## Installation Checklist

Follow this order to set up the project:

### Step 1: System Setup

- [ ] Install Node.js (includes npm)
- [ ] Verify installation: `node --version` and `npm --version`

### Step 2: Supabase Setup

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Set up database tables
- [ ] Get project credentials
- [ ] Note down URL and API key

### Step 3: EmailJS Setup

- [ ] Create EmailJS account
- [ ] Connect email service (Gmail/Outlook)
- [ ] Create email templates
- [ ] Get service ID, template ID, and public key

### Step 4: Admin Application

- [ ] Navigate to `admin/` folder
- [ ] Run `npm install`
- [ ] Create `.env.local` file with Supabase and EmailJS credentials
- [ ] Run `npm start`

### Step 5: Customer Application

- [ ] Navigate to `normaluser/` folder
- [ ] Run `npm install`
- [ ] Create `.env.local` file with Supabase and EmailJS credentials
- [ ] Run `npm start` (use different port if 3000 is busy)

### Step 6: Verification

- [ ] Admin dashboard loads and login works
- [ ] Customer store loads and products display
- [ ] Can add items to cart
- [ ] Can place order and receive email
- [ ] Can submit contact form

## Troubleshooting

### npm install fails

- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` again

### Port 3000 already in use

- Change port: `PORT=3001 npm start`
- Or find and kill process using port 3000

### Supabase connection fails

- Verify credentials in `.env.local`
- Check Supabase project is active
- Ensure tables are created in database

### EmailJS not sending emails

- Verify service ID and template ID
- Check public key is correct
- Ensure email template variables match code
- Check EmailJS quota hasn't been exceeded

### React errors about missing modules

- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## Disk Space Requirements

- Node.js installation: ~200 MB
- Admin node_modules: ~400 MB
- Customer node_modules: ~400 MB
- Project source code: ~50 MB
- Total: ~1 GB recommended

## Internet Connection

- Required for: npm package downloads
- Required for: Supabase database access
- Required for: EmailJS email delivery
- Recommended: Broadband (at least 5 Mbps)

## Summary

To get Sutraty running, you need:

1. Node.js 16+ installed
2. Supabase account with configured database
3. EmailJS account with email service connected
4. All npm packages installed in both folders
5. Environment variables configured
6. Modern web browser

Once all requirements are met, both applications can run simultaneously inshallah on your development machine.
