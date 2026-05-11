import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { searchPosts } from "../../managers/PostManager"

export const PostSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const query = searchParams.get("q") || ""
  const author = searchParams.get("author") || ""
  const authorRef = useRef(null)

  useEffect(() => {
    if (query || author) {
      searchPosts(query, author).then(setPosts)
    } else {
      setPosts([])
    }
  }, [query, author])

  const handleAuthorSearch = (e) => {
    e.preventDefault()
    const newAuthor = authorRef.current.value.trim()
    const params = {}
    if (query)     params.q = query
    if (newAuthor) params.author = newAuthor
    setSearchParams(params)
  }

  return (
    <div className="container mt-4">
      <h2 className="title is-4">
        {query && author
          ? <>Search results for &ldquo;{query}&rdquo; by &ldquo;{author}&rdquo;</>
          : query
          ? <>Search results for &ldquo;{query}&rdquo;</>
          : <>Posts by &ldquo;{author}&rdquo;</>}
      </h2>
      <form onSubmit={handleAuthorSearch} className="mb-4">
        <div className="field has-addons">
          <div className="control">
            <input
              ref={authorRef}
              className="input"
              type="text"
              placeholder="Filter by author username"
              defaultValue={author}
            />
          </div>
          <div className="control">
            <button type="submit" className="button is-info">Filter by author</button>
          </div>
        </div>
      </form>
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
