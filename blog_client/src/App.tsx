import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile"; 
import BlogDashboard from "./pages/BlogDashboard";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import EditBlog from "./pages/EditBlog"; 
import ViewBlog from "./pages/ViewBlog"; // ADD THIS IMPORT
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
        {/* Default route */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

        {/* Auth routes (no auth required) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes (auth required) */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/blog" element={user ? <BlogDashboard /> : <Navigate to="/login" />} />
        <Route path="/add-blog" element={user ? <AddBlog /> : <Navigate to="/login" />} />
        <Route path="/blogs" element={user ? <BlogPage /> : <Navigate to="/login" />} />

        {/* Blog management routes (auth required) */}
        <Route path="/edit-blog/:id" element={user ? <EditBlog /> : <Navigate to="/login" />} />
        <Route path="/view-blog/:id" element={user ? <ViewBlog /> : <Navigate to="/login" />} /> {/* ADD THIS LINE */}

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;