// Check if user is logged in
const loggedInUser = localStorage.getItem("loggedInUser")

if (!loggedInUser) {
  // Not logged in, redirect to login page
  window.location.href = "login.html"
} else {
  // Display username
  document.getElementById("displayUsername").textContent = loggedInUser
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser")
  window.location.href = "login.html"
})
