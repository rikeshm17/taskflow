import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/profile.css";

type Profile = {
  full_name: string;
  avatar_url: string | null;
  created_at: string;
};

function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    loadUserEmail();
  }, []);

  async function loadUserEmail() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) setUserEmail(user.email ?? "");
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setEmail(user.email ?? "");

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || "");
    }
  }

  async function handleSave() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated!");
      await loadProfile();
      setEditing(false);
      navigate("/");
    }
  }

  function handleCancel() {
    setFullName(profile?.full_name || "");
    setEditing(false);
  }

  return (
    <div className="profile-page">
      <Navbar onLogout={logout} userEmail={userEmail} />

      <div className="profile-content">
        <div className="profile-card">

        <div className="avatar">
          {email.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          <>
            <input
              className="profile-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div className="profile-actions">
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className="cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1>
              {profile?.full_name || email}
            </h1>

            <p>{email}</p>

            <p className="member-since">
              Member Since
              <br />
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "-"}
            </p>

            <button
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}

      </div>

      <Footer />
    </div>
    </div>
  );
}

export default Profile;
