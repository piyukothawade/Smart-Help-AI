const Input = ({ name, value, onChange, placeholder, type = "text" }) => {
  return (
    <input
      name={name}         // ✅ REQUIRED
      value={value}       // ✅ REQUIRED
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      className="w-full border px-3 py-2 rounded"
    />
  );
};

export default Input;