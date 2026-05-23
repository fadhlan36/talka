import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Panggil API Register
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/register`, form);
      alert("Registration success! Please login.");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3">
      <Input
        placeholder="Full Name"
        className="h-14 bg-zinc-900 border-none text-white rounded-2xl placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 outline-none"
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        required
      />
      <Input
        placeholder="Username"
        className="h-14 bg-zinc-900 border-none text-white rounded-2xl placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 outline-none"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />
      <Input
        placeholder="Email"
        type="email"
        className="h-14 bg-zinc-900 border-none text-white rounded-2xl placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 outline-none"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <Input
        placeholder="Password"
        type="password"
        className="h-14 bg-zinc-900 border-none text-white rounded-2xl placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-700 outline-none"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-white text-black font-bold rounded-2xl mt-4 active:scale-[0.98] transition-transform hover:bg-zinc-200"
      >
        {loading ? "Creating account..." : "Sign up"}
      </Button>
    </form>
  );
}
