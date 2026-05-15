import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getProfile, updateProfile } from "../../managers/UserManager"

export const ProfileEdit = () => {
  const { userId } = useParams()
  const [profile, setProfile] = useState(null)
  const currentUserId = localStorage.getItem("current_user_id")
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const bioRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (String(userId) !== String(currentUserId)) {
      navigate(`/profiles/${userId}`)
      return
    }
    getProfile(userId).then(setProfile)
  }, [userId, currentUserId, navigate])

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile(userId, {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      bio: bioRef.current.value,
    }).then(data => {
      if (!data.error) {
        navigate(`/profiles/${userId}`)
      }
    })
  }

  if (!profile) return <p className="p-4">Loading...</p>

  return (
    <section className="section">
      <h1 className="title">Edit Profile</h1>
      <form onSubmit={handleSave}>
        <div className="field">
          <label className="label">First Name</label>
          <div className="control">
            <input className="input" type="text" ref={firstNameRef} defaultValue={profile.first_name} />
          </div>
        </div>
        <div className="field">
          <label className="label">Last Name</label>
          <div className="control">
            <input className="input" type="text" ref={lastNameRef} defaultValue={profile.last_name} />
          </div>
        </div>
        <div className="field">
          <label className="label">Bio</label>
          <div className="control">
            <textarea className="textarea" ref={bioRef} defaultValue={profile.bio} maxLength={500} />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" type="submit">Save</button>
          <button className="button" type="button" onClick={() => navigate(`/profiles/${userId}`)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
