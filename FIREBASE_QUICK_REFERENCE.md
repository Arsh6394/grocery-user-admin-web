# FreshMart Firebase Integration - Developer Reference

## Core Firebase Functions

### Authentication
```javascript
// Sign up with email
await signUpUser(email, password, name);

// Sign in with email
await signInUser(email, password);

// Sign in with Google
await signInWithGoogle();

// Logout
await logoutUser();
```

### Cart Management
```javascript
// Add item to cart
await addToCartFirebase(productId, productName, price, qty);

// Get user's cart
const cart = await getUserCart();

// Remove from cart
await removeFromCart(productId);

// Update quantity
await updateCartQty(productId, newQty);

// Update cart UI
await updateCartUI();
```

### Orders
```javascript
// Place order
await placeOrderFirebase(paymentMethod);
// paymentMethod: 'online' | 'cod' | 'wallet'

// Get user's orders
const orders = await getUserOrders();

// Load order tracking
await loadOrderTracking(orderId);
```

### User Profile
```javascript
// Update user profile
await updateUserProfile(name, phone, address);

// Current user object
currentUser; // Firebase user object
currentUserData; // User data from Firestore
```

### Products & Search
```javascript
// Search products
const results = await searchProducts(query);
// Returns array of matching products
```

---

## Global Variables

```javascript
// Currently logged-in user (Firebase Auth)
currentUser

// Current user's data from Firestore
currentUserData

// Firestore database instance
db

// Firebase authentication instance
auth

// Google auth provider
googleProvider
```

---

## Using in HTML

### Show auth buttons
```html
<!-- Will be populated by Firebase config -->
<div id="authContainer"></div>

<!-- Cart badge -->
<span id="cartBadge"></span>
```

### Toast notifications
```javascript
showToast('Your message here');
// Examples:
showToast('✓ Success!');
showToast('❌ Error occurred');
showToast('🛒 Added to cart!');
```

### Page navigation
```javascript
showPage('home');     // Show home page
showPage('cart');     // Show cart page
showPage('profile');  // Show profile page
showPage('orders');   // Show orders page
showPage('login');    // Show login page
```

---

## Firestore Document Examples

### User Document
```javascript
{
  uid: "abc123",
  email: "user@email.com",
  name: "John Doe",
  phone: "+91-98765-43210",
  address: "123 Main St, Lucknow",
  photoURL: "",
  createdAt: Timestamp,
  cart: [
    { productId: "prod1", productName: "Tomato", price: 45, qty: 2 }
  ],
  orders: ["ORD-1234567890"],
  favorites: ["prod1", "prod2"]
}
```

### Order Document
```javascript
{
  orderId: "ORD-1234567890",
  userId: "abc123",
  items: [
    { productId: "prod1", productName: "Tomato", price: 45, qty: 2 }
  ],
  total: 590,
  status: "processing",
  paymentMethod: "online",
  createdAt: Timestamp,
  estimatedDelivery: Timestamp,
  shippingAddress: "123 Main St",
  trackingUpdates: [
    {
      status: "Order Confirmed",
      timestamp: Timestamp,
      message: "Order confirmed"
    }
  ]
}
```

### Product Document
```javascript
{
  productId: "prod1",
  name: "Fresh Tomatoes",
  category: "vegetables",
  price: 45,
  originalPrice: 60,
  discount: 25,
  image: "assets/images/tomato.jpg",
  description: "Fresh juicy tomatoes",
  stock: 100,
  rating: 4.5,
  reviews: []
}
```

---

## Event Listeners

### Auth State Change
```javascript
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is logged in
    console.log("User:", user.email);
  } else {
    // User is logged out
    console.log("User logged out");
  }
});
```

---

## Testing Firebase Functions

### In Browser Console
```javascript
// Test sign up
await signUpUser('test@example.com', 'password123', 'Test User');

// Test sign in
await signInUser('test@example.com', 'password123');

// Test add to cart
await addToCartFirebase('prod1', 'Tomato', 45, 2);

// Get user data
console.log(currentUserData);

// Get orders
const orders = await getUserOrders();
console.log(orders);
```

---

## Setting Up New Pages

### Template for New Page
```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root { --green: #2d8c4e; --text: #1a1a1a; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Nunito', sans-serif; }
  </style>
</head>
<body>
  <div id="content"></div>

  <!-- Firebase -->
  <script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebaseapp/8.6.0/firebase-firestore.js"></script>
  <script src="js/firebase-config.js"></script>

  <script>
    // Your code here
    console.log("Current user:", currentUser);
  </script>
</body>
</html>
```

---

## URL Parameters for Tracking

### Direct order tracking
```
tracking.html?orderId=ORD-1234567890
```

### In JavaScript
```javascript
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
await loadOrderTracking(orderId);
```

---

## Common Patterns

### Check if user is logged in
```javascript
if (!currentUser) {
  window.location = 'auth.html';
  return;
}
```

### Show loading state
```javascript
const loader = document.getElementById('loader');
loader.style.display = 'block';
// Do async work
loader.style.display = 'none';
```

### Handle errors
```javascript
try {
  await someFirebaseFunction();
} catch (error) {
  console.error('Error:', error);
  showToast('❌ ' + error.message);
}
```

### Redirect after operation
```javascript
setTimeout(() => {
  window.location = 'checkout.html';
}, 500);
```

---

## Performance Tips

1. **Cache user data** - Use `currentUserData` instead of fetching repeatedly
2. **Batch Firestore reads** - Get all needed data in one query
3. **Lazy load products** - Load on scroll or pagination
4. **Index frequently searched fields** - For better query performance
5. **Use compound indexes** - For complex queries

---

## Debugging

### Enable Firebase logs
```javascript
firebase.database.enableLogging(true);
```

### Console logs
```javascript
console.log('Current user:', currentUser);
console.log('User data:', currentUserData);
console.log('Cart:', await getUserCart());
```

### Check Firestore in Console
1. Go to Firebase Console
2. Firestore Database → Data tab
3. View collections and documents

---

## API Reference Quick Links

- Firebase Web SDK: https://firebase.google.com/docs/web/setup
- Firestore: https://firebase.google.com/docs/firestore/start
- Authentication: https://firebase.google.com/docs/auth/web/start
- Security Rules: https://firebase.google.com/docs/firestore/security/start

---

**Last Updated**: 2024  
**Version**: 1.0.0
