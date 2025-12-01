import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "../lib/api.ts";
import { Spinner } from "../components/ui/spinner";

interface Blog {
  id: string;
  title: string;
  synopsis?: string;
  featuredImageUrl?: string;
  createdAt?: string;
}

const Blogs = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-user-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs");
      return response.data.blogs; // return array only
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner className="size-20" />
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500 text-center mt-10">Error: {(error as Error).message}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {data?.map((blog: Blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default Blogs;

/// ------------------- CARD COMPONENT -------------------

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 border border-gray-200">
      
      {/* Featured Image with fallback */}
      <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={blog.featuredImageUrl || `https://picsum.photos/seed/${blog.id}/400/300`}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/seed/${blog.id}/400/300`;
            target.onerror = null; // Prevent infinite loop if placeholder fails
          }}
        />
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>

      {/* Synopsis */}
      <p className="text-gray-600 text-sm line-clamp-3">{blog.synopsis}</p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>{new Date(blog.createdAt || "").toLocaleDateString()}</span>
        <Link 
          to={`/blogs/${blog.id}`}
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          Read More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};