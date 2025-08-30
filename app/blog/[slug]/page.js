import { client } from "@/sanityClient";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "next-sanity";
import Link from "next/link";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  datePosted,
  coverImage,
  content
}`;

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// date formatter (SSR safe)
const formatDate = (dateString) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{
             background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
           }}>
        <p className="text-white text-xl">Post not found.</p>
      </div>
    );
  }

  const postImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(800).height(450).url()
    : null;

  return (
    <main className="min-h-screen text-white" 
          style={{
            background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
          }}>
      {/* Container */}
      <div className="container mx-auto max-w-4xl px-6 sm:px-8 py-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-10 transition-all duration-300"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to blog
        </Link>

        {/* Cover image */}
        {postImageUrl && (
          <div className="relative mb-12 overflow-hidden rounded-2xl shadow-xl group border border-blue-500/20">
            <Image
              src={postImageUrl}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Title + Meta */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif mb-6">
            <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent leading-tight">
              {post.title}
            </span>
          </h1>
          <div className="flex justify-center items-center gap-4 text-sm text-gray-300">
            <span>{formatDate(post.datePosted)}</span>
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-400/30 text-cyan-300 rounded-full text-xs font-semibold uppercase backdrop-blur-sm">
              Cybersecurity
            </span>
          </div>
          <p className="mt-6 text-lg text-gray-300 italic max-w-2xl mx-auto leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Content Section */}
        <div className="relative">
          <div className="relative rounded-2xl shadow-xl p-8 sm:p-12 prose max-w-none border border-blue-500/20"
               style={{
                 background: "linear-gradient(145deg, rgba(16, 22, 36, 0.8) 0%, rgba(8, 15, 28, 0.9) 100%)",
                 backdropFilter: "blur(10px)"
               }}>
            <PortableText
              value={post.content}
              components={{
                block: {
                  normal: ({ children }) => (
                    <p className="text-gray-200 leading-relaxed mb-6 text-base">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold text-white mb-6 font-serif">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-cyan-500/40 pb-2 font-serif">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-white mb-3 font-serif">
                      {children}
                    </h3>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-cyan-500 bg-cyan-500/10 px-6 py-4 my-6 italic text-gray-200 rounded-r-md backdrop-blur-sm">
                      {children}
                    </blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-200">
                      {children}
                    </ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-200">
                      {children}
                    </ol>
                  ),
                },
                marks: {
                  strong: ({ children }) => (
                    <strong className="font-semibold text-white">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-300">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-slate-800/60 text-cyan-300 px-2 py-1 rounded-md font-mono text-sm border border-slate-600/50">
                      {children}
                    </code>
                  ),
                  link: ({ children, value }) => (
                    <a
                      href={value?.href}
                      className="text-cyan-400 font-medium underline underline-offset-2 hover:text-cyan-300 transition-colors duration-300"
                      target={value?.blank ? "_blank" : undefined}
                      rel={value?.blank ? "noopener noreferrer" : undefined}
                    >
                      {children}
                    </a>
                  ),
                },
              }}
            />
          </div>
        </div>

        {/* Related posts or back to blog section */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 text-cyan-300 font-medium rounded-lg hover:from-cyan-800/50 hover:to-blue-800/50 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            Read More Articles
          </Link>
        </div>
      </div>
    </main>
  );
}