import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-14 bg-white shadow flex items-center justify-between px-6">

      <h2 className="font-semibold text-lg">
        Welcome, {user?.name || "User"}
      </h2>

      <div className="flex items-center gap-4">

        <span className="text-sm text-gray-500">
          {user?.role}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;