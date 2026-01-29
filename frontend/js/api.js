const API_BASE = "http://localhost:5000/api";

async function apiRequest(endpoint, method, data = null, token = null) {
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = "Bearer " + token;
  }

  const res = await fetch(API_BASE + endpoint, {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  });

  return res.json();
}
