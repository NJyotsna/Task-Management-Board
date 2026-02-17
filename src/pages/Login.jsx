import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function Login() {
  const { login } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    if (email === "intern@demo.com" && password === "intern123") {
      login()
      navigate("/board")
    } else {
      setError("Invalid email or password")
      setMessage("")
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email first")
      return
    }

    setError("")
    setMessage("Password reset link sent to your email (Demo Feature)")
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task Board Login</h2>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <button type="submit" style={styles.button}>
            Login
          </button>

          <p style={styles.forgot} onClick={handleForgotPassword}>
            Forgot Password?
          </p>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #667eea, #764ba2)"
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    width: "350px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
  },
  forgot: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#667eea",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px"
  },
  success: {
    color: "green",
    fontSize: "13px",
    marginBottom: "10px"
  }
}

export default Login
