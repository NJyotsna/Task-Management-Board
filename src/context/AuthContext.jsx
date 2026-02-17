import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    if (storedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = () => {
    localStorage.setItem("isAuthenticated", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
