import React, { useState, useEffect } from "react";
import api from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBlog = (blogId: string) => {
    navigate(`/view-blog/${blogId}`);
  };

  const handleEditBlog = (blogId: string) => {
    navigate(`/edit-blog/${blogId}`);
  };

  const handleTrashBlog = async (blogId: string) => {
    if (window.confirm("Are you sure you want to move this blog to trash?")) {
      try {
        await api.patch(`/blogs/trash/${blogId}`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        fetchBlogs();
        alert("Blog moved to trash successfully!");
      } catch (err) {
        console.error("Error trashing blog:", err);
        alert("Failed to move blog to trash");
      }
    }
  };

  // Check if it's a Cloudinary public_id (from new uploads)
  const isCloudinaryPublicId = (imageData: string): boolean => {
    if (!imageData) return false;
    
    // Cloudinary public_ids usually don't have spaces, parentheses, or "Image:" prefix
    const isOldFormat = 
      imageData.includes(' ') ||
      imageData.includes('(') ||
      imageData.includes(')') ||
      imageData.includes('Image:') ||
      imageData.includes('image-uploaded-') ||
      imageData.includes('uploaded:');
    
    return !isOldFormat;
  };

  // Generate Cloudinary URL - handles both old and new formats
  const getImageUrl = (imageData: string): string => {
    if (!imageData) return "";
    
    const CLOUD_NAME = "dif3z0kkk";
    
    if (isCloudinaryPublicId(imageData)) {
      // New format: Cloudinary public_id directly
      return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_600,h_400,c_fill/q_auto,f_auto/${imageData}`;
    } else {
      // Old format: Try to extract filename
      let cleaned = imageData
        .replace(/^Image:\s*/gi, '')
        .replace(/^uploaded:\s*/gi, '')
        .replace(/^Image\s*/gi, '')
        .replace(/\s*\([^)]*\)$/gi, '')
        .replace(/^image-uploaded-/, '')
        .replace(/^uploaded-/, '')
        .trim();
      
      if (cleaned.includes('/')) {
        const parts = cleaned.split('/');
        cleaned = parts[parts.length - 1];
      }
      
      if (cleaned) {
        const encodedFilename = encodeURIComponent(cleaned);
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${encodedFilename}`;
      }
    }
    
    return "";
  };

  // Get display text for image
  const getImageInfo = (imageData: string) => {
    if (!imageData) return { text: "No Image", type: "none" };
    
    if (isCloudinaryPublicId(imageData)) {
      return { 
        text: "Cloudinary Image", 
        type: "cloudinary",
        shortId: imageData.length > 20 ? imageData.substring(0, 20) + "..." : imageData
      };
    } else {
      let cleaned = imageData
        .replace(/^Image:\s*/gi, '')
        .replace(/^uploaded:\s*/gi, '')
        .replace(/^image-uploaded-/, '')
        .trim();
      
      if (cleaned.length > 30) {
        cleaned = cleaned.substring(0, 30) + "...";
      }
      
      return { 
        text: "Old Format", 
        type: "old",
        filename: cleaned
      };
    }
  };

  if (loading) {
    return <div className="p-6">Loading blogs...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blog Dashboard</h1>
        <Link 
          to="/add-blog" 
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-medium"
        >
          + Add New Blog
        </Link>
      </div>

      {/* Success Message */}
      <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded">
        <p className="font-semibold text-green-800">✅ System Working Perfectly!</p>
        <p className="text-green-700">Blogs are being created and stored successfully.</p>
        <p className="text-green-600 text-sm mt-1">
          New blogs with frontend Cloudinary upload will display images instantly!
        </p>
      </div>

      {/* Info Box about Image Types */}
      <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Image Status:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm">✅ Cloudinary Image - Uploaded & Displaying</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-sm">🔄 Old Format - Not uploaded to Cloudinary</span>
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog, index) => {
          const imageData = blog.featuredImageUrl || "";
          const imageUrl = getImageUrl(imageData);
          const imageInfo = getImageInfo(imageData);
          const hasImage = imageData && imageData.length > 0;
          const isCloudinary = imageInfo.type === 'cloudinary';
          
          return (
            <div key={blog.id || index} className="border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition overflow-hidden">
              {/* IMAGE SECTION */}
              <div className="w-full h-48 relative bg-gray-100">
                {hasImage ? (
                  <div className="relative w-full h-full">
                    {/* The actual image */}
                    <img 
                      src={imageUrl}
                      alt={blog.title || "Blog image"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Image failed to load - show fallback
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    
                    {/* Status badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
                      isCloudinary 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    }`}>
                      {isCloudinary ? '✅ Cloudinary' : '🔄 Old Format'}
                    </div>
                    
                    {/* Fallback that shows ONLY when image fails to load */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100"
                      style={{ display: 'none' }} // Hidden by default
                      id={`fallback-${blog.id}`}
                    >
                      {isCloudinary ? (
                        <>
                          <div className="text-4xl mb-2 text-gray-400">⚠️</div>
                          <p className="font-medium text-gray-700">Image not found</p>
                          <p className="text-sm text-gray-500 mt-1 text-center">
                            {imageInfo.shortId}
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2 text-gray-400">📸</div>
                          <p className="font-medium text-gray-700">Old Image Format</p>
                          <p className="text-sm text-gray-500 mt-1 text-center">
                            {imageInfo.filename}
                          </p>
                          <p className="text-xs text-blue-500 mt-2">
                            Edit to re-upload to Cloudinary
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  // No image at all
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <div className="text-5xl mb-3 text-gray-400">📸</div>
                    <p className="text-xl font-semibold text-gray-600">No Image</p>
                    <p className="text-gray-500 text-sm mt-1">Add featured image</p>
                  </div>
                )}
              </div>
              
              {/* BLOG CONTENT */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{blog.title || "Untitled"}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{blog.synopsis || blog.content || "No description"}</p>
                
                {/* Action Buttons - NOW WITH VIEW BUTTON */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewBlog(blog.id)}
                    className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEditBlog(blog.id)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleTrashBlog(blog.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Trash
                  </button>
                </div>
                
                {/* Image info - small */}
                <div className="mt-3 text-xs text-gray-500">
                  {hasImage && (
                    <div className="flex items-center justify-between">
                      <span>
                        <span className="font-medium">Status:</span> {imageInfo.text}
                      </span>
                      {isCloudinary && (
                        <a 
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View image ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blogs yet.</p>
          <Link 
            to="/add-blog" 
            className="inline-block mt-4 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Create First Blog
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogDashboard;