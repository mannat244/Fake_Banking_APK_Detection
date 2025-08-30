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
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return <p className="p-8">Post not found.</p>;
  }

  const postImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(800).height(450).url()
    : null;

  return (
<main
  className="min-h-screen relative overflow-hidden text-white"
  style={{
    background:
      "radial-gradient(125% 125% at 50% 100%, #000000 40%, #010133 100%)",
    fontFamily: "Montserrat, sans-serif",
  }}
>
  {/* Container */}
  <div className="relative z-10 container mx-auto max-w-4xl px-6 sm:px-8 py-12">
    {/* Back link */}
    <Link
      href="/blog"
      className="group inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-10 transition-all"
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
      <div className="relative mb-12 overflow-hidden rounded-2xl shadow-xl group">
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
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight mb-6">
        {post.title}
      </h1>
      <div className="flex justify-center items-center gap-4 text-sm text-slate-300">
        <span>{formatDate(post.datePosted)}</span>
        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
        <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 rounded-full text-xs font-semibold uppercase">
          Cybersecurity
        </span>
      </div>
      <p className="mt-6 text-lg text-gray-300 italic max-w-2xl mx-auto">
        {post.excerpt}
      </p>
    </div>

    {/* Content Section */}
    <div className="relative">
      <div className="relative bg-[#0A0F1F]/95 rounded-2xl shadow-lg p-8 sm:p-12 prose max-w-none">
        <PortableText
          value={post.content}
          components={{
            block: {
              normal: ({ children }) => (
                <p className="text-gray-200 leading-relaxed mb-6">
                  {children}
                </p>
              ),
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-white mb-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold text-white mb-4 border-b-2 border-cyan-500/40 pb-2">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-white mb-3">
                  {children}
                </h3>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-cyan-500 bg-cyan-500/10 px-6 py-4 my-6 italic text-gray-200 rounded-r-md">
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
                <code className="bg-[#1E2A44] text-cyan-300 px-2 py-1 rounded-md font-mono text-sm">
                  {children}
                </code>
              ),
              link: ({ children, value }) => (
                <a
                  href={value?.href}
                  className="text-cyan-400 font-medium underline underline-offset-2 hover:text-cyan-300 transition"
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
  </div>
</main>



  );
}
