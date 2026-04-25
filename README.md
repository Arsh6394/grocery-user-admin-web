# FreshMart - Grocery Store Project

A modern, responsive e-commerce grocery store website built with **HTML5, CSS3, and Vanilla JavaScript**.

## 📁 Project Structure

```
Grocery/
├── index.html              # Main entry point
├── css/
│   ├── variables.css       # CSS variables and design tokens
│   ├── global.css          # Global styles & reset
│   ├── navbar.css          # Navigation & header
│   ├── hero.css            # Hero section
│   └── style.css           # Legacy (all styles combined)
├── js/
│   ├── main.js             # Core functionality
│   └── script.js           # Legacy (all scripts combined)
├── assets/
│   └── images/             # Image storage (future)
└── README.md               # This file
```

## 🚀 Features

- ✅ **Multi-page layout** (Home, Cart, Checkout, Tracking)
- ✅ **Responsive design** (Mobile, Tablet, Desktop)
- ✅ **Modern UI** with smooth animations
- ✅ **Cart management** with quantity controls
- ✅ **Order tracking** with timeline
- ✅ **Payment options** integration
- ✅ **Scroll animations** for better UX

## 🎨 Design System

### Color Palette
- **Primary Green**: `#2d8c4e`
- **Dark Green**: `#1e6338`
- **Light Green**: `#e8f5ec`
- **Orange**: `#f97316`
- **Yellow**: `#fbbf24`
- **Red**: `#ef4444`

### Typography
- **Primary Font**: Nunito (Sans-serif)
- **Serif Font**: Fraunces (for headings)

### Spacing Scale
- XS: 4px | SM: 8px | MD: 16px | LG: 24px | XL: 32px | 2XL: 60px

## 🔧 Installation & Usage

1. **No build process required** - Uses vanilla HTML/CSS/JS
2. Open `index.html` in any modern browser
3. All external assets loaded from CDN (Google Fonts, Unsplash)

## ⚡ Performance Optimizations

### CSS
- ✅ **CSS Variables** for maintainability
- ✅ **Separated stylesheets** for better organization
- ✅ Can be minified with build tools (Webpack, Gulp)
- ✅ Optimized selectors and media queries

### JavaScript
- ✅ **DOMContentLoaded event** for better performance
- ✅ **Event delegation** patterns
- ✅ **Minimal DOM manipulation**
- ✅ **IntersectionObserver** for scroll animations (lazy loading)

### Other
- ✅ **External fonts** with `display=swap`
- ✅ **Image compression** ready (using Unsplash CDN)
- ✅ **No render-blocking resources**

## 🚧 Future Optimizations

1. **Bundle with Webpack/Parcel**
   ```bash
   npm install webpack webpack-cli
   ```

2. **Minify CSS & JS**
   ```bash
   npm install cssnano terser
   ```

3. **Add CSS Preprocessing** (SCSS/SASS)
   ```
   css/
   ├── _variables.scss
   ├── _globals.scss
   ├── _navbar.scss
   ├── components/
   │   ├── _hero.scss
   │   ├── _buttons.scss
   │   └── _cards.scss
   └── main.scss
   ```

4. **Split JavaScript Modules**
   ```
   js/
   ├── utils/
   │   ├── cart.js
   │   ├── notifications.js
   │   └── dom.js
   ├── pages/
   │   ├── home.js
   │   ├── cart.js
   │   └── checkout.js
   └── main.js
   ```

5. **Server-side Rendering** with Node.js/Express
6. **Database integration** for real products/orders
7. **Payment Gateway** (Stripe, Razorpay)
8. **User Authentication** (JWT, OAuth)

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🎯 Quick Start

```html
<!-- Open index.html in browser -->
<!-- All CSS files auto-load -->
<!-- All JS files auto-load -->
```

## 📊 File Size Summary

| File | Type | Size |
|------|------|------|
| index.html | HTML | ~45KB |
| style.css | CSS | ~35KB |
| script.js | JS | ~3KB |

**Total (gzipped)**: ~15KB

## 🔐 Security Notes

- ✅ No sensitive data exposed
- ✅ All inputs can be sanitized (future)
- ✅ Ready for backend integration

## 📝 License

Developed as a portfolio project. Free to use and modify.

---

**Questions or suggestions?** Feel free to update the structure further!
