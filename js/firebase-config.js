// Firebase Configuration
// Connected to: freshmart-grocery-b7c1a

const firebaseConfig = {
  apiKey: "AIzaSyBz4cHDKMoT6oEYS87-rgOQ1fSHiRGPwQU",
  authDomain: "freshmart-grocery-b7c1a.firebaseapp.com",
  projectId: "freshmart-grocery-b7c1a",
  storageBucket: "freshmart-grocery-b7c1a.firebasestorage.app",
  messagingSenderId: "737574495665",
  appId: "1:737574495665:web:bf24c60982774647364990",
  measurementId: "G-777CVWWS8X"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence().catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (err.code == 'unimplemented') {
    console.log('The current browser does not support all of the features required to enable persistence');
  }
});

// Initialize providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Global user object
let currentUser = null;
let currentUserData = null;

// Auth state listener
auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  if (user) {
    try {
      const docSnap = await db.collection('users').doc(user.uid).get();
      currentUserData = docSnap.data();
      updateUIAfterLogin(user, currentUserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    updateUIAfterLogout();
  }
});

// Update UI after login
function updateUIAfterLogin(user, userData) {
  showPage('home');
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.innerHTML = `
      <button class="nav-icon-btn" title="Profile" onclick="showPage('profile')">👤</button>
      <button class="nav-icon-btn" title="Orders" onclick="showPage('orders')">📦</button>
      <button class="nav-cart-btn" onclick="showPage('cart')">
        🛒 Cart <span id="cartBadge" class="badge">0</span>
      </button>
      <button class="nav-icon-btn" style="color: var(--red);" onclick="logoutUser()" title="Logout">🚪</button>
    `;
  }
}

// Update UI after logout
function updateUIAfterLogout() {
  const authContainer = document.getElementById('authContainer');
  if (authContainer) {
    authContainer.innerHTML = `
      <button class="nav-icon-btn" onclick="showPage('login')">🔐</button>
      <button class="nav-cart-btn" onclick="showPage('cart')">
        🛒 Cart <span id="cartBadge" class="badge">0</span>
      </button>
    `;
  }
}

// Sign up
async function signUpUser(email, password, name) {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    const user = result.user;

    // Update profile
    await user.updateProfile({
      displayName: name
    });

// Create user document in Firestore
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      email: email,
      displayName: name,
      phone: '',
      shippingAddress: '',
      billingAddress: '',
      createdAt: new Date(),
      cart: [],
      orders: [],
      favorites: []
    });

    showToast('✓ Account created successfully!');
    return user;
  } catch (error) {
    showToast('❌ ' + error.message);
    throw error;
  }
}

// Sign in
async function signInUser(email, password) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    showToast('✓ Logged in successfully!');
    return result.user;
  } catch (error) {
    showToast('❌ ' + error.message);
    throw error;
  }
}

// Google sign in
async function signInWithGoogle() {
  try {
    const result = await auth.signInWithPopup(googleProvider);
    const user = result.user;

    // Check if user exists in Firestore
    const docSnap = await db.collection('users').doc(user.uid).get();
    if (!docSnap.exists) {
      // Create new user document
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL || '',
        phone: '',
        address: '',
        createdAt: new Date(),
        cart: [],
        orders: [],
        favorites: []
      });
    }

    showToast('✓ Logged in with Google!');
    return user;
  } catch (error) {
    showToast('❌ ' + error.message);
    throw error;
  }
}

// Logout
async function logoutUser() {
  try {
    await auth.signOut();
    showToast('✓ Logged out successfully!');
  } catch (error) {
    showToast('❌ ' + error.message);
  }
}

// Add to cart in Firestore
async function addToCartFirebase(productId, productName, price, qty = 1) {
  if (!currentUser) {
    showToast('⚠️ Please login to add items to cart');
    showPage('login');
    return;
  }

  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    let cart = userDoc.data().cart || [];

    // Check if item already in cart
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart[itemIndex].qty += qty;
    } else {
      cart.push({
        productId,
        productName,
        price,
        qty,
        addedAt: new Date()
      });
    }

    await userRef.update({ cart });
    showToast('🛒 Added to cart!');
    updateCartUI();
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast('❌ Error adding to cart');
  }
}

// Get user cart
async function getUserCart() {
  if (!currentUser) return [];
  try {
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    return userDoc.data().cart || [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

// Remove from cart
async function removeFromCart(productId) {
  if (!currentUser) return;
  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    let cart = userDoc.data().cart || [];
    cart = cart.filter(item => item.productId !== productId);
    await userRef.update({ cart });
    updateCartUI();
    showToast('✓ Removed from cart');
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
}

// Update cart quantity
async function updateCartQty(productId, qty) {
  if (!currentUser) return;
  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    let cart = userDoc.data().cart || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      if (qty <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].qty = qty;
      }
    }
    await userRef.update({ cart });
    updateCartUI();
  } catch (error) {
    console.error('Error updating cart:', error);
  }
}

// Place order
async function placeOrderFirebase(paymentMethod) {
  if (!currentUser) {
    showToast('⚠️ Please login to place order');
    return;
  }

  try {
    const userRef = db.collection('users').doc(currentUser.uid);
    const userDoc = await userRef.get();
    const cart = userDoc.data().cart || [];
    const userData = userDoc.data();

    if (cart.length === 0) {
      showToast('⚠️ Your cart is empty');
      return;
    }

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Create order
    const orderId = 'ORD-' + Date.now();
    const order = {
      orderId,
      userId: currentUser.uid,
      items: cart,
      total,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      shippingAddress: userData.address || 'Address pending',
      trackingUpdates: [
        {
          status: 'Order Confirmed',
          timestamp: new Date(),
          message: 'Your order has been confirmed'
        }
      ]
    };

    // Save order to orders collection
    await db.collection('orders').doc(orderId).set(order);

    // Add to user's orders array
    let orders = userData.orders || [];
    orders.push(orderId);
    
    // Clear cart and update orders
    await userRef.update({
      cart: [],
      orders: orders
    });

    showToast('🎉 Order placed successfully!');
    setTimeout(() => {
      showPage('tracking');
      loadOrderTracking(orderId);
    }, 800);

  } catch (error) {
    console.error('Error placing order:', error);
    showToast('❌ Error placing order');
  }
}

// Load order tracking
async function loadOrderTracking(orderId) {
  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    const order = orderDoc.data();
    
    const trackingHtml = `
      <div class="track-card">
        <h3>Order #${order.orderId}</h3>
        <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        <p><strong>Placed:</strong> ${new Date(order.createdAt.toDate()).toLocaleString()}</p>
        <p><strong>Est. Delivery:</strong> ${new Date(order.estimatedDelivery.toDate()).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
        <h4>Items:</h4>
        <ul>
          ${order.items.map(item => `<li>${item.productName} x${item.qty} - ₹${(item.price * item.qty).toFixed(2)}</li>`).join('')}
        </ul>
        <h4>Tracking Updates:</h4>
        <div class="timeline">
          ${order.trackingUpdates.map(update => `
            <div class="timeline-item">
              <span class="status-badge">${update.status}</span>
              <p>${update.message}</p>
              <small>${new Date(update.timestamp.toDate()).toLocaleString()}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    const trackingResult = document.getElementById('trackResult');
    if (trackingResult) {
      trackingResult.innerHTML = trackingHtml;
      trackingResult.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading tracking:', error);
    showToast('❌ Error loading order details');
  }
}

// Get user orders
async function getUserOrders() {
  if (!currentUser) return [];
  try {
    const snapshot = await db.collection('orders').where('userId', '==', currentUser.uid).get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Update user profile
async function updateUserProfile(name, phone, address) {
  if (!currentUser) return;
  try {
    await db.collection('users').doc(currentUser.uid).update({
      name,
      phone,
      address
    });
    currentUserData = { ...currentUserData, name, phone, address };
    showToast('✓ Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('❌ Error updating profile');
  }
}

// Search products (example Firestore search)
async function searchProducts(query) {
  try {
    if (!query.trim()) return [];
    
    const snapshot = await db.collection('products')
      .where('name', '>=', query)
      .where('name', '<=', query + '\uf8ff')
      .limit(20)
      .get();
    
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Update cart UI
async function updateCartUI() {
  if (!currentUser) return;
  const cart = await getUserCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = cart.length;
  }
}
