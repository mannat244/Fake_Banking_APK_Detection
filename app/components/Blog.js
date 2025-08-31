'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanityClient"; // Ensure this path is correct
import imageUrlBuilder from "@sanity/image-url";

// This query fetches the 3 most recent posts from Sanity
const POSTS_QUERY = `*[_type == "post"] | order(datePosted desc)[0...3] {
  _id,
  title,
  slug,
  excerpt,
  datePosted,
  coverImage
}`;

// Helper function to build image URLs from Sanity's image asset data
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const Blog = () => {
  // State to manage the component's data and status
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This effect runs only once after the component mounts, because of the empty array []
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // Start loading
        const fetchedPosts = await client.fetch(POSTS_QUERY);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false); // Stop loading, regardless of success or error
      }
    };

    fetchPosts();
  }, []); // The empty dependency array is crucial to prevent an infinite loop

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // --- Conditional Rendering ---
  // 1. Show a loading state while fetching data
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full"
           style={{ background: "radial-gradient(ellipse at center, #0a1428 0%, #000408 100%)" }}>
        <div className="text-white text-xl">Loading articles...</div>
      </div>
    );
  }

  // 2. Show an error message if the fetch failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full"
           style={{ background: "radial-gradient(ellipse at center, #0a1428 0%, #000408 100%)" }}>
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Unable to load blog posts</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  // 3. Render the posts once data is successfully fetched
  return (
    <div className="min-h-screen w-full" style={{ background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)" }}>
      {/* Header Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-white mb-6">The Rakshak Reports</h1>
        <p className="text-lg text-gray-300 max-w-4xl mx-auto">
          Fraud never sleeps — and neither does Rakshak. Arm yourself with our blogs.
          <br className="hidden sm:block" />
          Latest fraud trends, defense strategies, and trusted security insights.
        </p>
      </div>

      {/* Blog Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id}>
                <Link href={`/blog/${post.slug.current}`} className="group block h-full">
                <div className="relative bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 p-0.5 rounded-2xl hover:from-blue-500/40 hover:via-cyan-500/40 hover:to-teal-500/40 transition-all duration-300 h-full">
                  <div className="rounded-2xl overflow-hidden flex flex-col h-full" style={{ background: "linear-gradient(145deg, rgba(16, 22, 36, 0.8) 0%, rgba(8, 15, 28, 0.9) 100%)", backdropFilter: "blur(10px)" }}>
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      {post.coverImage && (
                        <Image
                          src={urlFor(post.coverImage).width(600).height(350).url()}
                          alt={post.title}
                          width={600}
                          height={350}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    </div>
                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="inline-block mb-4">
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                          {formatDate(post.datePosted)}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-4 leading-tight group-hover:text-cyan-300 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="mt-auto">
                        <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                          <span className="font-medium text-sm">Read More</span>
                          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Blog;