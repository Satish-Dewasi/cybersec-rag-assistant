import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

url = f"https://generativelanguage.googleapis.com/v1/models?key={API_KEY}"

response = requests.get(url)

print("Status Code:", response.status_code)
print("Response:")
print(response.text)