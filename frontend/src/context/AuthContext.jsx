import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")

    if (!token) {
      setLoading(false)
      return
    }

    axios
      .get("http://localhost:8000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data)
      })
      .catch(() => {
        localStorage.removeItem("access_token")
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const logout = () => {
    localStorage.removeItem("access_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}