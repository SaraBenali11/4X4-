# 🔧 EmailJS Troubleshooting Guide - Order Confirmation Emails

## ⚠️ CRITICAL: Most Common Issue

**The email template is sending to the WRONG email address!**

### The Problem:
Your EmailJS template `template_930wrjx` is likely configured to send emails to:
- ❌ A fixed email address (like `sutratyco@gmail.com`)
- ❌ Your own email address
- ❌ The `from_email` field

Instead of:
- ✅ The customer's email address (`{{to_email}}`)

---

## 🎯 SOLUTION: Fix Your EmailJS Template

### Step 1: Go to EmailJS Dashboard
1. Visit: https://dashboard.emailjs.com/
2. Log in
3. Go to **Email Templates**
4. Find template: `template_930wrjx`
5. Click **Edit**

### Step 2: Fix the "To Email Address" Field

**In the template editor, find the section "To Email Address" or "Recipient Email":**

**❌ WRONG (Current - sends to store):**
```
sutratyco@gmail.com
```
or
```
{{from_email}}
```

**✅ CORRECT (Sends to customer):**
```
{{to_email}}
```

**OR if your template uses a different variable name:**
```
{{email}}
```
or
```
{{customer_email}}
```

**⚠️ IMPORTANT:** The variable name MUST match what you're sending in the code!

---

## 🔍 How to Check What Variable Name to Use

### Option 1: Check Browser Console
1. Open Developer Tools (F12)
2. Go to Console tab
3. Submit an order
4. Look for: `📧 Email parameters:` 
5. See what variables are being sent

### Option 2: Check Your Code
In `orderService.js`, look at the `emailParams` object:
```javascript
const emailParams = {
  to_email: orderData.email,  // ← This variable name
  email: orderData.email,     // ← Or this one
  // ... other variables
};
```

**Use the SAME variable name in your EmailJS template!**

---

## 🧪 Test Your Template

### In EmailJS Dashboard:
1. Click **Test** button on your template
2. Fill in test values:
   - `to_email`: **YOUR TEST EMAIL** (not the store's email!)
   - `to_name`: Test Name
   - `subject`: Test Subject
   - `message`: Test Message
3. Click **Send Test Email**
4. **Check YOUR inbox** (not the store's inbox!)

**If you receive the test email → Template is working!**
**If you DON'T receive it → Template "To" field is wrong!**

---

## 📋 Complete Checklist

- [ ] Template "To Email Address" is `{{to_email}}` (or matching variable)
- [ ] Test email in EmailJS dashboard works
- [ ] Test email goes to YOUR test address (not store's address)
- [ ] Browser console shows: `✅ Email sent successfully!`
- [ ] Browser console shows: `✅ EmailJS response: {status: 200}`
- [ ] Check spam folder
- [ ] Verify EmailJS quota not exceeded (200/month free)

---

## 🐛 Debug Steps

### 1. Check Browser Console
After submitting an order, look for:
```
📧 Attempting to send email to: customer@example.com
📧 Email parameters: { to_email: "customer@example.com", ... }
✅ EmailJS response: { status: 200, text: "OK" }
✅ Email sent successfully!
```

**If you see errors:**
```
❌ Error sending confirmation email: { error: ..., message: "..." }
```

**Copy the error message and check:**
- Template ID is correct
- Service ID is correct
- Public Key is correct
- Template exists in dashboard

### 2. Check EmailJS Dashboard
1. Go to **Activity** or **Logs**
2. See if emails are being sent
3. Check destination email addresses
4. If emails show your store's email → Template is wrong!

### 3. Verify Service Connection
1. Go to **Email Services**
2. Check service `service_qvou8fu`
3. Verify it's connected
4. Check for connection errors

---

## 🔄 Alternative: Create New Template

If fixing the existing template doesn't work:

1. **Create New Template:**
   - Name: "Order Confirmation"
   - Copy the Template ID

2. **Configure:**
   - **To Email Address:** `{{to_email}}`
   - **Subject:** `{{subject}}`
   - **Body:** Use variables from code

3. **Update Code:**
   In `orderService.js`, change:
   ```javascript
   'template_930wrjx'  // Old template ID
   ```
   to:
   ```javascript
   'YOUR_NEW_TEMPLATE_ID'  // New template ID
   ```

---

## 📞 Still Not Working?

### Check These:
1. **EmailJS Quota:** Free plan = 200 emails/month
2. **Service Status:** Service must be "Connected" (green)
3. **Template Variables:** Must match exactly (case-sensitive)
4. **Email Provider:** Gmail/Outlook might block emails
5. **Spam Folder:** Always check spam!

### Get Help:
- EmailJS Documentation: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
- Check EmailJS Status: https://status.emailjs.com/

---

## ✅ Expected Behavior

**When working correctly:**
1. Order is created ✅
2. Console shows: `✅ Email sent successfully!`
3. Customer receives email at their address ✅
4. Email contains order details ✅

**If email fails:**
- Order is still created (email failure doesn't block order)
- Console shows detailed error
- Check error message to fix the issue

