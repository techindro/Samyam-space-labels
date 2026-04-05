import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, BookOpen, Trophy, Users, FlaskConical, Briefcase } from "lucide-react";
import AdminPapers from "@/components/admin/AdminPapers";
import AdminBlogPosts from "@/components/admin/AdminBlogPosts";
import AdminFrontierLeaderboard from "@/components/admin/AdminFrontierLeaderboard";
import AdminPreferenceLeaderboard from "@/components/admin/AdminPreferenceLeaderboard";
import AdminLabs from "@/components/admin/AdminLabs";
import AdminCareers from "@/components/admin/AdminCareers";

const tabs = [
  { id: "papers", label: "Papers", icon: FileText },
  { id: "blog", label: "Blog Posts", icon: BookOpen },
  { id: "frontier", label: "Frontier LB", icon: Trophy },
  { id: "preference", label: "Preference LB", icon: Users },
  { id: "labs", label: "Labs", icon: FlaskConical },
  { id: "careers", label: "Careers", icon: Briefcase },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("papers");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <span className="font-bold text-xl">Admin Dashboard</span>
          <div />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-border/30 pb-4">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(id)}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "papers" && <AdminPapers />}
        {activeTab === "blog" && <AdminBlogPosts />}
        {activeTab === "frontier" && <AdminFrontierLeaderboard />}
        {activeTab === "preference" && <AdminPreferenceLeaderboard />}
        {activeTab === "labs" && <AdminLabs />}
        {activeTab === "careers" && <AdminCareers />}
      </div>
    </div>
  );
};

export default AdminDashboard;
