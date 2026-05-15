import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAllPosts } from "../../managers/PostManager"
import { getCategories } from "../../managers/CategoryManager"
import { getTags } from "../../managers/TagManager"
import { PostCard } from "./PostCard"

export const PostList = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    getAllPosts().then(setPosts)
    getCategories().then(setCategories)
    getTags().then(setTags)
  }, [])

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category && post.category.id === parseInt(selectedCategory))
    : posts

  return (
    <div className="container">
      <h2 className="title is-4 mt-4">Posts</h2>
      <div className="is-flex is-gap-4 mb-4" style={{ gap: "1rem" }}>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <div className="control">
            <div className="select">
              <select value="" onChange={e => { if (e.target.value) navigate(`/tags/${e.target.value}/posts`) }}>
                <option value="">Filter by Tag</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="columns is-multiline mt-2">
        {filteredPosts.map(post => (
          <div key={post.id} className="column is-full-mobile is-half-tablet is-one-third-desktop">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  )
}
