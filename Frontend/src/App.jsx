import AppRoutes from "./routes/AppRoutes";
import { ChatProvider } from "./features/chat/context/ChatContext";
import { TicketProvider } from "./features/tickets/context/TicketContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <TicketProvider>
        <ChatProvider>
          <AppRoutes />
        </ChatProvider>
      </TicketProvider>
    </NotificationProvider>
  );
}

export default App;