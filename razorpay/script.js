// Link for the documentation:
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration

// Add button code documentation:
// https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration#code-to-add-pay-button
// Retrieve the total value from localStorage
let totalValues = JSON.parse(localStorage.getItem('total'));
console.log(totalValues);

document.getElementById("btn").onclick = function (e) {
  e.preventDefault(); // Prevent default form submission

  var options = {
    key: "YOUR_KEY_ID", // Replace with your Key ID from Razorpay Dashboard
    amount: totalValues * 100, // Amount is in currency subunits. Here, it is in paise (INR). For example, 50000 refers to 50000 paise (₹500)
    currency: "INR",
    name: "MyShop Checkout",
    description: "This is your order",
    image: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
    theme: {
      color: "#000", // Customize the theme color
    },
    handler: function (response) {
      // This function is triggered after the payment is successful
      console.log(response);
      // Clear cart from localStorage
      localStorage.removeItem('cart');
      localStorage.removeItem('total');
      alert("Payment successful!");
      // Redirect or perform other actions as needed
    },
    modal: {
      ondismiss: function() {
        // This function is triggered if the payment modal is closed by the user
        alert("Payment canceled");
      }
    }
  };

  var rzpy1 = new Razorpay(options);
  rzpy1.open(); // Open the Razorpay checkout form
};
