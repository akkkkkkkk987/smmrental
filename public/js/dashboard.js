document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/login';
        return;
    }

    // Update username in the welcome message
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = user.username;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Function to fetch and update balance
    async function updateBalance() {
        try {
            const response = await fetch('/api/auth/balance', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const balanceElement = document.getElementById('userBalance');
                if (balanceElement) {
                    balanceElement.textContent = data.balance.toFixed(2);
                }
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    }

    // Update username from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const usernameElement = document.getElementById('username');
    if (usernameElement && user) {
        usernameElement.textContent = user.username;
    }

    // Fetch balance when page loads
    updateBalance();

    // Update balance every 30 seconds
    setInterval(updateBalance, 30000);

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        });
    }
});