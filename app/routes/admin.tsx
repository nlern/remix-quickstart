import { Link, Outlet, useLoaderData } from "remix";
import { getPosts } from "~/post";
import type { Post } from "~/post";
import adminStyles from "~/styles/admin.css";

export const links = () => {
  return [{ rel: 'stylesheet', href: adminStyles }];
}

export const loader = () => {
  return getPosts();
}

export default function Admin() {
  const posts = useLoaderData<Post[]>();

  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {
            posts.map(({ slug, title }) => (
              <li key={slug}>
                <Link to={`./edit/${slug}`}>
                  {title}
                </Link>
              </li>
            ))
          }
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
