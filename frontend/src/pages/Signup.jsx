import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await axios.post("http://localhost:8000/auth/signup", {
        name,
        email,
        password,
    })

      setSuccess("Account created successfully. Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 1500)

    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Signup failed")
      }
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
      <form
        onSubmit={handleSignup}
        className="bg-gray-900 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm text-center">{success}</div>
        )}

        <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 bg-gray-800 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />

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
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
        >
          Create Account
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}