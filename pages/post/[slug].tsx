import type { NextPage } from "next";
import fs from "fs";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import Image from "next/image";
import { NextSeo } from "next-seo";
import remarkToc from "remark-toc";
import remarkPrism from "remark-prism";
import rehypeSlug from "rehype-slug";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const file = fs.readFileSync(
    `posts/${params.slug}.md`,
    "utf-8"
  );
  const { data, content } = matter(file);
  const result = await unified()
    .use(remarkParse)
    .use(remarkPrism, {
      plugins: ["line-numbers"],
    })
    .use(remarkToc, {
      heading: "目次",
    })
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(content);

  return {
    props: {
      frontMatter: data,
      content: result.toString(),
      slug: params.slug,
    },
  };
}

export async function getStaticPaths() {
  const files = fs.readdirSync("posts");
  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.md$/, ""),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

interface Props {
  frontMatter: any;
  content: string;
  slug: string;
}

const Post: NextPage<Props> = ({
  frontMatter,
  content,
  slug,
}) => {
  return (
    <div>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.description}
        openGraph={{
          type: "website",
          url: `http:localhost:3000/posts/${slug}`,
          title: frontMatter.title,
          description: frontMatter.description,
          images: [
            {
              url: `https://localhost:3000/${frontMatter.image}`,
              width: 1200,
              height: 700,
              alt: frontMatter.title,
            },
          ],
        }}
      />
      <div className="prose dark:prose-invert prose-lg max-w-none">
        <div className="border">
          <Image
            src={`/${frontMatter.image}`}
            width={1200}
            height={700}
            alt={frontMatter.title}
          />
        </div>
        <h1 className="mt-12">{frontMatter.title}</h1>
        <span>{frontMatter.date}</span>
        <div className="space-x-2">
          {frontMatter.categories.map((category) => (
            <span key={category}>
              <Link href={`/categories/${category}`}>
                <a>{category}</a>
              </Link>
            </span>
          ))}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </div>
    </div>
  );
};

export default Post;
