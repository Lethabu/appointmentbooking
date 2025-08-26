import { convex } from "@/lib/convexClient";
import { api } from "@/convex/_generated/api";
import { jsonLd } from "@/lib/jsonLd";
import { Article, BreadcrumbList, Person, ImageObject, SpeakableSpecification } from 'schema-dts';

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const post = await convex.query(api.posts.getBySlug, { slug: params.slug });

  if (!post) {
    return {
      title: "Post not found",
    }
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      images: [`${post.ogImage}?auto=format&w=1200&h=628`],
      type: 'article',
    },
    other: {
      'script[type="application/ld+json"]': jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        author: {
          '@type': 'Person',
          name: post.author,
        },
        image: {
          '@type': 'ImageObject',
          url: `${post.ogImage}?auto=format&w=1200&h=628`,
          width: 1200,
          height: 628,
        },
        speakable: {
          '@type': 'SpeakableSpecification',
          xpath: [
            '/html/head/title',
            '/html/head/meta[@name="description"]/@content'
          ]
        }
      } as Article),
    }
  };
}

async function BlogPostPage({ params }: PageProps) {
  const post = await convex.query(api.posts.getBySlug, { slug: params.slug });

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author}</p>
      <div>{post.content}</div>
    </article>
  );
}

export default BlogPostPage;