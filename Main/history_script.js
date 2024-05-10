document.addEventListener('DOMContentLoaded', function() {
    // Retrieve current user data from local storage
    const urlParams = new URLSearchParams(window.location.search);
    const currentUser =urlParams.get('id');

    // Get the purchase history container
    const historyContainer = document.getElementById('purchase-history');
    if(currentUser){
        // Check if there is current user data and if it contains purchase history
        fetch('http://localhost:3000/api/Getpurchases',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json()).then(purchaseHistory => {
            console.log(purchaseHistory)
    // Check if there is current user data and if it contains purchase history
    if (purchaseHistory && purchaseHistory.length > 0) {
        // Loop through each purchase in the purchase history and create HTML elements to display them
        purchaseHistory.forEach(purchase => {
            
            const purchaseItem = document.createElement('div');
            purchaseItem.classList.add('purchase-item');

            const title = document.createElement('h3');
            title.textContent = `Purchase Date: ${new Date(purchase.date).toLocaleString()}`;
            purchaseItem.appendChild(title);

            const details = document.createElement('p');
            details.textContent = `Item id: ${purchase.productId}, Quantity: ${purchase.quantity}, Total Price: ${purchase.totalPrice} QAR`;
            purchaseItem.appendChild(details);

            historyContainer.appendChild(purchaseItem);
        });
    } else {
        // If no purchase history found, display a message
        historyContainer.textContent = 'No purchase history available.';
    }
})
    }
});    
document.addEventListener('DOMContentLoaded', function() {
    const backToHomeLink = document.getElementById('backToHome');

    backToHomeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default behavior of following the link

        window.history.back(); // Go back to the previous window
    });
});
