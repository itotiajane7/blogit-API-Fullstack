import { useState, useEffect } from "react";
import useUserStore from "../store/useAuthStore";

interface Blog {
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  createdAt: string;
}

const Profile = () => {
  const { 
    firstName, 
    lastName, 
    username, 
    emailAddress, 
    dateJoined, 
    lastUpdated,
    updateProfile 
  } = useUserStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    username: username || "",
    emailAddress: emailAddress || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE_URL = "http://localhost:5001";

  useEffect(() => {
    if (emailAddress) {
      fetchUserBlogs();
    }
  }, [emailAddress]);

  const fetchUserBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(" Token being sent:", token);
      
      const response = await fetch(`${API_BASE_URL}/api/user/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("📡 Blogs response status:", response.status);
      
      if (response.ok) {
        const blogs = await response.json();
        setUserBlogs(blogs);
      }
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      console.log(" Updating profile...");
      console.log("URL:", `${API_BASE_URL}/api/user/profile`);
      console.log("Token:", token);
      console.log("Data:", formData);
      
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log(" Update response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log(" Update successful:", result);
        
        updateProfile(formData);
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error(" Update failed:", errorData);
        setMessage(errorData.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error(" Network error:", error);
      setMessage(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Password updated successfully!");
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update password");
      }
    } catch (error: any) {
      setMessage(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!emailAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">You need to log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-8">

      {}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Profile Page</h1>
          <div className="space-x-4">
            {!isEditing && !isChangingPassword && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>

        {message && (
          <div
            className={`p-4 mb-4 rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) =>
                  setFormData({ ...formData, emailAddress: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: firstName || "",
                    lastName: lastName || "",
                    username: username || "",
                    emailAddress: emailAddress || "",
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : isChangingPassword ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>First Name:</strong> {firstName}</p>
              <p><strong>Last Name:</strong> {lastName}</p>
              <p><strong>Username:</strong> {username}</p>
              <p><strong>Email:</strong> {emailAddress}</p>
              <p><strong>Joined:</strong> {dateJoined ? new Date(dateJoined).toLocaleDateString() : 'N/A'}</p>
              {lastUpdated && (
                <p><strong>Last Updated:</strong> {new Date(lastUpdated).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {}
      {userBlogs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Blogs</h2>
          <div className="grid gap-4">
            {userBlogs.map((blog, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-2">{blog.synopsis}</p>
                {blog.featuredImageUrl && (
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                )}
                <p className="text-sm text-gray-500">
                  Created: {new Date(blog.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;