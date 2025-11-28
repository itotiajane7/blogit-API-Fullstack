import React, { useState } from "react";
import axios from "axios";

const AddBlog: React.FC = () => {
  const [title, setTitle] = useState("");
  const [synopsis, setsynopsis] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    // Validation
    if (!title.trim() || !synopsis.trim() || !content.trim()) {
      setMessage("Title, synopsis, and content are required.");
      return;
    }

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    if (!token) {
      setMessage("You are not logged in.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("synopsis", synopsis);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/blogs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Blog created successfully:", response.data);
      setMessage("Blog created successfully!");
      setTitle("");
      setsynopsis("");
      setContent("");
      setImage(null);
    } catch (err: any) {
      console.error("Status:", err.response?.status);
      console.error("Full error response:", err.response?.data);
      console.error("Error message:", err.message);
      
      const errorMsg = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        "Failed to create blog.";
      
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Add Blog</h2>

      {message && (
        <p style={{ 
          padding: 10, 
          marginBottom: 15, 
          backgroundColor: message.includes("successfully") ? "#d4edda" : "#f8d7da",
          color: message.includes("successfully") ? "#155724" : "#721c24",
          borderRadius: 4
        }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />

        <label>Synopsis:</label>
        <input
          type="text"
          value={synopsis}
          onChange={(e) => setsynopsis(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />

        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
          rows={6}
        />

        <label>Featured Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}
        />
        {image && <small style={{ color: "#666" }}>Selected: {image.name}</small>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            borderRadius: 4,
            border: "none",
            marginTop: 10,
          }}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;