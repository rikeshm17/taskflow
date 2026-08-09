import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";

interface AvatarUploaderProps {
  avatarUrl: string | null;
  onUpload: (url: string) => void;
}

function AvatarUploader({
  avatarUrl,
  onUpload,
}: AvatarUploaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const fileExt = file.name.split(".").pop();

    const fileName = `${user.id}.${fileExt}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({
        avatar_url: data.publicUrl,
      })
      .eq("id", user.id);

    onUpload(data.publicUrl);

    toast.success("Profile picture updated!");

    setUploading(false);
  }

  return (
    <div className="avatar-upload">

      <img
        src={
          avatarUrl ||
          "https://placehold.co/150x150?text=User"
        }
        className="avatar-preview"
        alt="Profile picture"
      />

      <button
        onClick={() => fileInput.current?.click()}
      >
        {uploading ? "Uploading..." : "Change Photo"}
      </button>

      <input
        ref={fileInput}
        hidden
        type="file"
        accept="image/*"
        onChange={uploadAvatar}
      />

    </div>
  );
}

export default AvatarUploader;
