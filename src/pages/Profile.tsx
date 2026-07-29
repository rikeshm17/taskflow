import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import "../styles/profile.css";

type Profile = {
  full_name: string;
  avatar_url: string | null;
  created_at: string;
};

function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

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
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="avatar">
          {email.charAt(0).toUpperCase()}
        </div>

        <h1>
          {profile?.full_name || "No Name Yet"}
        </h1>

        <p>{email}</p>

        <p>
          Member Since
          <br />
          {profile?.created_at
            ? new Date(profile.created_at).toLocaleDateString()
            : "-"}
        </p>

        <button>
          Edit Profile
        </button>

      </div>
    </div>
  );
}

export default Profile;