// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  dateJoined: string;
  lastupdate?: string;
}

interface Blog {
  title: string;
  synopsis: string;
  featuredImageUrl?: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setMessage("You are not logged in.");
      setLoading(false);
      return;
    }

    const loadEverything = async () => {
      await fetchProfile();
      await fetchUserBlogs();
      setLoading(false);
    };

    loadEverything();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Profile API response:", res.data);

      // Adjust based on your backend response shape
      const profileData = res.data.user || res.data.profile || res.data;
      setUser(profileData);

    } catch (error: any) {
      if (error.response) {
        console.error("Backend error:", error.response.status, error.response.data);
        setMessage(error.response.data.message || "Failed to load profile");
      } else if (error.request) {
        console.error("No response from backend:", error.request);
        setMessage("Failed to load profile: No response from server");
      } else {
        console.error("Request setup error:", error.message);
        setMessage("Failed to load profile: " + error.message);
      }
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/profile/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Blogs API response:", res.data);
      setBlogs(res.data.blogs || res.data);
    } catch (error) {
      console.error("Blogs API error:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await axios.put(
        "http://localhost:5001/api/profile/update",
        {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          emailAddress: user.emailAddress,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message || "Profile updated successfully");
    } catch (err: any) {
      if (err.response) {
        console.error("Update API error:", err.response.status, err.response.data);
        setMessage(err.response.data.message || "Failed to update profile");
      } else {
        console.error("Update request error:", err.message);
        setMessage("Failed to update profile: " + err.message);
      }
    }
  };

  if (loading) return <p className="mt-10 ml-5">Loading...</p>;
  if (!user) return <p className="mt-10 ml-5 text-red-600">{message || "Profile not found."}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Profile Page</h1>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      {/* Profile Update Form */}
      <form onSubmit={handleUpdate} className="space-y-4 mb-8">
        <div>
          <label className="block font-semibold">First Name:</label>
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Last Name:</label>
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Username:</label>
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Email Address:</label>
          <input
            type="email"
            value={user.emailAddress}
            onChange={(e) => setUser({ ...user, emailAddress: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button className="bg-black text-white px-4 py-2 rounded" type="submit">
          Update Profile
        </button>
      </form>

      {/* User Blogs */}
      <h2 className="text-2xl font-semibold mb-4">My Blogs</h2>

      {blogs.length === 0 ? (
        <p>You have not written any blogs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((blog, idx) => (
            <div key={idx} className="border rounded p-4 shadow-sm">
              {blog.featuredImageUrl && (
                <img
                  src={blog.featuredImageUrl}
                  alt={blog.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              )}
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p>{blog.synopsis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
