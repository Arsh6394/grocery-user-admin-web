# Firebase Setup Guide for FreshMart Grocery App

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `freshmart-grocery`
4. Accept terms and click "Create Project"
5. Wait for project creation to complete

## Step 2: Setup Authentication

1. Go to **Authentication** section
2. Click "Get Started"
3. Enable these sign-in methods:
   - **Email/Password**: Click → Enable
   - **Google**: Click → Enable (select your Gmail account as support email)
4. Under "Authorized domains" → Add `localhost` (for testing)

## Step 3: Create Firestore Database

1. Go to **Firestore Database** section
2. Click "Create database"
3. Select **Start in test mode** (for development)
4. Choose region: **asia-southeast1** (nearest to India)
5. Click "Enable"

## Step 4: Set Up Collections in Firestore

Create these collections:

### Collection: `users`
```
- uid (document ID)
  - email
  - name
  - phone
  - address
  - photoURL
  - createdAt (timestamp)
  - cart (array)
  - orders (array)
  - favorites (array)
```

### Collection: `products`
```
- productId (document ID)
  - name
  - category
  - price
  - originalPrice
  - discount
  - image
  - description
  - stock
  - rating
  - reviews
  - createdAt (timestamp)
```

### Collection: `orders`
```
- orderId (document ID)
  - userId
  - items (array)
  - total
  - status (confirmed, processing, shipped, delivered)
  - paymentMethod
  - createdAt (timestamp)
  - estimatedDelivery
  - shippingAddress
  - trackingUpdates (array)
```

## Step 5: Get Firebase Config

1. Click gear icon ⚙️ → Project Settings
2. Scroll down to "Your apps"
3. Click "Firebase SDK snippet" → "Config"
4. Copy the config object
5. Replace the values in `js/firebase-config.js`:
   - `YOUR_API_KEY` → apiKey
   - `YOUR_PROJECT` → projectId (also for authDomain and storageBucket)
   - `YOUR_PROJECT_ID` → projectId
   - `YOUR_MESSAGING_SENDER_ID` → messagingSenderId
   - `YOUR_APP_ID` → appId

## Step 6: Add Firebase to HTML

The HTML file should include:
```html
<!-- Firebase SDK (must be added to grocery.html) -->
<script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-firestore.js"></script>

<!-- Firebase Config -->
<script src="js/firebase-config.js"></script>
```

## Step 7: Firestore Security Rules

Go to **Firestore** → **Rules** and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Anyone can read products
    match /products/{document=**} {
      allow read: if true;
    }
    
    // Users can read their own orders
    match /orders/{orderId} {
      allow read: if resource.data.userId == request.auth.uid;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Step 8: Add Sample Products (Optional)

You can add sample products to Firestore via console or API. Example:
```
{
  "name": "Fresh Tomatoes",
  "category": "vegetables",
  "price": 45,
  "originalPrice": 60,
  "discount": 25,
  "image": "assets/images/tomato.jpg",
  "description": "Fresh, juicy tomatoes",
  "stock": 100,
  "rating": 4.5
}
```

## Features Now Available

✅ User Registration (Email & Gmail)
✅ User Login/Logout
✅ Shopping Cart (persistent in Firestore)
✅ Order Placement
✅ Order Tracking
✅ User Profile Management
✅ Product Search
✅ Order History

## Testing Locally

To test on localhost:
```bash
npm start
# or
python -m http.server 8000
```

Then visit: `http://localhost:8000/grocery.html`

## Production Deployment

Before deploying:
1. Update Firestore security rules (use proper authentication)
2. Add your domain to "Authorized domains" in Authentication
3. Set up HTTPS
4. Remove test mode from Firestore
5. Enable backups in Firestore settings

## Troubleshooting

**Issue: "Cross-Origin Request Blocked"**
- Solution: This is normal in development. Firebase handles CORS.

**Issue: "Firebase is not defined"**
- Solution: Make sure Firebase SDK is loaded BEFORE firebase-config.js

**Issue: "Cannot find module"**
- Solution: Make sure all JS files are in the correct path

**Issue: Emails not sending for password reset**
- Solution: Configure email templates in Firebase Console → Authentication → Templates
