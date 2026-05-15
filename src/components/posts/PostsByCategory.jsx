import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPostsByCategory } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const PostsByCategory = () => {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPostsByCategory(categoryId).then(data => {
      setCategory(data.category)
      setPosts(data.posts)
    })
  }, [categoryId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts in: {category ? category.label : "..."}
      </h2>
      <Link to="/categories" className="button is-light mb-4">Back to Categories</Link>
      {posts.length === 0 ? (
        <p>No approved posts in this category yet.</p>
      ) : (
        <div className="columns is-multiline">
          {posts.map(post => (
            <div key={post.id} className="column is-full-mobile is-half-tablet is-one-third-desktop">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
