import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanityClient";
import imageUrlBuilder from "@sanity/image-url";

const POSTS_QUERY = `*[_type == "post"] | order(datePosted desc) {
  _id,
  title,
  slug,
  excerpt,
  datePosted,
  coverImage
}`;

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY);

  return (
    <main className="min-h-screen px-6 py-16" 
          style={{
            background: "radial-gradient(ellipse at center, #0a1428 0%, #061018 30%, #030b1a 70%, #000408 100%)"
          }}>
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-5xl font-bold mb-4 text-center font-serif">
          <span className="text-white">Stay Ahead of</span>{" "}
          <span className="bg-gradient-to-tl from-slate-800 via-cyan-500 to-zinc-400 bg-clip-text text-transparent">Scams</span>
        </h1>
        <p className="text-center text-gray-300 mb-16 text-lg">
          Learn about the latest security threats and protect yourself from banking app scams
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {posts.map((post) => (
            <article
              key={post._id}
              className="flex flex-col rounded-2xl shadow-xl overflow-hidden border border-blue-500/20 hover:border-cyan-400/40 transition-all duration-300 group hover:scale-105 max-w-sm w-full"
              style={{
                background: "linear-gradient(145deg, rgba(16, 22, 36, 0.8) 0%, rgba(8, 15, 28, 0.9) 100%)",
                backdropFilter: "blur(10px)"
              }}
            >
              {post.coverImage && (
                <div className="overflow-hidden">
                  <Image
                    src={urlFor(post.coverImage).width(400).height(240).url()}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                  <Link href={`/blog/${post.slug.current}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="text-xs text-gray-400 mb-4 font-medium">
                  {new Date(post.datePosted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-300 leading-relaxed flex-grow text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-600/30">
                  <Link 
                    href={`/blog/${post.slug.current}`}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}