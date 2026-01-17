"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Video, 
  Handshake, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  FileText,
  LogOut,
  ImageIcon,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title_en: "",
    title_fr: "",
    description_en: "",
    description_fr: "",
    date: "",
    location_en: "",
    location_fr: ""
  });

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title_en: "",
    title_fr: "",
    url: "",
    thumbnail_url: "",
    category: "conservation"
  });

  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "international"
  });

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption_en: "",
    caption_fr: "",
    url: ""
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [eventsRes, videosRes, partnersRes] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: true }),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("partners").select("*").order("name", { ascending: true })
    ]);

    if (eventsRes.data) setEvents(eventsRes.data);
    if (videosRes.data) setVideos(videosRes.data);
    if (partnersRes.data) setPartners(partnersRes.data);
    setLoading(false);
  };

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated");
    if (!authenticated) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddEvent = async () => {
    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      toast.error("Error adding event");
    } else {
      toast.success("Event added successfully");
      setShowEventForm(false);
      setNewEvent({ title_en: "", title_fr: "", description_en: "", description_fr: "", date: "", location_en: "", location_fr: "" });
      fetchData();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) toast.error("Error deleting event");
      else fetchData();
    }
  };

  const handleAddVideo = async () => {
    const { error } = await supabase.from("videos").insert([newVideo]);
    if (error) toast.error("Error adding video");
    else {
      toast.success("Video added successfully");
      setShowVideoForm(false);
      setNewVideo({ title_en: "", title_fr: "", url: "", thumbnail_url: "", category: "conservation" });
      fetchData();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) toast.error("Error deleting video");
      else fetchData();
    }
  };

  const handleAddPartner = async () => {
    const { error } = await supabase.from("partners").insert([newPartner]);
    if (error) toast.error("Error adding partner");
    else {
      toast.success("Partner added successfully");
      setShowPartnerForm(false);
      setNewPartner({ name: "", logo_url: "", website_url: "", type: "international" });
      fetchData();
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) toast.error("Error deleting partner");
      else fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-emerald-900 text-white py-12 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black">{t('admin.dashboard')}</h1>
              <p className="text-emerald-300 font-medium">Manage NGO Website Content</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.location.href = "/"}>
              Go to Website
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl border border-emerald-100 shadow-sm h-16 w-full md:w-auto">
            <TabsTrigger value="events" className="rounded-xl px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold transition-all">
              <CalendarIcon className="w-4 h-4 mr-2" /> Events
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-xl px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold transition-all">
              <Video className="w-4 h-4 mr-2" /> Videos
            </TabsTrigger>
            <TabsTrigger value="partners" className="rounded-xl px-8 h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white font-bold transition-all">
              <Handshake className="w-4 h-4 mr-2" /> Partners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">Manage Events</h2>
              <Button onClick={() => setShowEventForm(true)} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-emerald-900">{event.title_en} / {event.title_fr}</h3>
                    <div className="text-emerald-600 text-sm font-medium flex items-center gap-4 mt-1">
                      <span>{event.date}</span>
                      <span>{event.location_en}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-emerald-400 hover:text-emerald-600">
                      <Edit3 className="w-5 h-5" />
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">Manage Videos</h2>
              <Button onClick={() => setShowVideoForm(true)} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden group">
                  <div className="aspect-video bg-slate-200 relative">
                    {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title_en} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteVideo(video.id)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-emerald-900 line-clamp-1">{video.title_en}</h3>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-2">{video.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-emerald-900">Manage Partners</h2>
              <Button onClick={() => setShowPartnerForm(true)} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Partner
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-6 rounded-[2rem] border border-emerald-100 shadow-sm relative group text-center">
                  <button 
                    onClick={() => handleDeletePartner(partner.id)}
                    className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-16 mx-auto mb-4 bg-emerald-50 rounded-xl flex items-center justify-center">
                    {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" /> : <Handshake className="w-8 h-8 text-emerald-200" />}
                  </div>
                  <h3 className="font-bold text-emerald-900 text-sm">{partner.name}</h3>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forms (Modals-like) */}
      <AnimatePresence>
        {showEventForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={() => setShowEventForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Event</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEventForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900">Title (EN)</label>
                    <Input value={newEvent.title_en} onChange={e => setNewEvent({...newEvent, title_en: e.target.value})} placeholder="Event title in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900">Title (FR)</label>
                    <Input value={newEvent.title_fr} onChange={e => setNewEvent({...newEvent, title_fr: e.target.value})} placeholder="Titre de l'événement en Français" className="rounded-xl" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900">Date</label>
                    <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-900">Location (EN)</label>
                    <Input value={newEvent.location_en} onChange={e => setNewEvent({...newEvent, location_en: e.target.value})} placeholder="Location in English" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Description (EN)</label>
                  <Textarea value={newEvent.description_en} onChange={e => setNewEvent({...newEvent, description_en: e.target.value})} placeholder="Detailed description in English" className="rounded-xl min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Description (FR)</label>
                  <Textarea value={newEvent.description_fr} onChange={e => setNewEvent({...newEvent, description_fr: e.target.value})} placeholder="Description détaillée en Français" className="rounded-xl min-h-[100px]" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-emerald-100">
                <Button variant="ghost" onClick={() => setShowEventForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddEvent} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold px-8">Save Event</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showVideoForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={() => setShowVideoForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Video</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowVideoForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Title (EN)</label>
                  <Input value={newVideo.title_en} onChange={e => setNewVideo({...newVideo, title_en: e.target.value})} placeholder="Video title" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Video URL (YouTube/Vimeo)</label>
                  <Input value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Thumbnail URL</label>
                  <Input value={newVideo.thumbnail_url} onChange={e => setNewVideo({...newVideo, thumbnail_url: e.target.value})} placeholder="Image URL for preview" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Category</label>
                  <select 
                    value={newVideo.category} 
                    onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full h-11 rounded-xl border border-emerald-100 bg-white px-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="conservation">Conservation</option>
                    <option value="educational">Educational</option>
                    <option value="fieldwork">Fieldwork</option>
                  </select>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-emerald-100">
                <Button variant="ghost" onClick={() => setShowVideoForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddVideo} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold px-8">Save Video</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showPartnerForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" onClick={() => setShowPartnerForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Partner</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowPartnerForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Partner Name</label>
                  <Input value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} placeholder="Organization Name" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Website URL</label>
                  <Input value={newPartner.website_url} onChange={e => setNewPartner({...newPartner, website_url: e.target.value})} placeholder="https://..." className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Logo URL</label>
                  <Input value={newPartner.logo_url} onChange={e => setNewPartner({...newPartner, logo_url: e.target.value})} placeholder="Image URL for logo" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-emerald-900">Type</label>
                  <select 
                    value={newPartner.type} 
                    onChange={e => setNewPartner({...newPartner, type: e.target.value})}
                    className="w-full h-11 rounded-xl border border-emerald-100 bg-white px-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="international">International</option>
                    <option value="local">Local</option>
                    <option value="governmental">Governmental</option>
                  </select>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-emerald-100">
                <Button variant="ghost" onClick={() => setShowPartnerForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddPartner} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold px-8">Save Partner</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
