import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      // 1️⃣ Login request
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      })

      const token = res.data.access_token

      // 2️⃣ Store token
      localStorage.setItem("access_token", token)

      // 3️⃣ Immediately fetch user data
      const me = await axios.get("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 4️⃣ Store user in context
      setUser(me.data)

      // 5️⃣ Navigate to protected area
      navigate("/app")

    } catch (err) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-gray-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-gray-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}