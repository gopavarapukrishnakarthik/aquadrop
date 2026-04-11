import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { demoUsers } from "../utils/demoUsers";
import { useAppDispatch } from "../hooks/reduxHooks";
import { loginSuccess } from "../features/auth/authSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="min-h-screen relative">
      {/* Background */}
      <img
        src="/aquadrop/aquabg.png"
        alt="AquaDrop Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Login Form */}
      <div className="relative min-h-screen flex items-center px-6 md:px-16">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl border-0 py-10 px-5">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              AquaDrop Login
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Demo Roles */}
            <Card className="bg-blue-50 border-none shadow-none">
              <CardContent className="space-y-1">
                <h2 className="font-semibold">Demo Login Roles</h2>
                <p className="text-sm">👤 Customer → Home</p>
                <p className="text-sm">🛠️ Admin → Inventory</p>
                <p className="text-sm">🚚 Delivery → Orders</p>
              </CardContent>
            </Card>

            {/* Role Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => fillDemoUser("customer")}>
                Customer
              </Button>

              <Button variant="outline" onClick={() => fillDemoUser("admin")}>
                Admin
              </Button>

              <Button
                variant="outline"
                onClick={() => fillDemoUser("delivery")}>
                Delivery
              </Button>
            </div>

            {/* Inputs */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Button */}
            <div className="flex justify-center">
              <Button className="w-52" onClick={handleLogin}>
                Login as {selectedRole}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
