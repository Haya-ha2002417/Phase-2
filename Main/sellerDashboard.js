document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserdata = urlParams.get('seller');
    const currentSeller= JSON.parse(decodeURIComponent(currentUserdata)).key
    console.log(currentSeller)
    let sellerId = currentSeller.id;
      // Fetch items from server
      fetch(`http://localhost:3000/api/getitems`)
      .then(response => response.json())
      .then(data => {
          // Display items currently selling
          const sellingItemsList = document.getElementById('selling-items');
          const soldItemsList = document.getElementById('sold-items');

          data.forEach(item => {
              const listItem = document.createElement('li');
              if(item.sellerId==sellerId){
                listItem.textContent = `${item.name} - Price: ${item.price} QAR`;

             
        fetch(`http://localhost:3000/api/Getpurchases`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            
        })
        .then(response => response.json())
        .then(saleHistory => {
           
            saleHistory = saleHistory.filter(transaction=>transaction.productId==item.id)
            console.log('sale',saleHistory)
              if (saleHistory) {
                  const saleHistoryList = document.createElement('ul');
                  saleHistoryList.classList.add('sale-history-list');

                  saleHistory.forEach(sale => {
                      const saleListItem = document.createElement('li');
                      saleListItem.textContent = `Buyer: ${sale.buyerId}, Selling Price: $${sale.totalPrice}, Quantity: ${sale.quantity}, Date: ${new Date(sale.date).toLocaleString()}`;
                      saleHistoryList.appendChild(saleListItem);
                  });
                  listItem.appendChild(saleHistoryList);
              }
            })

              if (item.quantity > 0 && item.sellerId == sellerId) {
                  // Item is currently selling
                  sellingItemsList.appendChild(listItem);
                  listItem.addEventListener('click', () => {
                      alert(`Details of ${item.name}: Price: $${item.price}, Quantity: ${item.quantity}`);
                  });
              } else if (item.quantity === 0 && item.sellerId == sellerId) {
                  // Item has been sold
                  soldItemsList.appendChild(listItem);
              }
            }
            })
          
      })
      .catch(error => console.error('Error fetching items:', error));



      // Handle form submission for uploading new item
    document.getElementById("button-back").addEventListener('click',function(e)
    {
        e.preventDefault();
        window.location.href="login.html";
    })
        document.getElementById('upload-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const itemName = document.getElementById('item-name').value;
            const itemPrice = document.getElementById('item-price').value;
            const itemQuantity = document.getElementById('item-Quantity').value;
            const itemURL = document.getElementById('item-URL').value;
            const details = document.getElementById('item-description').value;
            sellerId=sellerId.toString();

            // Construct item object
            const newItem = {
                name: itemName,
                price: parseFloat(itemPrice),
                quantity: parseInt(itemQuantity),
                sellerId: sellerId,
                imageUrl:itemURL,
                description:details
            };
    
            // Send POST request to add new item
            fetch('http://localhost:3000/api/additem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newItem)
            })
            .then(response => response.json())
            .then(data => {
                alert('item added successfully');
                // Refresh page to display updated item list
                location.reload();
            })
            .catch(error => console.error('Error uploading item:', error));
        });
    
});