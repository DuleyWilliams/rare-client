import { Link } from "react-router-dom"

const truncate = (text, max = 150) =>
  text && text.length > max ? text.slice(0, max) + '…' : (text || '')

export const PostCard = ({ post }) => {
  const currentUserId = parseInt(localStorage.getItem('current_user_id'))

  return (
    <div className="card">
      <div className="card-content">
        <p className="title is-5 mb-1">
          <Link to={`/posts/${post.id}`}>{post.title}</Link>
          {!post.approved && post.user.id === currentUserId && (
            <span className="tag is-warning ml-2">Pending Review</span>
          )}
        </p>
        <p className="subtitle is-6 mb-3">by {post.author_name}</p>
        <div className="content">
          <p>{truncate(post.content)}</p>
        </div>
        {post.category && (
          <div className="tags">
            <span className="tag is-info">{post.category.label}</span>
          </div>
        )}
      </div>
      <footer className="card-footer">
        <span className="card-footer-item">Comments: {post.comment_count}</span>
        <span className="card-footer-item">Reactions: {post.reaction_count}</span>
        <span className="card-footer-item has-text-grey">{post.publication_date}</span>
      </footer>
    </div>
  )
}
