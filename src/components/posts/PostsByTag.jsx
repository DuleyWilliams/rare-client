import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getPostsByTag } from "../../managers/PostManager"
import { PostCard } from "./PostCard"

export const PostsByTag = () => {
  const { tagId } = useParams()
  const [tag, setTag] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPostsByTag(tagId).then(data => {
      setTag(data.tag)
      setPosts(data.posts)
    })
  }, [tagId])

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">
        Posts tagged: {tag ? tag.label : "..."}
      </h2>
      <Link to="/posts" className="button is-light mb-4">Back to Posts</Link>
      {posts.length === 0 ? (
        <p>No approved posts with this tag yet.</p>
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
