let cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];

const cartItemsEl = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');

function renderCart() {
    if (cart.length === 0) {
        cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
        updateTotals();
        return;
    }

    cartItemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <p><strong>${item.name}</strong> (${item.length}") - $${item.price}</p>
            <div>
                <button onclick="changeQty(${index}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
    `).join('');

    updateTotals();
}

function changeQty(index, delta) {
    if (cart[index].qty + delta > 0) {
        cart[index].qty += delta;
        save();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    save();
}

function updateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    totalEl.innerText = `$${subtotal.toFixed(2)}`;
}

function save() {
    localStorage.setItem('ellenLuxeCart', JSON.stringify(cart));
    renderCart();
}

renderCart();
