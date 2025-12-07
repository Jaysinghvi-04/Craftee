document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector('.cart-items');
  const subtotalElement = document.querySelector('.subtotal');
  const totalElement = document.querySelector('.total-price');
  const cartCount = document.querySelector('.cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is currently empty. <a href="index.html#shop">Continue Shopping</a></p>';
      subtotalElement.textContent = '₹0.00';
      totalElement.textContent = '₹0.00';
      updateCartCount();
      return;
    }

    const cartHeader = `
        <div class="cart-item-header">
            <div class="header-product">Product</div>
            <div class="header-quantity">Quantity</div>
            <div class="header-total">Total</div>
        </div>
    `;
    cartItemsContainer.innerHTML += cartHeader;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const cartItem = `
        <div class="cart-item">
          <div class="item-product">
            <div class="item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
              <h3>${item.name}</h3>
              <p>Price: ₹${item.price}</p>
              <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Remove</button>
            </div>
          </div>
          <div class="item-quantity">
            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
          </div>
          <div class="item-total">
            ₹${itemTotal.toFixed(2)}
          </div>
        </div>
      `;
      cartItemsContainer.innerHTML += cartItem;
      subtotal += itemTotal;
    });

    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    totalElement.textContent = `₹${subtotal.toFixed(2)}`;
    updateCartCount();
  }

  function updateQuantity(productId, action) {
    const product = cart.find(item => item.id == productId);
    if (product) {
      if (action === 'increase') {
        product.quantity++;
      } else if (action === 'decrease') {
        if (product.quantity > 1) {
            product.quantity--;
        } else {
            removeFromCart(productId);
            return;
        }
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
  }
  
  function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
  }

  cartItemsContainer.addEventListener('click', e => {
    if (e.target.closest('.quantity-btn')) {
      const btn = e.target.closest('.quantity-btn');
      const productId = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      updateQuantity(productId, action);
    }

    if (e.target.closest('.remove-btn')) {
      const btn = e.target.closest('.remove-btn');
      const productId = parseInt(btn.dataset.id);
      removeFromCart(productId);
    }
  });

  renderCart();
});

const style = document.createElement('style');
style.innerHTML = `
.cart-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: start;
}
.cart-item-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    padding-bottom: 15px;
    border-bottom: 2px solid #eee;
    font-weight: 600;
    color: var(--gray);
    text-transform: uppercase;
    font-size: 13px;
    letter-spacing: 1px;
}
.header-product { grid-column: 1; }
.header-quantity { grid-column: 2; text-align: center; }
.header-total { grid-column: 3; text-align: right; }

.cart-item {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    align-items: center;
    padding: 25px 0;
    border-bottom: 1px solid #eee;
}
.item-product {
    display: flex;
    align-items: center;
    gap: 20px;
}
.item-image img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
}
.item-details h3 {
    font-size: 16px;
    margin-bottom: 5px;
}
.item-details p {
    color: var(--gray);
    font-size: 14px;
    margin-bottom: 10px;
}
.remove-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    font-size: 13px;
}
.item-quantity {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.item-quantity .quantity-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    cursor: pointer;
    border-radius: 5px;
}
.item-total {
    text-align: right;
    font-weight: 600;
}
.empty-cart {
    padding: 40px;
    text-align: center;
    font-size: 18px;
}
.empty-cart a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
}
.cart-summary {
    background-color: var(--light-gray);
    padding: 30px;
    border-radius: 15px;
}
.cart-summary h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    margin-bottom: 20px;
}
.summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}
.summary-item.total {
    font-weight: 700;
    font-size: 18px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
}
.cart-summary .btn {
    width: 100%;
    margin-top: 20px;
}
`;
document.head.appendChild(style);