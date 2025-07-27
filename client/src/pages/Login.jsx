import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../States/slice.js";
import Register from "../components/Register";
import { LogIn, UserPlus, MessageCircle, AlertCircle, Loader } from "lucide-react";

function Login() {
  const [pageType, setPageType] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_SERVER_URL;

  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const registerSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    name: yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
  });

  const initialValuesLogin = { email: "", password: "" };
  const initialValuesRegister = { email: "", password: "", name: "" };

  async function handleRegister(values, onSubmitProps) {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      onSubmitProps.resetForm();
      setPageType("login");
      setError("Registration successful! Please login.");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(values, onSubmitProps) {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.user && data.token) {
        dispatch(setUser(data.user));
        dispatch(setToken(data.token));
        onSubmitProps.resetForm();
        navigate("/chat");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(values, onSubmitProps) {
    if (isLogin) {
      await handleLogin(values, onSubmitProps);
    } else {
      await handleRegister(values, onSubmitProps);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex justify-center items-center px-4">
      <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <MessageCircle className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome to Chat
          </h1>
          <div className="flex items-center justify-center space-x-2">
            {isLogin ? <LogIn size={20} className="text-blue-400" /> : <UserPlus size={20} className="text-blue-400" />}
            <h2 className="text-lg font-semibold text-gray-300">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <Register
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                />
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  placeholder="Enter your email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  type="email"
                  disabled={isLoading}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                {touched.email && errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  placeholder="Enter your password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  type="password"
                  disabled={isLoading}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                />
                {touched.password && errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                  </>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    resetForm();
                    setError("");
                  }}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 text-sm underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLogin
                    ? "Don't have an account? Create one"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;