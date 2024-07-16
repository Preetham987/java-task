document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customer-form');
    const tableBody = document.querySelector('#customer-table tbody');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const customer = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            street: document.getElementById('street').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
        };

        const customerId = document.getElementById('customer-id').value;
        if (customerId) {
            await updateCustomer(customerId, customer);
        } else {
            await createCustomer(customer);
        }
        form.reset();
        loadCustomers();
    });

    async function loadCustomers() {
        const response = await fetch('/api/customers?page=0&size=10');
        const data = await response.json();
        tableBody.innerHTML = '';
        data.content.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.firstName}</td>
                <td>${customer.lastName}</td>
                <td>${customer.street}</td>
                <td>${customer.address}</td>
                <td>${customer.city}</td>
                <td>${customer.state}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <button onclick="editCustomer(${customer.id})">Edit</button>
                    <button onclick="deleteCustomer(${customer.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    async function createCustomer(customer) {
        await fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
    }

    async function updateCustomer(id, customer) {
        await fetch(`/api/customers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        });
    }

    async function deleteCustomer(id) {
        await fetch(`/api/customers/${id}`, {
            method: 'DELETE'
        });
        loadCustomers();
    }

    window.editCustomer = async (id) => {
        const response = await fetch(`/api/customers/${id}`);
        const customer = await response.json();
        document.getElementById('customer-id').value = customer.id;
        document.getElementById('first-name').value = customer.firstName;
        document.getElementById('last-name').value = customer.lastName;
        document.getElementById('street').value = customer.street;
        document.getElementById('address').value = customer.address;
        document.getElementById('city').value = customer.city;
        document.getElementById('state').value = customer.state;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone;
    };

    loadCustomers();
});
