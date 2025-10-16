// Replace this with your Google Apps Script Web App URL
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyd4I5TYzjWau1o0NddNWSlqw33iXybJ5oCviNZVWRJ1cmToMkziQsH52_s6WYAuRxw5w/exec"

const form = document.getElementById("registerForm")
const messageDiv = document.getElementById("message")
const submitBtn = document.getElementById("submitBtn")
const btnText = document.getElementById("btnText")
const btnLoader = document.getElementById("btnLoader")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const username = document.getElementById("username").value.trim()
  const email = document.getElementById("email").value.trim()
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Clear previous messages
  messageDiv.className = "message"
  messageDiv.textContent = ""

  // Validate passwords match
  if (password !== confirmPassword) {
    showMessage("Passwords do not match!", "error")
    return
  }
  // Disable form and show loader
  setLoading(true)

  try {
    console.log("[v0] Sending registration request to:", SCRIPT_URL)
    console.log("[v0] Data:", { action: "register", username, email })

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "register",
        username: username,
        email: email,
        password: password,
      }),
    })

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response ok:", response.ok)

    const contentType = response.headers.get("content-type")
    console.log("[v0] Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.error("[v0] Non-JSON response:", text)
      showMessage("Server error: Expected JSON response. Check console for details.", "error")
      setLoading(false)
      return
    }

    const result = await response.json()
    console.log("[v0] Result:", result)

    if (result.success) {
      showMessage("Account created successfully! Redirecting to login...", "success")

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html"
      }, 2000)
    } else {
      showMessage(result.message || "Failed to create account. Please try again.", "error")
      setLoading(false)
    }
  } catch (error) {
    console.error("[v0] Error:", error)
    showMessage(`Error: ${error.message}. Check console for details.`, "error")
    setLoading(false)
  }
})

function showMessage(text, type) {
  messageDiv.textContent = text
  messageDiv.className = `message ${type}`
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading
  btnText.style.display = isLoading ? "none" : "inline"
  btnLoader.style.display = isLoading ? "inline-block" : "none"
}
