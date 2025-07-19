function Register({
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
}) {
    return (
        <div>
            <input
                placeholder="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name || ""}
                name="name"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-400 mb-2"
            />
            {touched.name && errors.name && (
                <p className="text-red-400 text-xs">{errors.name}</p>
            )}
        </div>
    );
}

export default Register;