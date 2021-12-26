import path from "path";
import fs from "fs/promises";
import parseFrontmatter from "front-matter";
import invariant from "tiny-invariant";
import { marked } from "marked";

export type Post = {
  slug: string;
  title: string;
  html: string;
};

type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export type PostTitle = Omit<Post, 'html'>;

export type PostMarkdownAttributes = {
  title: string;
};

const postsPath = path.join(__dirname, "..", "posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts(): Promise<PostTitle[]> {
  const files = await fs.readdir(postsPath);

  return Promise.all(
    files.map(async fileName => {
      const file = await fs.readFile(
        path.join(postsPath, fileName)
      );
      const { attributes } = parseFrontmatter<{ title: string }>(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${fileName} has bad meta data!`
      );
      return {
        slug: fileName.replace(/\.md$/, ""),
        title: attributes.title
      };
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontmatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes!`
  );
  const html = marked(body);
  return { slug, html, title: attributes.title };
}

export async function createPost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(
    path.join(postsPath, post.slug + ".md"),
    md
  );
  return getPost(post.slug);
}

export async function updatePost(post: NewPost) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(
    path.join(postsPath, post.slug + ".md"),
    md
  );
  return getPost(post.slug);
}
