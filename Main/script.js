const barIcon = document.querySelector(".bar-icon");
const sideMenu = document.querySelector(".side-menu");
const closeMenuBtn = document.querySelector(".close-menu");

barIcon.addEventListener("click", function () {
    sideMenu.style.right = "0";
});

closeMenuBtn.addEventListener("click", function () {
    sideMenu.style.right = "-250px";
});

// Define variables to hold user and selected item data
let current_user = null;
let selectedItem = null;

document.addEventListener('DOMContentLoaded', function() {
    // Fetch items data from the server
    fetch('http://localhost:3000/api/getitems')
    .then(response => response.json())
    .then(items => {
        const itemsList = document.getElementById('items-list');
        if (itemsList) { // Check if itemsList exists
            console.log(items)
            itemsList.innerHTML = '';
            items.forEach(item => {
                if(item.name !=='Nike Hoodie'){
                const li = document.createElement('li');
                li.innerHTML = `<div class="container">
                <div class="wrapper">
                    <div class="banner-image" style="background-image: url('${item.imageUrl}');"></div>
                    <h2>${item.name}</h2>
                    <label class="price-label outline">${item.price} QAR</label>
                </div>
                <div class="button-wrapper"> 
                    <button class="btn fill">BUY NOW</button>
                </div>
            </div>`;

                // Add event listener to the "BUY NOW" button
                const buyButton = li.querySelector('.btn.fill');
                if (buyButton) { // Check if buyButton exists
                    buyButton.addEventListener('click', () => redirectToCheckout(item));
                }
                itemsList.appendChild(li);
            }});
        } else {
            console.error('Error: items-list element not found.');
        }
    })
    .catch(error => console.error('Error fetching items:', error));


    // Function to redirect to checkout page and save selected item in local storage
    function redirectToCheckout(item) {
        const urlParams = new URLSearchParams(window.location.search);
        const userdata = urlParams.get('user');
        const user=JSON.parse(decodeURIComponent(userdata))
        
        
        // Redirect to checkout page
        window.location.href = `checkout.html?user=${encodeURIComponent(JSON.stringify({ key: user }))}&item=${encodeURIComponent(JSON.stringify({ key: item }))}`;
    
    }
document.getElementById('history-button').addEventListener('click',function(e){
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const userdata = urlParams.get('user');
    const user=JSON.parse(decodeURIComponent(userdata)).key
    window.location.href=`History.html?id=${user.id}`;
})

    // Search functionality
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = document.getElementById('search-input').value.toLowerCase(); // Get the search query and convert to lowercase for case-insensitive matching
        const items = document.querySelectorAll('.container h2'); // Select all item names
        console.log(items)
        items.forEach(item => {
            const itemName = item.textContent.toLowerCase(); // Get the item name and convert to lowercase
            if (itemName.includes(searchInput)) {
                item.parentElement.parentElement.style.display = 'block'; // Show the item if it matches the search query
            } else {
                item.parentElement.parentElement.style.display = 'none'; // Hide the item if it doesn't match the search query
            }
        });
    });
});
