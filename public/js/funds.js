document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const fundRequestForm = document.getElementById('fundRequestForm');
    const imagePreview = document.getElementById('imagePreview');
    const requestsList = document.getElementById('requestsList');
    const screenshotInput = document.getElementById('screenshot');

    // Handle image preview
    screenshotInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Screenshot preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    fundRequestForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const amount = document.getElementById('amount').value;
        const screenshot = imagePreview.querySelector('img').src;

        try {
            const response = await fetch('/api/funds/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount,
                    screenshot
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Fund request submitted successfully!');
                fundRequestForm.reset();
                imagePreview.innerHTML = '';
                loadPreviousRequests();
            } else {
                alert(data.message || 'Failed to submit request');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    });

    // Load previous requests
    async function loadPreviousRequests() {
        try {
            const response = await fetch('/api/funds/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const requests = await response.json();

            requestsList.innerHTML = requests.map(request => `
                <div class="request-item">
                    <p><strong>Amount:</strong> PKR ${request.amount}</p>
                    <p><strong>Date:</strong> ${new Date(request.transactionDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> 
                        <span class="request-status status-${request.status}">
                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                    </p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    }

    // Load previous requests on page load
    loadPreviousRequests();

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