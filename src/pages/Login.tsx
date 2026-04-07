import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { demoUsers } from "../utils/demoUsers";
import { useAppDispatch } from "../hooks/reduxHooks";
import { loginSuccess } from "../features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "customer" | "admin" | "delivery"
  >("customer");
  const [error, setError] = useState("");

  const fillDemoUser = (role: "customer" | "admin" | "delivery") => {
    const user = demoUsers[role];

    setEmail(user.email);
    setPassword(user.password);
    setSelectedRole(role);
    setError("");
  };

  const redirectByRole = (role: "customer" | "admin" | "delivery") => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "delivery":
        navigate("/orders");
        break;
      default:
        navigate("/");
    }
  };

  const handleLogin = async () => {
    try {
      setError("");

      await loginUser(email, password);

      // detect role from demo users
      const matchedUser = Object.values(demoUsers).find(
        (user) => user.email === email,
      );

      const role = matchedUser?.role || selectedRole;

      dispatch(
        loginSuccess({
          email,
          role,
          name: matchedUser?.name || "User",
        }),
      );

      redirectByRole(role);
    } catch (error) {
      setError("Invalid credentials");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">AquaDrop Login</h1>

        {/* Demo users */}
        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <h2 className="font-semibold mb-2">Demo Login Roles</h2>

          <p className="text-sm">👤 Customer → Home</p>
          <p className="text-sm">🛠️ Admin → Inventory</p>
          <p className="text-sm">🚚 Delivery → Orders</p>
        </div>

        {/* Role buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => fillDemoUser("customer")}
            className="bg-gray-200 rounded-lg py-2">
            Customer
          </button>

          <button
            onClick={() => fillDemoUser("admin")}
            className="bg-gray-200 rounded-lg py-2">
            Admin
          </button>

          <button
            onClick={() => fillDemoUser("delivery")}
            className="bg-gray-200 rounded-lg py-2">
            Delivery
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium">
          Login as {selectedRole}
        </button>
      </div>
    </div>
  );
};

export default Login;
