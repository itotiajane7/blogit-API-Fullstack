import React, { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  synopsis: string;
  featureImageUrl: string;
  content: string;
  createdAt: string;
}

const BlogDashboard: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); 

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/blogs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlogs(response.data);
    } catch (err) {
      console.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>My Blogs</h2>

      <button
        onClick={() => (window.location.href = "/add-blog")}
        style={{
          background: "black",
          color: "white",
          padding: "8px 16px",
          marginBottom: "20px",
        }}
      >
        + Add New Blog
      </button>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ccc",
              padding: "12px 0",
            }}
          >
            {blog.featureImageUrl && (
              <img
                src={blog.featureImageUrl}
                alt=""
                width="80"
                height="60"
                style={{ objectFit: "cover", marginRight: 16 }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{blog.title}</h3>
              <small>{blog.synopsis}</small>
            </div>

            <button
              onClick={() =>
                (window.location.href = `/edit-blog/${blog._id}`)
              }
              style={{
                background: "gray",
                color: "white",
                padding: "6px 12px",
                marginRight: "10px",
              }}
            >
              Edit
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default BlogDashboard;
