// src/pages/BlogPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  synopsis: string;
  featuredImageUrl: string;
  content: string;
  createdAt: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/blogs", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // ALWAYS ensure blogs is an array
      const data = response.data;
      const blogList = Array.isArray(data) ? data : data.blogs;

      setBlogs(blogList || []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading blogs...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 50 }}>{error}</p>
    );

  if (blogs.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        No blogs available.
      </p>
    );

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>All Blogs</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {blog.featuredImageUrl && (
              <img
                src={blog.featuredImageUrl}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: 16 }}>
              <h3 style={{ margin: 0 }}>{blog.title}</h3>
              <small style={{ color: "#666" }}>{blog.synopsis}</small>

              <p style={{ marginTop: 8 }}>
                {blog.content.length > 120
                  ? blog.content.substring(0, 120) + "..."
                  : blog.content}
              </p>

              <small style={{ color: "#999" }}>
                Published: {new Date(blog.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
