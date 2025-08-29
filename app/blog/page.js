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
<main className="container mx-auto px-6 py-12 bg-[#0A0F1F] min-h-screen">
  <h1 className="text-4xl font-bold mb-12 text-center text-white tracking-wide">
    Stay Ahead of Scams
  </h1>

  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
    {posts.map((post) => (
      <article
        key={post._id}
        className="flex flex-col rounded-2xl bg-[#12182B] shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-[#1E2A44] h-full"
      >
        {post.coverImage && (
          <Image
            src={urlFor(post.coverImage).width(600).height(350).url()}
            alt={post.title}
            width={600}
            height={350}
            className="w-full h-56 object-cover"
          />
        )}

        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold mb-3 text-white hover:text-[#3B82F6] transition-colors duration-300">
            <Link href={`/blog/${post.slug.current}`}>
              {post.title}
            </Link>
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            {post.datePosted?.slice(0, 10)}
          </p>
          <p className="text-gray-300 leading-relaxed flex-grow">
            {post.excerpt}
          </p>
        </div>
      </article>
    ))}
  </div>
</main>




  );
}
