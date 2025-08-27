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
    <main className="container mx-auto p-8 bg-white">
      <h1 className="text-4xl text-black font-bold mb-8">Blog</h1>

      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post._id}
            className="rounded-2xl shadow-md overflow-hidden border"
          >
            {post.coverImage && (
              <Image
                src={urlFor(post.coverImage).width(600).height(350).url()}
                alt={post.title}
                width={600}
                height={350}
                className="w-full object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2 text-black">
                <Link href={`/blog/${post.slug.current}` }>
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-black mb-2">
                {post.datePosted?.slice(0, 10)}
              </p>
              <p className="text-gray-900">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
