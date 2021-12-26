import { Link, useLoaderData } from "remix";
import { getPosts } from "~/post";
import type { PostTitle } from '~/post';

export const loader = () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<PostTitle[]>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {
          posts.map(({ slug, title }) => (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
