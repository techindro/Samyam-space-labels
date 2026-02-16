import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Edit3, Save, LogOut, ArrowLeft, Camera } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{ username: string | null; full_name: string | null; avatar_url: string | null } | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("user_id", user.id)
        .single();
      if (!error && data) {
        setProfile(data);
        setUsername(data.username || "");
        setFullName(data.full_name || "");
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ username, full_name: fullName })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setProfile((p) => p ? { ...p, username, full_name: fullName } : p);
      setEditing(false);
      toast({ title: "Profile updated!" });
    }
  };

  const getAvatarUrl = () => {
    if (!profile?.avatar_url) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_url);
    return data.publicUrl;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 2MB allowed.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: path }).eq("user_id", user.id);
    setUploading(false);
    if (updateError) {
      toast({ title: "Failed to save avatar", description: updateError.message, variant: "destructive" });
    } else {
      setProfile((p) => p ? { ...p, avatar_url: path } : p);
      toast({ title: "Avatar updated!" });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background star-field">
      {/* Header */}
      <div className="border-b border-border/30 glass-card">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <span className="font-display text-xl font-bold">Dashboard</span>
          <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1">
            <LogOut className="h-3 w-3" /> Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold font-display">Your Profile</h1>
              {!editing && (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1">
                  <Edit3 className="h-3 w-3" /> Edit
                </Button>
              )}
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                {getAvatarUrl() ? (
                  <img src={getAvatarUrl()!} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 text-foreground" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </div>
            </div>

            {editing ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2"><User className="w-4 h-4" /> Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" minLength={3} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                  <Input value={user.email} disabled className="opacity-60" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} disabled={saving} className="flex-1 gap-1">
                    <Save className="h-3 w-3" /> {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(false); setUsername(profile?.username || ""); setFullName(profile?.full_name || ""); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <InfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={profile?.full_name || "Not set"} />
                <InfoRow icon={<User className="h-4 w-4" />} label="Username" value={profile?.username || "Not set"} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="glass-card rounded-2xl p-6 shadow-xl mt-6">
            <h2 className="text-lg font-bold font-display mb-4">Account Info</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
              <p>Last sign in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-sm text-muted-foreground w-24">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export default Dashboard;
