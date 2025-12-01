import React, { useState } from "react";
import api from "../lib/api";

const AddBlog = () => {
  // ... (All your existing state variables remain unchanged)
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // ... (All your existing handleImageChange and uploadToCloudinary functions remain unchanged)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    
    // Create preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview("");
    }
    
    // Reset Cloudinary ID when new image is selected
    setCloudinaryPublicId("");
  };

  // Upload image to Cloudinary with DEBUGGING (Keep your detailed version)
  const uploadToCloudinary = async (file: File): Promise<string> => {
    // ... (Your existing Cloudinary upload function logic)
    setUploading(true);
    setMessage("Uploading image to Cloudinary...");
    
    console.log("=== CLOUDINARY UPLOAD DEBUG START ===");
    console.log("📤 Starting Cloudinary upload...");
    console.log("📄 File info:", {
      name: file.name,
      size: file.size + " bytes (" + Math.round(file.size / 1024) + " KB)",
      type: file.type
    });
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "BlogApp images");
    formData.append("cloud_name", "dif3z0kkk");
    // Optionally add this if you want to explicitly put it in a folder. 
    // This MUST be an unsigned upload, which is what you're using.
    // formData.append("folder", "BlogApp/images"); // Match your stated folder structure
    
    // Log FormData contents
    console.log("📦 FormData entries:");
    for (let [key, value] of formData.entries()) {
      if (key === 'file') {
        console.log(`${key}:`, (value as File).name, (value as File).size + " bytes");
      } else {
        console.log(`${key}:`, value);
      }
    }
    
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/dif3z0kkk/image/upload`;
    console.log("🌐 Upload URL:", UPLOAD_URL);
    
    try {
      console.log("🔄 Sending POST request to Cloudinary...");
      
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      
      console.log("📡 Response status:", response.status, response.statusText);
      
      // Get response as text first
      const responseText = await response.text();
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Failed to parse JSON response:", parseError);
        throw new Error(`Invalid JSON response from Cloudinary. Status: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`Cloudinary upload failed: ${JSON.stringify(data.error || data)}`);
      }
      
      if (data.public_id) {
        return data.public_id;
      } else {
        throw new Error("No public_id received from Cloudinary");
      }
      
    } catch (error: any) {
      console.error("❌ Cloudinary upload error details:", error);
      throw error;
    } finally {
      setUploading(false); // <--- Important: Set to false after upload completes or fails
    }
  };


  // ... (Your existing handleSubmit function remains unchanged)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (Your existing handleSubmit logic)
    console.log("=== BLOG SUBMISSION START ===");
    
    const token = localStorage.getItem("token");
    
    // Validation
    if (!title || !synopsis || !content) {
      setMessage("Please fill in all fields");
      return;
    }

    if (!token) {
      setMessage("Please login first");
      return;
    }

    if (!image) {
      setMessage("Please select a featured image");
      return;
    }

    try {
      // Step 1: Upload image to Cloudinary (will set uploading state)
      setMessage("Uploading image to Cloudinary...");
      
      const publicId = await uploadToCloudinary(image); // This function handles setUploading(true/false)
      setCloudinaryPublicId(publicId);
      
      // Step 2: Create blog
      setMessage("Creating blog...");
      
      const blogData = {
        title,
        synopsis,
        content,
        featuredImageUrl: publicId,
      };

      const response = await api.post("/blogs", blogData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setMessage("🎉 Blog created successfully with Cloudinary image!");
      
      // Show the Cloudinary URL (Optional: open in new tab)
      const cloudinaryUrl = `https://res.cloudinary.com/dif3z0kkk/image/upload/${publicId}`;
      setTimeout(() => {
        window.open(cloudinaryUrl, '_blank');
      }, 500);

      // Reset form
      setTitle("");
      setSynopsis("");
      setContent("");
      setImage(null);
      setImagePreview("");
      setCloudinaryPublicId("");

    } catch (err: any) {
      console.error("❌ BLOG CREATION ERROR:", err);
      // ... (Your existing error handling logic)
        if (err.response) {
            // Server responded with error status
            const serverMessage = err.response.data?.message || err.response.data?.error || JSON.stringify(err.response.data);
            setMessage(`Server Error (${err.response.status}): ${serverMessage}`);
        } else if (err.request) {
            // No response received
            setMessage("No response from server. Check if backend is running on port 5001.");
        } else if (err.message) {
            // Other error (likely Cloudinary error)
            if (err.message.includes("Upload preset")) {
                setMessage(`Cloudinary Error: ${err.message}. Go to Cloudinary Dashboard → Settings → Upload → Create "blog_uploads" preset (Unsigned mode).`);
            } else if (err.message.includes("Network error")) {
                setMessage("Network error. Check your internet connection.");
            } else {
                setMessage("Error: " + err.message);
            }
        } else {
            setMessage("Unknown error occurred");
        }
    } finally {
      console.log("=== BLOG SUBMISSION END ===");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Blog</h2>

      {/* Message Display (Unchanged) */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            message.includes("successfully") || message.includes("🎉") 
              ? "bg-green-100 text-green-800 border-green-300" : 
            message.includes("Uploading") || message.includes("Creating")
              ? "bg-blue-100 text-blue-800 border-blue-300" :
            message.includes("Cloudinary")
              ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
            "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          <div className="font-semibold">
            {message.includes("successfully") || message.includes("🎉") ? "✅ " : 
             message.includes("Error") ? "❌ " : 
             message.includes("Uploading") ? "🔄 " : ""}
            {message}
          </div>
          {message.includes("Cloudinary") && (
            <div className="mt-2 text-sm">
              <a 
                href="https://cloudinary.com/console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Go to Cloudinary Dashboard →
              </a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Synopsis, Content - Unchanged */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Title *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Synopsis */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Synopsis *</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Brief summary of your blog"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Content *</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Write your blog content here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>

        {/* Featured Image - UPDATED FOR BETTER UX */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Featured Image *</label>
          
          <div className="space-y-4">
            {/* File Input and Status */}
            <div className="flex items-center gap-4 flex-wrap">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg border-2 border-dashed border-gray-300 transition flex items-center gap-2">
                <span>{image ? "🔄 Change Image" : "📁 Choose Image"}</span> 
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  required
                />
              </label>

              {/* File Name/Size Display */}
              {image && (
                <p className="text-sm text-gray-600">
                  **Selected:** {image.name} ({Math.round(image.size / 1024)} KB)
                </p>
              )}
              
              {/* Cloudinary Public ID Status (Keep it clean and out of the way) */}
              {cloudinaryPublicId && (
                <span className="flex items-center text-green-600 text-sm ml-auto">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  **Public ID Set**
                </span>
              )}
            </div>
            
            {/* Image Preview (Moved file name/size out of here for cleaner preview) */}
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-2">Image Preview:</p>
                <div className="relative w-full h-64 border border-gray-300 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            Cloudinary Instructions (Unchanged)
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">ℹ️ Cloudinary Upload Requirements:</p>
              <ol className="text-sm text-blue-700 list-decimal pl-5 space-y-1">
                <li>Create upload preset named <code className="bg-blue-100 px-1 rounded">blog_uploads</code></li>
                <li>Set signing mode to <strong>Unsigned</strong></li>
                <li>Cloud name must be <code className="bg-blue-100 px-1 rounded">dif3z0kkk</code></li>
              </ol>
              <a 
                href="https://cloudinary.com/console" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                Go to Cloudinary Dashboard to configure →
              </a>
            </div>
          </div>
        </div>

        {/* Submit Button - UPDATED to check if image is selected */}
        <button
          type="submit"
          disabled={uploading || !image}
          className={`w-full py-3 rounded-lg font-medium text-lg transition ${
            uploading || !image 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              **Uploading & Publishing...**
            </span>
          ) : "Publish Blog"}
        </button>
      </form>
      
      {/* Debug Panel (Unchanged) */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-700">Debug Information</p>
          <button 
            onClick={() => console.clear()}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear Console
          </button>
        </div>
        <div className="text-xs text-gray-600 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Cloud Name:</span> 
              <code className="ml-1 bg-gray-100 px-1 rounded">dif3z0kkk</code>
            </div>
            <div>
              <span className="font-medium">Upload Preset:</span> 
              <code className="ml-1 bg-gray-100 px-1 rounded">blog_uploads</code>
            </div>
          </div>
          <div>
            <span className="font-medium">Current Public ID:</span> 
            <code className="ml-1 bg-gray-100 px-1 rounded break-all">{cloudinaryPublicId || "None"}</code>
          </div>
          <div>
            <span className="font-medium">Cloudinary URL:</span> 
            {cloudinaryPublicId ? (
              <a 
                href={`https://res.cloudinary.com/dif3z0kkk/image/upload/${cloudinaryPublicId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 text-blue-500 hover:underline"
              >
                Open image ↗
              </a>
            ) : (
              <span className="ml-1 text-gray-400">Upload an image first</span>
            )}
          </div>
          <div className="pt-2 border-t border-gray-200">
            <p className="font-medium text-gray-700">Instructions:</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1">
              <li>Open Browser Console (F12 → Console tab)</li>
              <li>Select an image and click "Publish Blog"</li>
              <li>Check console for detailed debug logs</li>
              <li>Share any error messages you see</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;