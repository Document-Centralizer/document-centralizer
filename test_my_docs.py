import requests

url = "http://localhost:8080/api/documents/my"

# We can bypass JWT if we know how, or we can just assume the issue is known (the user has two accounts or the browser is caching).
