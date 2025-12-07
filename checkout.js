document.addEventListener("DOMContentLoaded", () => {
  const orderSummary = document.querySelector('.order-summary-items');
  const summarySubtotal = document.querySelector('.summary-subtotal');
  const summaryTotal = document.querySelector('.summary-total');
  const placeOrderBtn = document.getElementById('place-order-btn');
  const cartCount = document.querySelector('.cart-count');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let user = JSON.parse(localStorage.getItem('user'));

  function renderOrderSummary() {
    orderSummary.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      orderSummary.innerHTML = '<p>Your cart is empty.</p>';
      summarySubtotal.textContent = '₹0.00';
      summaryTotal.textContent = '₹0.00';
      updateCartCount();
      return;
    }

    cart.forEach(item => {
      const summaryItem = `
        <div class="summary-product">
          <div class="product-image">
            <img src="${item.image}" alt="${item.name}">
            <span class="product-quantity">${item.quantity}</span>
          </div>
          <div class="product-details">
            <h3>${item.name}</h3>
            <p>₹${item.price}</p>
          </div>
          <div class="product-total">
            ₹${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      `;
      orderSummary.innerHTML += summaryItem;
      subtotal += item.price * item.quantity;
    });

    summarySubtotal.textContent = `₹${subtotal.toFixed(2)}`;
    summaryTotal.textContent = `₹${subtotal.toFixed(2)}`;
    updateCartCount();
  }

  function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }
  }

  placeOrderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to place an order.');
      window.location.href = 'login.html';
      return;
    }

    const shippingForm = document.getElementById('shipping-form');
    const formData = new FormData(shippingForm);
    const shippingData = Object.fromEntries(formData.entries());

    if (Object.values(shippingData).some(value => value === '')) {
      alert('Please fill out all shipping information.');
      return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderData = {
      user_id: user.id,
      total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
      items: cart,
      shipping: shippingData
    };

    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = 'Placing Order...';

    fetch('api/orders.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "Order created successfully") {
        localStorage.removeItem('cart');
        document.querySelector('.checkout-grid').innerHTML = `
            <div class="order-success">
                <i class="fas fa-check-circle"></i>
                <h2>Thank you for your order!</h2>
                <p>Your order has been placed successfully. You will receive a confirmation email shortly.</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
      } else {
        alert('There was an error placing your order. Please try again.');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
      }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error placing your order. Please try again.');
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    });
  });

  renderOrderSummary();
});

const style = document.createElement('style');
style.innerHTML = `
.checkout-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 50px;
    align-items: start;
}
.checkout-form h3, .order-summary h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    margin-bottom: 25px;
}
#shipping-form, #payment-form {
    display: grid;
    gap: 20px;
}
#shipping-form input, #payment-form input {
    width: 100%;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}
.order-summary {
    background-color: var(--light-gray);
    padding: 30px;
    border-radius: 15px;
    position: sticky;
    top: 120px;
}
.order-summary-items {
    margin-bottom: 20px;
}
.summary-product {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}
.summary-product .product-image {
    position: relative;
}
.summary-product .product-image img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}
.product-quantity {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: var(--accent);
    color: white;
    font-size: 12px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.summary-product .product-details {
    flex: 1;
}
.summary-product .product-details h3 {
    font-size: 15px;
    margin: 0;
}
.summary-product .product-details p {
    font-size: 14px;
    color: var(--gray);
    margin: 0;
}
.summary-product .product-total {
    font-weight: 600;
}
.summary-totals .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
.summary-totals .summary-item.total {
    font-weight: 700;
    font-size: 18px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
}
.order-summary .btn {
    width: 100%;
    margin-top: 20px;
}
.order-success {
    text-align: center;
    padding: 80px 0;
    grid-column: 1 / -1;
}
.order-success i {
    font-size: 80px;
    color: #28a745;
    margin-bottom: 30px;
}
.order-success h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 3px;
    margin-bottom: 20px;
}
.order-success p {
    color: var(--gray);
    margin-bottom: 40px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}
`;
document.head.appendChild(style);