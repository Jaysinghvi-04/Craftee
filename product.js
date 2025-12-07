let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener("DOMContentLoaded", () => {
  const productSection = document.querySelector('.product-section .container');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  fetch(`api/products.php?id=${productId}`)
    .then(response => response.json())
    .then(product => {
      const productDetails = `
        <div class="product-grid">
          <div class="product-image-gallery">
            <img src="${product.image}" alt="${product.name}" class="main-image">
          </div>
          <div class="product-info">
            <h1>${product.name}</h1>
            <p class="price">₹${product.price}</p>
            <p class="description">${product.description}</p>
            
            <div class="product-options">
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <input type="number" id="quantity" value="1" min="1">
                    <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
            </div>

            <div class="product-actions">
              <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
              <button class="btn btn-secondary"><i class="fas fa-heart"></i> Add to Wishlist</button>
            </div>

            <div class="product-meta">
                <p><strong>SKU:</strong> TEE-00${product.id}</p>
                <p><strong>Category:</strong> T-Shirts</p>
                <p><strong>Tags:</strong> Minimal, Aesthetic, Streetwear</p>
            </div>
          </div>
        </div>
      `;
      productSection.innerHTML = productDetails;
      updateCartCount();
    });
});

function changeQuantity(amount) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    currentValue += amount;
    if (currentValue < 1) {
        currentValue = 1;
    }
    quantityInput.value = currentValue;
}

function addToCart(productId) {
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value);

    fetch(`api/products.php?id=${productId}`)
    .then(response => response.json())
    .then(product => {
        const cartItem = cart.find(item => item.id == productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Add animation to cart icon
        const cartIcon = document.querySelector('.cart-icon');
        cartIcon.classList.add('shake');
        setTimeout(() => {
            cartIcon.classList.remove('shake');
        }, 500);
    });
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  }
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

.product-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
}

.product-image-gallery .main-image {
    width: 100%;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.product-info h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 3px;
    margin-bottom: 20px;
}

.product-info .price {
    font-size: 28px;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 20px;
}

.product-info .description {
    color: var(--gray);
    line-height: 1.8;
    margin-bottom: 30px;
}

.product-options {
    margin-bottom: 30px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-selector label {
    font-weight: 600;
}

.quantity-selector input {
    width: 50px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.quantity-selector .quantity-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    cursor: pointer;
    border-radius: 5px;
}

.product-actions {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.product-meta {
    font-size: 14px;
    color: var(--gray);
}
`;
document.head.appendChild(style);