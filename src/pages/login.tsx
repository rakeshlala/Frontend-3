import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

const Login = () => {
  const { dark } = useTheme() // ✅ theme
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Email and Password required")
      return
    }

    setError("")

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      })

      if (res.data.success) {
        navigate("/BankRegistration")
      } else {
        setError(res.data.message || "Login failed")
      }
    } catch (err) {
      setError("Server error during login")
    }
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center vh-100 ${
        dark ? "bg-dark" : "bg-light"
      }`}
    >
      <form
        onSubmit={handleLogin}
        className={`p-4 rounded shadow ${
          dark ? "bg-black text-white" : "bg-white text-dark"
        }`}
        style={{ width: "360px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${
              dark ? "bg-secondary text-white" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className={`form-control ${
              dark ? "bg-secondary text-white" : ""
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            style={{
              position: "absolute",
              right: "10px",
              top: "38px",
              cursor: "pointer",
              color: dark ? "#ccc" : "#555",
            }}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-2">
          Login
        </button>

        <p className="mt-3 text-center">
          Don't have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "#0d6efd" }}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  )
}

export default Login
