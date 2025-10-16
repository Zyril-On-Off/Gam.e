const loginForm = document.getElementById("loginForm")
const loginBtn = document.getElementById("loginBtn")
const errorMessage = document.getElementById("errorMessage")

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyd4I5TYzjWau1o0NddNWSlqw33iXybJ5oCviNZVWRJ1cmToMkziQsH52_s6WYAuRxw5w/exec"

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value

  // Clear previous error
  errorMessage.textContent = ""

  // Show loading state
  loginBtn.classList.add("loading")
  loginBtn.disabled = true

  try {
    console.log("[v0] Sending login request to:", SCRIPT_URL)
    console.log("[v0] Username:", username)

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "login",
        username: username,
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
      errorMessage.textContent = "Server error: Expected JSON response. Check console for details."
      return
    }

    const result = await response.json()
    console.log("[v0] Result:", result)

    if (result.success) {
      // Store user info in localStorage
      localStorage.setItem("loggedInUser", username)

      // Redirect to home page
      window.location.href = "home.html"
    } else {
      errorMessage.textContent = result.message || "Invalid username or password"
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    errorMessage.textContent = `Error: ${error.message}. Check console for details.`
  } finally {
    loginBtn.classList.remove("loading")
    loginBtn.disabled = false
  }
})
