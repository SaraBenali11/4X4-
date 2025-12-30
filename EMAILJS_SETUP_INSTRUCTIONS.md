# EmailJS Template Setup Instructions

## 📧 How to Configure EmailJS for Order Confirmation Emails

### Step 1: Verify Your EmailJS Account
1. Go to https://dashboard.emailjs.com/
2. Log in to your account
3. Verify you have:
   - **Service ID**: `service_qvou8fu`
   - **Public Key (User ID)**: `TKvxcyNi9ZkOUPm03`
   - **Template ID**: `template_930wrjx` (or create a new one)

---

### Step 2: Configure Your Email Template

#### Option A: Update Existing Template (`template_930wrjx`)

1. Go to **Email Templates** → Find template with ID `template_930wrjx`
2. Click **Edit**

#### Option B: Create New Template

1. Go to **Email Templates** → **Create New Template**
2. Name it: "Order Confirmation"
3. Copy the Template ID (you'll need to update it in `orderService.js`)

---

### Step 3: Configure Template Settings

#### ⚠️ CRITICAL: Recipient Email Address

In the template editor, find the **"To Email Address"** field:

**MUST BE:**
```
{{to_email}}
```

**NOT:**
- Your own email address
- A hardcoded email
- `{{email}}` (wrong variable name)

This is the **#1 reason emails don't get sent to customers!**

---

### Step 4: Configure Email Content

Use these variables in your template:

**Subject:**
```
{{subject}}
```

**Email Body:**
```
Bonjour {{to_name}},

Merci pour votre commande !
Nous avons bien reçu votre commande et celle-ci est actuellement en cours de traitement.

Détails de la commande :
Date de la commande : {{order_date}}
Adresse de livraison : {{delivery_address}}
Mode de paiement : Paiement à la livraison
Articles commandés :
{{ordered_items}}

Total à payer : {{total_amount}}

Votre commande sera livrée dans les plus brefs délais.

Si vous avez des questions, n'hésitez pas à nous contacter à : sutratyco@gmail.com

Merci de votre confiance et de votre achat chez Sutraty Store !

Cordialement,
Sutraty Store
```

**Available Variables:**
- `{{to_name}}` - Customer full name
- `{{to_email}}` - Customer email (use in "To" field!)
- `{{subject}}` - Email subject
- `{{message}}` - Full formatted message
- `{{order_date}}` - Formatted order date
- `{{delivery_address}}` - Delivery address
- `{{ordered_items}}` - List of ordered items
- `{{total_amount}}` - Total price

---

### Step 5: Test Your Template

1. In EmailJS dashboard, click **Test** on your template
2. Fill in test values:
   - `to_email`: Your test email address
   - `to_name`: Test Name
   - `subject`: Test Subject
   - `message`: Test Message
3. Click **Send Test Email**
4. Check your inbox (and spam folder!)

---

### Step 6: Verify Service Connection

1. Go to **Email Services**
2. Find service `service_qvou8fu`
3. Verify it's connected to your email provider (Gmail, Outlook, etc.)
4. Check if there are any quota limits

---

### Step 7: Update Code (If Using New Template)

If you created a new template, update `orderService.js`:

```javascript
await emailjs.send(
  'service_qvou8fu',        // Your Service ID
  'YOUR_NEW_TEMPLATE_ID',   // Your new Template ID
  { /* ... */ },
  'TKvxcyNi9ZkOUPm03'       // Your Public Key
);
```

---

## 🔍 Troubleshooting

### Email Not Received?

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for email-related errors
   - Check for: `✅ EmailJS response:` or `❌ Error sending...`

2. **Check Spam Folder**
   - Emails might be marked as spam

3. **Verify Template Configuration**
   - "To Email Address" MUST be `{{to_email}}`
   - All variables must match exactly

4. **Check EmailJS Quota**
   - Free plan: 200 emails/month
   - Check usage in dashboard

5. **Verify Service Connection**
   - Service must be connected to email provider
   - Check for connection errors

### Common Errors

**Error: "Invalid email address"**
- Check that `orderData.email` is valid
- Must contain `@` symbol

**Error: "Template not found"**
- Verify Template ID is correct
- Check template exists in dashboard

**Error: "Service not found"**
- Verify Service ID is correct
- Check service is connected

---

## 📝 Quick Checklist

- [ ] Template "To Email Address" is `{{to_email}}`
- [ ] Template ID matches code (`template_930wrjx`)
- [ ] Service ID matches code (`service_qvou8fu`)
- [ ] Public Key matches code (`TKvxcyNi9ZkOUPm03`)
- [ ] Test email works in EmailJS dashboard
- [ ] Service is connected to email provider
- [ ] No quota exceeded
- [ ] Check browser console for errors

---

## 🎯 Expected Behavior

When an order is created:
1. Order is saved to database ✅
2. Email is sent to customer's email address ✅
3. Console shows: `✅ Order confirmation email sent successfully to: customer@email.com`
4. Customer receives email in their inbox ✅

If email fails:
- Order is still created (email failure doesn't block order)
- Console shows detailed error: `❌ Error sending confirmation email:`
- Check error details to fix the issue

