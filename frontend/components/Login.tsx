"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const { handleLogin, handleSignup } = useAuth();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasSpecialChar &&
        hasNumber &&
        hasUpperCase &&
        hasLowerCase,
      errors: {
        length: password.length < minLength,
        specialChar: !hasSpecialChar,
        number: !hasNumber,
        upperCase: !hasUpperCase,
        lowerCase: !hasLowerCase,
      },
    };
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }

      const { isValid, errors } = validatePassword(formData.password);
      if (!isValid) {
        let errorMessage = "Password must contain:\n";
        if (errors.length) errorMessage += "- At least 8 characters\n";
        if (errors.specialChar)
          errorMessage +=
            '- At least one special character (!@#$%^&*(),.?":{}|<>)\n';
        if (errors.number) errorMessage += "- At least one number\n";
        if (errors.upperCase)
          errorMessage += "- At least one uppercase letter\n";
        if (errors.lowerCase)
          errorMessage += "- At least one lowercase letter\n";
        alert(errorMessage);
        return;
      }
      handleSignup(
        formData.fullName,
        formData.email,
        formData.password,
        formData.role
      );
    } else {
      handleLogin(formData.email, formData.password);
    }
   
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">TaskFlow</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {isSignup ? "Create a new account" : "Sign in to your account"}
        </h2>
        <p className="text-gray-500 mb-6">
          Or{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup
              ? "sign in to your existing account"
              : "create a new account"}
          </button>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {isSignup && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          )}
          {isSignup && (
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
              aria-label="Select user role"
            >
              <option value="" disabled>
                Select user role
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          )}
          {/* {!isSignup && (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot your password?
              </a>
            </div>
          )} */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {isSignup ? "Create account" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
