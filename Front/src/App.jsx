import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <main className="flex flex-col min-h-screen">
          <Outlet />
          <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
