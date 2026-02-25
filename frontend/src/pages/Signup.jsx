import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8000/auth/signup", {
        username: name,
        email,
        password,
      });

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      />

      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

      {/* Signup Card */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <form
          onSubmit={handleSignup}
          className="bg-[#181818]/95 backdrop-blur-lg 
                   border border-[#2A2A2A] 
                   p-8 rounded-2xl w-96 space-y-5 
                   shadow-[0_0_60px_rgba(0,0,0,0.7)]"
        >
          <h2 className="text-2xl font-semibold text-center tracking-wide">
            Create Account
          </h2>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center">{success}</div>
          )}

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2.5 
                     bg-[#222222] 
                     border border-[#2A2A2A] 
                     rounded-lg 
                     focus:outline-none 
                     focus:ring-1 
                     focus:ring-blue-600 
                     transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2.5 
                     bg-[#222222] 
                     border border-[#2A2A2A] 
                     rounded-lg 
                     focus:outline-none 
                     focus:ring-1 
                     focus:ring-blue-600 
                     transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2.5 
                     bg-[#222222] 
                     border border-[#2A2A2A] 
                     rounded-lg 
                     focus:outline-none 
                     focus:ring-1 
                     focus:ring-blue-600 
                     transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full 
                     bg-blue-600 
                     hover:bg-blue-700 
                     active:scale-[0.98] 
                     p-2.5 
                     rounded-lg 
                     cursor-pointer
                     transition-all duration-150"
          >
            Create Account
          </button>

          <p className="text-sm text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
