// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => (loader.style.display = 'none'), 500);
  }, 1000);
});

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message || '✓ Added to cart!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== CART MANAGEMENT =====
let cartCount = 4;

function addToCart() {
  cartCount++;
  document.getElementById('cartBadge').textContent = cartCount;
  showToast('🛒 Item added to cart!');
}

function changeQty(button, direction) {
  const quantityWrapper = button.parentElement;
  const quantityElement = quantityWrapper.querySelector('.qty-num');
  let quantity = parseInt(quantityElement.textContent) + direction;
  
  if (quantity < 1) quantity = 1;
  quantityElement.textContent = quantity;
}

// ===== PAYMENT SELECTION =====
function selPay(element) {
  document.querySelectorAll('.pay-opt').forEach(opt => opt.classList.remove('sel'));
  element.classList.add('sel');
  element.querySelector('input').checked = true;
}

// ===== ORDER PLACEMENT =====
function placeOrder() {
  showToast('🎉 Order placed successfully!');
  setTimeout(() => showPage('tracking'), 800);
}

// ===== ORDER TRACKING =====
function showTrack() {
  const trackResult = document.getElementById('trackResult');
  trackResult.style.display = 'block';
  trackResult.style.animation = 'fadeIn 0.5s ease';
  setTimeout(() => {
    trackResult.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// ===== CATEGORY PILLS =====
function initCategoryPills() {
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.prod-card, .cat-card, .feature, .banner-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// ===== INITIALIZE ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
  initCategoryPills();
  initScrollAnimations();
});
