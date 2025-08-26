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
<main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(56, 189, 248, 0.2) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 container mx-auto max-w-4xl px-6 sm:px-8 py-12">
        <Link href="/blog" className="group inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 text-cyan-400 hover:text-cyan-300 font-semibold mb-8">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {postImageUrl && (
          <div className="relative mb-10 overflow-hidden rounded-2xl shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            <Image
              src={postImageUrl}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 mix-blend-overlay"></div>
          </div>
        )}

        {/* Title Section */}
        <div className="relative mb-12">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-lg opacity-50"></div>
          <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 sm:p-10 shadow-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">{formatDate(post.datePosted)}</span>
              </div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/40 rounded-full backdrop-blur-sm">
                <span className="text-xs font-bold text-cyan-200 uppercase tracking-wider">Cybersecurity</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              <p className="text-xl sm:text-2xl text-slate-200 leading-relaxed font-light pl-6 italic">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>

{/* Content Section */}
<div className="relative">
  <div className="absolute -inset-2 bg-gradient-to-b from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
  <div className="relative bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 sm:p-12 shadow-2xl">
    <div className="prose prose-gray prose-lg sm:prose-xl max-w-none 
                 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-6 prose-headings:tracking-tight
                 prose-h1:text-4xl prose-h1:bg-gradient-to-r prose-h1:from-gray-900 prose-h1:to-gray-700 prose-h1:bg-clip-text prose-h1:text-transparent
                 prose-h2:text-2xl prose-h2:text-gray-800 prose-h2:border-b-2 prose-h2:border-gradient-to-r prose-h2:from-cyan-500 prose-h2:to-blue-500 prose-h2:pb-3 prose-h2:mb-6
                 prose-h3:text-xl prose-h3:text-gray-800 prose-h3:font-semibold
                 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                 prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:text-cyan-700 prose-a:font-medium prose-a:transition-colors prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
                 prose-strong:text-gray-900 prose-strong:font-semibold
                 prose-em:text-gray-600 prose-em:italic
                 prose-code:text-cyan-700 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:font-medium
                 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:border prose-pre:border-gray-300 prose-pre:rounded-lg prose-pre:p-4
                 prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:text-gray-600 prose-blockquote:bg-cyan-50/50 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:my-6
                 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-ul:mb-6 prose-ol:mb-6
                 prose-li:mb-3 prose-li:text-gray-700 prose-li:leading-relaxed
                 prose-hr:border-gray-300 prose-hr:my-8
                 prose-table:border-collapse prose-table:border prose-table:border-gray-300
                 prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-semibold prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2
                 prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-td:text-gray-700">
      
      <PortableText 
        value={post.content}
        components={{
          block: {
            normal: ({children}) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
            h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{children}</h1>,
            h2: ({children}) => (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{children}</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              </div>
            ),
            h3: ({children}) => <h3 className="text-xl font-semibold text-gray-800 mb-4">{children}</h3>,
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-cyan-500 bg-cyan-50/50 rounded-r-lg py-4 px-6 my-6 italic text-gray-600">
                {children}
              </blockquote>
            ),
          },
          list: {
            bullet: ({children}) => <ul className="list-disc pl-6 mb-6 space-y-3 text-gray-700">{children}</ul>,
            number: ({children}) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-700">{children}</ol>,
          },
          listItem: {
            bullet: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
            number: ({children}) => <li className="text-gray-700 leading-relaxed">{children}</li>,
          },
          marks: {
            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
            em: ({children}) => <em className="italic text-gray-600">{children}</em>,
            code: ({children}) => (
              <code className="bg-gray-100 text-cyan-700 px-2 py-1 rounded-md font-mono text-sm font-medium">
                {children}
              </code>
            ),
            link: ({children, value}) => (
              <a 
                href={value?.href} 
                className="text-cyan-600 font-medium underline decoration-2 underline-offset-2 hover:text-cyan-700 transition-colors"
                target={value?.blank ? '_blank' : undefined}
                rel={value?.blank ? 'noopener noreferrer' : undefined}
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

        {/* Bottom spacing */}
        <div className="h-20"></div>
      </div>
    </main>
  );
}
