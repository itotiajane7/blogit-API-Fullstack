import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile"; 
import BlogDashboard from "./pages/BlogDashboard";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import useUserStore from "./store/useAuthStore";

function App() {
  const user = useUserStore();
  if (user) {
    console.log("User is logged in:", user);
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/blog" element={user ? <BlogDashboard /> : <Navigate to="/login" />} />
        <Route path="/add-blog" element={user ? <AddBlog /> : <Navigate to="/login" />} />
        <Route path="/blogs" element={user ? <BlogPage /> : <Navigate to="/login" />} />

        {/* Optional: catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
