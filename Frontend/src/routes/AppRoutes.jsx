import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ChatPage from "../features/chat/pages/ChatPage";
import MyTickets from "../features/tickets/pages/MyTickets";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import ManageTickets from "../features/admin/pages/ManageTickets";
import AdminTicketDetails from "../features/admin/pages/AdminTicketDetails";
import ProtectedRoute from "../routes/ProtectedRoute";
import TicketDetails from "../features/tickets/pages/TicketDetails";


const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/"
          element={<ProtectedRoute><ChatPage /></ProtectedRoute>}
        />

        <Route
          path="/tickets"
          element={<ProtectedRoute><MyTickets /></ProtectedRoute>}
        />
        <Route 
        path="/tickets/:id"
         element={<ProtectedRoute><TicketDetails /></ProtectedRoute>}
          />


        <Route
          path="/admin"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/tickets"
          element={<ProtectedRoute role="admin"><ManageTickets /></ProtectedRoute>}
        />

        <Route
          path="/admin/tickets/:id"
          element={<ProtectedRoute role="admin"><AdminTicketDetails /></ProtectedRoute>}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;