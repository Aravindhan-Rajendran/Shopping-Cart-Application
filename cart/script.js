document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const checkoutList = document.getElementById('checkout-list');
    const totalValueElement = document.getElementById('total-value');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Check if products are already in localStorage
    let products = localStorage.getItem("products");
    if (products) {
        products = JSON.parse(products);
    } else {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("products", JSON.stringify(data));
                products = data;
            })
            .catch(err => {
                console.error("Failed to fetch products:", err);
            });
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayProducts(cartItems) {
        cartItemsContainer.innerHTML = ''; // Clear previous items
        checkoutList.innerHTML = ''; // Clear checkout list
        let totalValue = 0;

        cartItems.forEach((cartItem, index) => {
            const product = products.find(p => p.id === cartItem.itemId);
            if (product) {
                const itemElement = document.createElement("div");
                itemElement.classList.add("item");

                itemElement.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" onerror="this.src='default.png';" />
                    <div class="info">
                        <div class="title">${product.title}</div>
                        <div class="row">
                            <div class="price" style="font-weight:bold;margin-top:40px;">$${product.price}</div>
                        </div>
                    </div>
                    <button class="cart-button" data-id="${product.id}">Remove From Cart</button>
                `;
                cartItemsContainer.appendChild(itemElement);

                const listItem = document.createElement('li');
                listItem.classList.add('checkout-item');
                listItem.innerHTML = `
                    <span class="checkout-title">${index + 1}. ${product.title}</span>
                    <span class="checkout-price">$${product.price.toFixed(2)}</span>
                `;
                checkoutList.appendChild(listItem);
                totalValue += product.price;
            }
        });

        totalValueElement.textContent = `Total: $${totalValue.toFixed(2)}`;
        localStorage.setItem('total', totalValue.toFixed(2)); // Store the total value

        // Add event listeners to remove buttons
        document.querySelectorAll('.cart-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(itemId);
            });
        });
    }

    function removeFromCart(itemId) {
        cart = cart.filter(cartItem => cartItem.itemId !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayProducts(cart);
    }

    displayProducts(cart);

    checkoutBtn.addEventListener('click', () => {
        const totalValue = localStorage.getItem('total'); // Retrieve the total value
        alert(`Total amount to pay: $${totalValue}`);
        window.location.href="../razorpay.index.html";
        // Implement the checkout functionality here
    });
});