import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { searchPosts } from "../../managers/PostManager"

export const PostSearch = () => {
  const [searchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const query = searchParams.get("q") || ""

  useEffect(() => {
    if (query) {
      searchPosts(query).then(setPosts)
    } else {
      setPosts([])
    }
  }, [query])

  return (
    <div className="container mt-4">
      <h2 className="title is-4">Search results for &ldquo;{query}&rdquo;</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Published</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td><Link to={`/posts/${post.id}`}>{post.title}</Link></td>
                <td>{post.user.username}</td>
                <td>{post.publication_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
