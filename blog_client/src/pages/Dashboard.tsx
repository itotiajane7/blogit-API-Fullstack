import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function Dashboard() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Remove token cookie
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard 🎉</h1>
      <p className="text-gray-600">You are successfully logged in.</p>

      <Button onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default Dashboard;
