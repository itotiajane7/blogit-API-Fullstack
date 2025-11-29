import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import useUserStore from '../store/useAuthStore';

function Dashboard() {
  const navigate = useNavigate();
  // read flattened fields from the store (matches your current store shape)
  const firstName = useUserStore((state) => state.firstName);

  // Logout function
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    
    // Clear user from zustand store
    useUserStore.getState().clearUser();
    
    // Navigate to login
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard {firstName || "User"}</h1>
      <p className="text-gray-600">You are successfully logged in.</p>

      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;