import { User } from "lucide-react";

function Register({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Full Name
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          placeholder="Enter your full name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.name || ""}
          name="name"
          type="text"
          className="w-full p-3 pl-10 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>
      {touched.name && errors.name && (
        <p className="text-red-400 text-sm mt-1">{errors.name}</p>
      )}
    </div>
  );
}

export default Register;