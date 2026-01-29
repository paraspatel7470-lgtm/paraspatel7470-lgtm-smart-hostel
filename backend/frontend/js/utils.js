function logout() {
  localStorage.clear();
  window.location.href = "../index.html";
}

<button onclick="logout()">Logout</button>
