import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { loginUser } from "../services/authService";
import { useNotification } from "../../../context/NotificationContext";

function Login() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const [form, setForm] = useState({
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

 const handleLogin = async () => {
  try {
    const payload = {
      email: form.email.toLowerCase().trim(),
      password: form.password,
    };

    const res = await loginUser(payload);

    // ✅ store full user (includes token)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(res));

    addNotification("✅ Login successful");

    if (res.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    addNotification(err.response?.data?.message || "Login failed");
  }
};
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-500">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl w-[350px] text-black">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Welcome Back 👋
        </h2>

        <div className="space-y-4">

          <Input
            name="email"
            value={form.email}              // ✅ IMPORTANT
            placeholder="Email"
            onChange={handleChange}
          />

          <Input
            name="password"
            value={form.password}           // ✅ IMPORTANT
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;