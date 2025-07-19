import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "../States/slice.js";
import Register from "../components/Register";
import { LogIn, UserPlus } from "lucide-react";

function Login() {
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl=import.meta.env.VITE_SERVER_URL;

  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().required("Required"),
  });

  const registerSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Required"),
    password: yup.string().required("Required"),
    name: yup.string().required("Required"),
  });

  const initialValuesLogin = { email: "", password: "" };
  const initialValuesRegister = { email: "", password: "", name: "" };

  async function handleRegister(values, onSubmitProps) {
    const response = await fetch(`${apiUrl}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const registeredUser = await response.json();
    onSubmitProps.resetForm();
    if (registeredUser) setPageType("login");
  }

  async function handleLogin(values, onSubmitProps) {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const loginUser = await response.json();
    dispatch(setUser(loginUser.user));
    dispatch(setToken(loginUser.token));
    console.log(loginUser)
    onSubmitProps.resetForm();
    if (loginUser) navigate("/chat");
  }

  async function handleFormSubmit(values, onSubmitProps) {
    if (isLogin) {
      await handleLogin(values, onSubmitProps);
    } else {
      await handleRegister(values, onSubmitProps);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-black/70 p-6 rounded-2xl shadow-lg w-full max-w-sm text-white">
        <div className="flex items-center space-x-2 mb-6 justify-center">
          {isLogin ? <LogIn size={28} /> : <UserPlus size={28} />}
          <h2 className="text-xl font-semibold">{isLogin ? "Login" : "Register"}</h2>
        </div>
        <Formik
          onSubmit={handleFormSubmit}
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
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
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <input
                  placeholder="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  type="email"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-400"
                />
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  type="password"
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-400"
                />
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white py-2 rounded transition font-semibold"
              >
                {isLogin ? "Login" : "Register"}
              </button>
              <p
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                className="text-center text-sm text-gray-300 hover:text-orange-400 cursor-pointer mt-2"
              >
                {isLogin
                  ? "Don't have an account? Sign up!"
                  : "Already have an account? Sign in!"}
              </p>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;