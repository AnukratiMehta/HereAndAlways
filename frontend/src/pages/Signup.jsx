// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSignup = async (e) => {
  e.preventDefault();
  console.log("Submitting signup form with:", form); // 👈 Add this

  try {
    const res = await api.post("/auth/register", {
      ...form,
      role: "LEGACY_OWNER",
    });
    console.log("Signup response:", res); // 👈 Add this
    const { token } = res.data;
    localStorage.setItem("jwt", token);
    navigate("/dashboard");
  } catch (err) {
    console.error("Signup error:", err); // 👈 Add this
    setError("Sign up failed. Try a different email.");
  }
};


  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8081/oauth2/authorize/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 shadow-md rounded w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-brandRose text-white py-2 rounded hover:bg-rose-600"
        >
          Sign Up
        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full border border-gray-300 py-2 rounded mt-2"
        >
          Sign Up with Google
        </button>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-brandRose hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
