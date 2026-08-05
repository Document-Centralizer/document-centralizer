import requests

base_url = "http://localhost:8080/api"

# 1. Register a user
register_data = {
    "firstName": "Test",
    "lastName": "User",
    "email": "testpayment@example.com",
    "password": "password123",
    "mobileNumber": "9999999999",
    "role": "USER"
}
requests.post(f"{base_url}/auth/register", json=register_data)

# 2. Login to get token
login_data = {
    "email": "testpayment@example.com",
    "password": "password123"
}
r = requests.post(f"{base_url}/auth/login", json=login_data)
token = r.json().get("token")

# 3. Create order
headers = {"Authorization": f"Bearer {token}"}
r2 = requests.post(f"{base_url}/payment/create-order", headers=headers)
print("Create order response:", r2.status_code, r2.text)

