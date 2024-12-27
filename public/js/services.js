document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Get all DOM elements
    const categorySelect = document.getElementById('serviceCategory');
    const serviceSelect = document.getElementById('serviceItem');
    const serviceDescription = document.getElementById('serviceDescription');
    const servicePrice = document.getElementById('servicePrice');
    const quantityInput = document.getElementById('quantity');
    const totalCostSpan = document.getElementById('totalCost');
    const orderForm = document.getElementById('orderForm');
    const ordersContainer = document.getElementById('ordersContainer');
    const userBalanceSpan = document.getElementById('userBalance');
    const linkInput = document.getElementById('link');
    const messageDiv = document.getElementById('message');
    const submitButton = orderForm.querySelector('button[type="submit"]');

    let currentService = null;
    let isSubmitting = false;

    // Show message function
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Calculate total function
    function calculateTotal() {
        if (currentService && quantityInput.value) {
            const quantity = parseInt(quantityInput.value);
            const total = currentService.price * quantity;
            totalCostSpan.textContent = total.toFixed(2);
            console.log('Total calculated:', total);
        } else {
            totalCostSpan.textContent = '0.00';
        }
    }

    // Load categories
    async function loadCategories() {
        try {
            const response = await fetch('/api/services/categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const categories = await response.json();
                console.log('Categories loaded:', categories);
                
                categorySelect.innerHTML = '<option value="">Select a category</option>' +
                    categories.map(category => 
                        `<option value="${category}">${category}</option>`
                    ).join('');
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Load services for category
    async function loadServices(category) {
        try {
            console.log('Loading services for category:', category);
            const response = await fetch(`/api/services/category/${category}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const services = await response.json();
                console.log('Services loaded:', services);
                
                serviceSelect.innerHTML = '<option value="">Select a service</option>' +
                    services.map(service => 
                        `<option value="${service._id}">${service.name}</option>`
                    ).join('');

                // Reset service details when new category is selected
                serviceDescription.textContent = 'Select a service to see its description';
                servicePrice.textContent = '0.00';
                currentService = null;
                calculateTotal();
            }
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    // Load service details
    async function loadServiceDetails(serviceId) {
        try {
            console.log('Loading service details for ID:', serviceId);
            const response = await fetch(`/api/services/service/${serviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const service = await response.json();
                console.log('Service details loaded:', service);

                // Update UI with service details
                serviceDescription.textContent = service.description;
                servicePrice.textContent = service.price.toFixed(2);
                currentService = service;
                // Set quantity input constraints
            quantityInput.min = 1;
            quantityInput.max = 1;  // Force max quantity to 1
            quantityInput.value = 1; // Set default value to 1
                
                calculateTotal();
            } else {
                console.error('Failed to load service details:', response.statusText);
                serviceDescription.textContent = 'Error loading service details';
                servicePrice.textContent = '0.00';
                currentService = null;
            }
        } catch (error) {
            console.error('Error loading service details:', error);
            serviceDescription.textContent = 'Error loading service details';
            servicePrice.textContent = '0.00';
            currentService = null;
        }
    }

     // Load user data
     async function loadUserData() {
        try {
            const response = await fetch('/api/auth/user-data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                userBalanceSpan.textContent = data.user.balance.toFixed(2);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // Load orders
    async function loadOrders() {
        try {
            const response = await fetch('/api/orders/my-orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    }

    // Display orders
    function displayOrders(orders) {
        if (!ordersContainer) return;

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found</p>';
            return;
        }

        const ordersList = orders.map(order => `
            <div class="order-item">
                <h4>Order #${order._id.substr(-6)}</h4>
                <div class="order-details">
                    <p><strong>Service:</strong> ${order.service.name}</p>
                    <p><strong>Quantity:</strong> ${order.quantity}</p>
                    <p><strong>Total Cost:</strong> $${order.totalCost.toFixed(2)}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    <p><strong>Link:</strong> ${order.link}</p>
                    <p><strong>Message:</strong> <span class="message-status">${order.message || 'Pending'}</span></p>
                    <p><strong>Login Details:</strong> <span class="login-details">${order.loginDetails || 'Pending'}</span></p>
                </div>
            </div>
        `).join('');

        ordersContainer.innerHTML = ordersList;
    }

    // Event Listeners
    categorySelect.addEventListener('change', (e) => {
        const category = e.target.value;
        console.log('Category selected:', category);
        if (category) {
            loadServices(category);
        } else {
            serviceSelect.innerHTML = '<option value="">Select a service</option>';
            serviceDescription.textContent = 'Select a service to see its description';
            servicePrice.textContent = '0.00';
            currentService = null;
            calculateTotal();
        }
    });

    serviceSelect.addEventListener('change', (e) => {
        const serviceId = e.target.value;
        console.log('Service selected:', serviceId);
        if (serviceId) {
            loadServiceDetails(serviceId);
        } else {
            serviceDescription.textContent = 'Select a service to see its description';
            servicePrice.textContent = '0.00';
            currentService = null;
            calculateTotal();
        }
    });

    quantityInput.addEventListener('input', calculateTotal);

    // Order form submission
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!currentService) {
            showMessage('Please select a service first', 'error');
            return;
        }

        if (!linkInput.value.trim()) {
            showMessage('Please provide a valid link', 'error');
            return;
        }

        try {
            isSubmitting = true;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Placing Order...';

            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    serviceId: currentService._id,
                    quantity: parseInt(quantityInput.value),
                    link: linkInput.value.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Order placed successfully!', 'success');
                userBalanceSpan.textContent = data.newBalance.toFixed(2);
                orderForm.reset();
                serviceSelect.value = '';
                serviceDescription.textContent = 'Select a service to see its description';
                servicePrice.textContent = '0.00';
                totalCostSpan.textContent = '0.00';
                currentService = null;
                loadOrders();
            } else {
                showMessage(data.message || 'Error placing order', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showMessage('Error placing order. Please try again.', 'error');
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            submitButton.innerHTML = 'Place Order';
        }
    });

    // Initialize everything
    loadUserData();
    loadOrders();
    loadCategories();
});