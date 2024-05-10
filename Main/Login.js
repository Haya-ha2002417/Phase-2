// Sample login functionality
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send request to server to validate login
    fetch(`http://localhost:3000/api/SignIn`,{
      
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            alert("Invalid username or password")
            throw new Error('Invalid username or password');
        }
    })
    .then(data => {
        console.log(data)
     
        // Save user data in local storage
        if(data.city){ 
            // Redirect to index.html if login is successful
            alert("login is successful")
            window.location.href = `index.html?user=${encodeURIComponent(JSON.stringify({ key: data }))}`;
           
        } else if (data.error) { 
            alert(data.error)
            throw new Error('Unknown user type');
            // window.location.href = `SellerDashboard.html?seller=${encodeURIComponent(JSON.stringify({ key: data }))}`;
        } else {
           window.location.href = `SellerDashboard.html?seller=${encodeURIComponent(JSON.stringify({ key: data }))}`;
        }
    })
    .catch(error => {
        // Handle error, e.g., display error message to the user
        console.error('Login error:', error.message);
    });
});
