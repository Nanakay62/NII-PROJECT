const cart = JSON.parse(localStorage.getItem('ellenLuxeCart')) || [];
const summaryEl = document.getElementById('order-summary');
const totalEl = document.getElementById('checkout-total');

const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

summaryEl.innerHTML = cart.map(item => `
    <p>${item.name} (${item.length}") x ${item.qty} = $${(item.price * item.qty).toFixed(2)}</p>
`).join('');

totalEl.innerText = `$${total.toFixed(2)}`;

// 🔴 PAYPAL API INTEGRATION HAPPENS HERE 🔴
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total.toFixed(2)
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Payment successful! Thank you ' + details.payer.name.given_name);
            
            // Clear cart after payment
            localStorage.removeItem('ellenLuxeCart');
            window.location.href = "index.html";
        });
    }
}).render('#paypal-button-container');
