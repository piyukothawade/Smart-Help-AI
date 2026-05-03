import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { registerUser } from "../services/authService";
import { useNotification } from "../../../context/NotificationContext";

function Register() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleRegister = async () => {
  try {
    const payload = {
      ...form,
      email: form.email.toLowerCase().trim(),
    };

    await registerUser(payload);

    addNotification("🎉 Registered successfully!");
    navigate("/login");

  } catch (err) {
    addNotification(err.response?.data?.message || "Register failed");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-[350px] text-black">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Account 🚀
        </h2>

        <div className="space-y-4">

          <Input
            name="name"
            value={form.name}            // ✅ IMPORTANT
            placeholder="Full Name"
            onChange={handleChange}
          />

          <Input
            name="email"
            value={form.email}           // ✅ IMPORTANT
            placeholder="Email"
            onChange={handleChange}
          />

          <Input
            name="password"
            value={form.password}        // ✅ IMPORTANT
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <Button onClick={handleRegister} className="w-full">
            Register
          </Button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;