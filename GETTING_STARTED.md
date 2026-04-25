# 🛍️ FreshMart Grocery App - Complete Firebase Integration

## What's Been Created

Your FreshMart grocery app now has complete Firebase integration with the following features:

### ✅ Authentication System
- **Email/Password signup & login** - Users can create accounts with email verification
- **Gmail login** - One-click Google sign-in
- **Password reset** - Users can reset forgotten passwords via email

### ✅ Database (Firestore)
- **User profiles** - Store names, emails, phones, addresses
- **Shopping cart** - Persistent cart stored in Firestore
- **Orders** - Complete order history with details
- **Product data** - Ready for product listings

### ✅ User Features
- **User Dashboard** - View profile, edit details
- **Order History** - See all past orders with status
- **Order Tracking** - Real-time order status updates
- **Shopping Cart** - Add/remove items, manage quantities
- **Checkout** - Multiple payment methods support

### ✅ Firestore Collections Ready
```
/users/{uid}
  - email, name, phone, address
  - cart[], orders[], favorites[]
  - createdAt, photoURL

/orders/{orderId}
  - userId, items[], total, status
  - paymentMethod, trackingUpdates[]
  - estimatedDelivery, shippingAddress

/products/{productId}
  - name, category, price, discount
  - image, stock, rating, reviews
```

---

## 📋 Project Files

### New Files Created
- `js/firebase-config.js` - Firebase setup & functions
- `auth.html` - Login/signup page with Gmail
- `profile.html` - User profile page
- `orders.html` - Order history page
- `cart.html` - Shopping cart page
- `tracking.html` - Order tracking page
- `FIREBASE_SETUP.md` - Detailed setup guide

### Updated Files
- `grocery.html` - Added Firebase SDK & auth UI
- `package.json` - Added Firebase dependency

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get Firebase Credentials
1. Go to https://console.firebase.google.com/
2. Create a new project named "freshmart-grocery"
3. Go to Settings (gear icon) → Project Settings
4. Copy the Firebase config object

### Step 2: Update Config File
Replace values in `js/firebase-config.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // Copy from Firebase
  authDomain: "YOUR_PROJECT.firebaseapp.com", // Copy from Firebase
  projectId: "YOUR_PROJECT_ID",              // Copy from Firebase
  storageBucket: "YOUR_PROJECT.appspot.com", // Copy from Firebase
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Copy from Firebase
  appId: "YOUR_APP_ID"                       // Copy from Firebase
};
```

### Step 3: Enable Firebase Services
1. Go to **Authentication** → Enable Email/Password & Google
2. Go to **Firestore** → Create Database (test mode)
3. Go to **Firestore** → Replace Rules with security rules (see FIREBASE_SETUP.md)

That's it! You're ready to go! 🎉

---

## 📱 How to Use

### For Users
1. Visit `auth.html` → Sign up with email or Gmail
2. Browse products on `grocery.html`
3. Add items to cart → Go to `cart.html`
4. Checkout with payment method preference
5. Track order on `tracking.html`
6. View profile & order history at `profile.html` and `orders.html`

### For Developers

#### Add to Cart
```javascript
await addToCartFirebase(productId, productName, price, qty);
```

#### Place Order
```javascript
await placeOrderFirebase(paymentMethod); // paymentMethod: 'online' | 'cod' | 'wallet'
```

#### Get User Data
```javascript
const userData = currentUserData; // Current logged-in user's data
const orders = await getUserOrders(); // All user's orders
const cart = await getUserCart(); // Current cart items
```

#### Update Profile
```javascript
await updateUserProfile(name, phone, address);
```

#### Search Products
```javascript
const results = await searchProducts(query);
```

---

## 🔐 Security

### Firestore Security Rules (Auto-configured)
```
- Users can only read/write their own data
- Everyone can read products
- Users can only read their own orders
- Login required for cart & checkout
```

### Best Practices
- ✅ Never expose API keys (use environment variables in production)
- ✅ Enable 2FA for Firebase account
- ✅ Set up email verification for signups
- ✅ Use strong security rules in production (not test mode)

---

## 💳 Payment Integration (Ready to Integrate)

The app supports these payment methods. To activate:

1. **Online (Card/UPI)**
   - Integrate: Razorpay, Stripe, or PayU
   - Update `placeOrderFirebase()` function

2. **Cash on Delivery (COD)**
   - Currently auto-approved in demo
   - Add merchant verification in production

3. **Wallet**
   - Create `wallets` collection in Firestore
   - Add wallet balance tracking

---

## 📊 Data Flow

```
User → auth.html (Login/Signup)
    ↓
grocery.html (Browse products)
    ↓
cart.html (Add items to cart)
    ↓
Checkout (Create order in Firestore)
    ↓
tracking.html (Real-time order updates)
    ↓
orders.html (View order history)
```

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add Product Search** - Already coded in firebase-config.js
2. **Email Notifications** - Send order confirmation emails
3. **Reviews & Ratings** - Add product reviews
4. **Promotions** - Create coupon system
5. **Analytics** - Track user behavior
6. **Push Notifications** - Notify order updates
7. **Admin Dashboard** - Manage products & orders

---

## ⚠️ Common Issues & Solutions

### "Firebase is not defined"
- Make sure Firebase SDK is loaded BEFORE firebase-config.js
- Check internet connection
- Clear browser cache

### "Cross-Origin Request Blocked"
- Normal in development, Firebase handles it
- Not an issue for production

### "Cannot read property 'uid' of null"
- User not authenticated, redirect to login
- Check `if (currentUser)` before operations

### "Firestore permission denied"
- Update security rules in Firebase Console
- Check user is logged in
- Verify user ID matches expected field

### "Products not showing in search"
- Add products to `products` collection first
- Check collection name is exactly "products"
- Verify product document structure

---

## 🌐 Deployment

### Testing Locally
```bash
npm start
# or
python -m http.server 8000
```

Visit: `http://localhost:8000/auth.html`

### Deploy to Firebase Hosting (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Deploy to Other Platforms
- Netlify: Connect GitHub repo
- Vercel: Connect GitHub repo
- GitHub Pages: Push to gh-pages branch

---

## 📞 Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Guide**: https://firebase.google.com/docs/firestore
- **Auth Docs**: https://firebase.google.com/docs/auth
- **JavaScript SDK**: https://firebase.google.com/docs/web/setup

---

## 📄 File Structure

```
grocery/
├── js/
│   ├── firebase-config.js       ← All Firebase functions
│   ├── main.js                  ← App logic
├── css/
│   ├── global.css
│   ├── variables.css
├── auth.html                    ← Login & signup
├── grocery.html                 ← Main store page
├── profile.html                 ← User profile
├── orders.html                  ← Order history
├── cart.html                    ← Shopping cart
├── tracking.html                ← Order tracking
├── FIREBASE_SETUP.md            ← Detailed setup
├── GETTING_STARTED.md           ← This file
└── package.json                 ← Dependencies
```

---

## 🎓 Learning Resources

- Learn Firebase: https://www.youtube.com/results?search_query=firebase+tutorial
- Firestore Best Practices: https://firebase.google.com/docs/firestore/best-practices
- Authentication Guide: https://firebase.google.com/docs/auth/web/start

---

**Created with ❤️ for FreshMart Grocery**

Happy coding! 🚀
