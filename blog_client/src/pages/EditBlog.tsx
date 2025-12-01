import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [currentImage, setCurrentImage] = useState(""); // OLD public_id
  const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      const blog = res.data;

      setTitle(blog.title);
      setSynopsis(blog.synopsis);
      setContent(blog.content);
      setCurrentImage(blog.featuredImageUrl); // 🔥 THIS WAS WRONG BEFORE!
    } catch (err) {
      setMessage("Failed to load blog");
      console.error(err);
    }
  };

  // ----------------------------
  // Cloudinary Upload (same as AddBlog!)
  // ----------------------------
  const uploadToCloudinary = async (file: File): Promise<string> => {
    setUploading(true);
    setMessage("Uploading image to Cloudinary...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "BlogApp images");
    formData.append("cloud_name", "dif3z0kkk");

    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/dif3z0kkk/image/upload`;

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();
    const data = JSON.parse(text);

    setUploading(false);

    if (!response.ok) {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return data.public_id;
  };

  // ----------------------------
  // Handle file change
  // ----------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  // ----------------------------
  // Submit updated blog
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login first");
      return;
    }

    let featuredImageUrl = currentImage;

    // If user uploaded a new image upload it
    if (image) {
      try {
        const publicId = await uploadToCloudinary(image);
        featuredImageUrl = publicId;
      } catch (err: any) {
        setMessage("Cloudinary upload failed");
        console.error(err);
        return;
      }
    }

    // Build final JSON body (backend expects EXACTLY these fields)
    const body = {
      title,
      synopsis,
      content,
      featuredImageUrl,
    };

    try {
      await api.patch(`/blogs/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Blog updated successfully!");
      setTimeout(() => navigate("/blogs"), 1000);
    } catch (err: any) {
      console.error("Update Error:", err);
      setMessage(err.response?.data?.message || "Failed to update blog");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      {message && (
        <div className="p-3 mb-4 rounded bg-gray-100 text-gray-800 border">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Synopsis</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded"
            rows={8}
          />
        </div>

        {/* Current Image Preview */}
        {currentImage && !imagePreview && (
          <div>
            <p className="font-medium mb-1">Current Image</p>
            <img
              src={`https://res.cloudinary.com/dif3z0kkk/image/upload/${currentImage}`}
              alt="Current"
              className="w-40 rounded border"
            />
          </div>
        )}

        {/* New preview */}
        {imagePreview && (
          <div>
            <p className="font-medium mb-1">New Image Preview</p>
            <img src={imagePreview} className="w-40 rounded border" />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Change Featured Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {uploading ? "Uploading..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
