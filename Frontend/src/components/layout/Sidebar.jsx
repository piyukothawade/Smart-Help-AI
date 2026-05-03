import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageCircle,
  Ticket,
  Shield,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const menu = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Chat", path: "/", icon: MessageCircle },
    { label: "My Tickets", path: "/tickets", icon: Ticket },
  ];

  if (user?.role === "admin") {
    menu.push({ label: "Admin Panel", path: "/admin", icon: Shield });
  }

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-md p-4 flex flex-col justify-between transition-all duration-300`}
    >
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && <h1 className="text-xl font-bold">AI Support</h1>}

          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {menu.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-3 p-2 rounded cursor-pointer ${
                  isActive
                    ? "bg-purple-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 h-full w-1 bg-purple-700 rounded-r"
                  />
                )}

                <Icon size={20} />

                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile */}
      <div className="border-t pt-4 mt-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500 text-white rounded-full p-2">
            <User size={18} />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;