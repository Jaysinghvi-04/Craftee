// Mobile Menu Toggle
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Background on Scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Newsletter Form Submit
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input').value;
    alert(`Thank you for subscribing! We'll send updates to ${email}`);
    this.reset();
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.category-card, .testimonial-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('api/products.php')
    .then(response => response.json())
    .then(data => {
      if (data.records) {
        products = data.records;
        const productsGrid = document.querySelector('.products-grid');
        productsGrid.innerHTML = '';
        products.forEach(product => {
          const productCard = `
            <div class="product-card">
              <a href="product.html?id=${product.id}">
                <div class="product-image">
                  <img src="${product.image}" alt="${product.name}">
                </div>
              </a>
              <div class="product-info">
                <h3>${product.name}</h3>
                <p>
                  <span class="price">₹${product.price}</span>
                </p>
                <div class="product-actions">
                  <button><i class="fas fa-heart"></i></button>
                  <button onclick="addToCart(${product.id})"><i class="fas fa-shopping-bag"></i></button>
                  <button onclick="viewProduct(${product.id})"><i class="fas fa-eye"></i></button>
                </div>
              </div>
            </div>
          `;
          productsGrid.innerHTML += productCard;
        });
        document.querySelectorAll('.product-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
      }
      updateCartCount();
    });
});

function addToCart(productId) {
  const product = products.find(p => p.id == productId);
  const cartItem = cart.find(item => item.id == productId);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Add animation to cart icon
  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.classList.add('shake');
  setTimeout(() => {
      cartIcon.classList.remove('shake');
  }, 500);
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Add shake animation to cart icon
const style = document.createElement('style');
style.innerHTML = `
.cart-icon.shake {
    animation: shake 0.5s;
}

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);