import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

const ViewBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🎯 ViewBlog component LOADED with ID:", id);
    console.log("🌐 Will fetch from:", `/blogs/${id}`);
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching blog data...");
      
      const response = await api.get(`/blogs/${id}`);
      console.log("✅ Blog data received:", response.data);
      
      setBlog(response.data);
    } catch (err: any) {
      console.error("❌ Error fetching blog:", err);
      
      if (err.response?.status === 404) {
        setError("Blog not found. It may have been deleted.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to load blog. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get Cloudinary image URL
  const getImageUrl = (imageData: string): string => {
    if (!imageData) return "";
    
    const CLOUD_NAME = "dif3z0kkk";
    
    // Check if it's a Cloudinary public_id
    const isOldFormat = 
      imageData.includes(' ') ||
      imageData.includes('(') ||
      imageData.includes(')') ||
      imageData.includes('Image:') ||
      imageData.includes('image-uploaded-') ||
      imageData.includes('uploaded:');
    
    if (!isOldFormat) {
      // Cloudinary public_id
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_800,h_500,c_fill/q_auto,f_auto/${imageData}`;
    }
    
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog content...</p>
          <p className="text-sm text-gray-500 mt-2">Blog ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || "Blog not found."}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(blog.featuredImageUrl || "");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-800 transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>

        {/* Blog Content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {imageUrl && (
            <div className="w-full h-96 relative">
              <img
                src={imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Details */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            {/* Metadata */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="mr-4">📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
              {blog.user && (
                <span>👤 By {blog.user.firstName} {blog.user.lastName}</span>
              )}
            </div>
            
            {/* Synopsis */}
            {blog.synopsis && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Summary</h3>
                <p className="text-gray-700">{blog.synopsis}</p>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {blog.content}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/edit-blog/${blog.id}`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit This Blog
              </button>
              
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Back to All Blogs
              </button>
            </div>
          </div>
        </article>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Debug Info:</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Blog ID: <code className="bg-gray-200 px-1 rounded">{id}</code></p>
            <p>Image URL: {imageUrl ? 
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {imageUrl.substring(0, 50)}...
              </a> : 
              "No image"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;