      // Retrieve the total value from localStorage
      let totalValues = JSON.parse(localStorage.getItem('total')) || 0; // Default to 0 if no total is found
      console.log("Total amount:", totalValues);

      document.getElementById("btn").onclick = function (e) {
        e.preventDefault(); // Prevent default form submission

        var options = {
          key: "rzp_test_PV1oQ0oMtgXOsq", // Replace with your Key ID from Razorpay Dashboard
          amount: totalValues * 100, // Dynamic amount from localStorage, converted to currency subunits (paise)
          currency: "INR",
          name: "MyShop Checkout",
          description: "This is your order",
          image: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
          theme: {
            color: "#000", // Customize the theme color
          },
          handler: function (response) {
            console.log(response);
            localStorage.removeItem('cart');
            localStorage.removeItem('total');
            alert("Payment successful!");
          },
          modal: {
            ondismiss: function() {
              alert("Payment canceled");
            }
          }
        };

        var rzpy1 = new Razorpay(options);
        rzpy1.open(); // Open the Razorpay checkout form
      };