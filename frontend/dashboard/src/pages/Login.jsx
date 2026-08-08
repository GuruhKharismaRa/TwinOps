import {useState } from "react"
import { useNavigate } from "react-router-dom"
import AppLayout from "@/components/layout/AppLayout"
import { Card } from "@/components/ui/card"
import {toast} from "sonner"
import { motion } from "framer-motion"
import { useAuth } from "@/context/AuthContext.jsx"
export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  // API Call LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate login API call
    const response = await fetch("http://localhost:8001/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
    const data = await response.json()
    if (data.access_token) {
      localStorage.clear()
      localStorage.setItem("access_token", data.access_token)
      await refreshAuth();
      toast.success("Login successful!")
      setTimeout(() => {
        setLoading(false)
        navigate("/")
      }, 1000)
    } else {
      toast.error("Invalid credentials")
      setLoading(false)
    }
  };

  const { refreshAuth } = useAuth();

   return (

        <div className="
            relative
            flex
            items-center
            justify-center
            h-screen
            overflow-hidden
         
        ">
            <div className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_right,#84cc16,transparent_25%),radial-gradient(circle_at_bottom_left,#22c55e,transparent_25%)]
            opacity-30
        " />
      <motion.div initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
            <Card className="
                  relative
                  z-10
                  p-8
                  w-[400px]
                  space-y-4
                  border
                  border-white/10
                  bg-white/2
                  backdrop-blur-xl
                  shadow-2xl
            ">

                <h1 className="
                    text-2xl
                    font-bold
                ">
                    Login
                </h1>

                <input
                    className="
                        border
                        p-2
                        w-full
                    "
                    placeholder="Username"
                    value={username}
                    onChange={(e) =>
                        setUsername(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    className="
                        border
                        p-2
                        w-full
                    "
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="
                        bg-black
                        text-white
                        p-2
                        rounded
                        w-full
                        transition
                        hover:opacity-90
                        disabled:opacity-50
                    "
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

            </Card>
      </motion.div>
      </div>
    );
}