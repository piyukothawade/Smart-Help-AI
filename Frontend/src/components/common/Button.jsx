import { motion } from "framer-motion";

const Button = ({ children, onClick, className }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-4 py-2 rounded bg-purple-500 text-white ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;