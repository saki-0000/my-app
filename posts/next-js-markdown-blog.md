---
title: 'タイトル'
date: '2022-10-18'
description: '説明'
categories: ['react', 'laravel']
---

## 目次

テスト概要

## 主題

テスト主題

### 副題

テスト副題

```js[class="line-numbers"]
import type { NextPage } from "next";
import fs from "fs";
import matter from "gray-matter";
import PostCard from "../components/PostCard";

type Post = {
  slug: string;
  frontMatter: any;
};

interface Props {
  posts: Post[];
}

export const getStaticProps = () => {
  const files = fs.readdirSync("posts");
  const posts: Post[] = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fileContent = fs.readFileSync(
      `posts/${fileName}`,
      "utf-8"
    );
    const { data } = matter(fileContent);
    return {
      frontMatter: data,
      slug,
    };
  });
  const sortedPosts = posts.sort((postA, postB) =>
    new Date(postA.frontMatter.date) >
    new Date(postB.frontMatter.date)
      ? -1
      : 1
  );
  return {
    props: {
      posts: sortedPosts,
    },
  };
};

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <div className="my-8">
      <h1>ユーザー名の記事一覧</h1>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;

```
