"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
      CalendarDays,
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
      Upload,
      Users,
      History,
      Activity,
      Receipt,
        Newspaper,
        FolderOpen,
        Download,
        Target,
        Images,
        AlertCircle,
        Copy,
        Check
      } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DragDropImageUpload from "@/components/DragDropImageUpload";

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [editingMission, setEditingMission] = useState<any>(null);
  const [newMission, setNewMission] = useState({ title_en: "", title_fr: "", description_en: "", description_fr: "", icon: "shield", display_order: 0 });
  const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // News state
    const [news, setNews] = useState<any[]>([]);
    const [showNewsForm, setShowNewsForm] = useState(false);
    const [editingNews, setEditingNews] = useState<any>(null);
    const [newNews, setNewNews] = useState({
      title_en: "",
      title_fr: "",
      content_en: "",
      content_fr: "",
      image_url: "",
      published_at: ""
      });

      // Projects state
      const [projects, setProjects] = useState<any[]>([]);
      const [showProjectForm, setShowProjectForm] = useState(false);
      const [editingProject, setEditingProject] = useState<any>(null);
      const [newProject, setNewProject] = useState({
        title_en: "",
        title_fr: "",
        description_en: "",
        description_fr: "",
        image_url: "",
        category_en: "",
        category_fr: ""
      });

      // Reports state
      const [reports, setReports] = useState<any[]>([]);
      const [showReportForm, setShowReportForm] = useState(false);
      const [editingReport, setEditingReport] = useState<any>(null);
      const [newReport, setNewReport] = useState({
        title_en: "",
        title_fr: "",
        description_en: "",
        description_fr: "",
        file_url: "",
        year: new Date().getFullYear().toString()
      });
      const [reportPdfFile, setReportPdfFile] = useState<File | null>(null);
      const [uploadingReport, setUploadingReport] = useState(false);

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
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [newVideo, setNewVideo] = useState({
    title_en: "",
    title_fr: "",
    url: "",
    thumbnail_url: "",
    category: "conservation"
  });

  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "international"
  });

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [newPhoto, setNewPhoto] = useState({
    caption_en: "",
    caption_fr: "",
    url: "",
    album_id: ""
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [showMemberForm, setShowMemberForm] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [newMember, setNewMember] = useState({
      name: "",
      role_en: "",
      role_fr: "",
      bio_en: "",
      bio_fr: "",
      photo_url: "",
      display_order: 0
    });
  const [memberPhotoFile, setMemberPhotoFile] = useState<File | null>(null);
  const [uploadingMember, setUploadingMember] = useState(false);

  // Albums state
  const [albums, setAlbums] = useState<any[]>([]);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [newAlbum, setNewAlbum] = useState({ name_en: "", name_fr: "" });
  const [albumBulkFiles, setAlbumBulkFiles] = useState<File[]>([]);
  const [uploadingAlbum, setUploadingAlbum] = useState(false);
  const [photoAlbumFilter, setPhotoAlbumFilter] = useState<string | null>(null);
  const [migrationSql, setMigrationSql] = useState<string | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [eventsRes, videosRes, partnersRes, photosRes, visitsRes, historyRes, logsRes, donationsRes, membersRes, newsRes, projectsRes, reportsRes, missionsRes, albumsRes] = await Promise.all([
            supabase.from("events").select("*").order("date", { ascending: true }),
            supabase.from("videos").select("*").order("created_at", { ascending: false }),
            supabase.from("partners").select("*").order("name", { ascending: true }),
            supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false }),
            fetch("/api/visitors").then(r => r.json()).catch(() => ({ count: 0 })),
            supabase.from("update_history").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("donations").select("*").order("created_at", { ascending: false }),
            supabase.from("group_members").select("*").order("display_order", { ascending: true }),
            supabase.from("news").select("*").order("created_at", { ascending: false }),
            supabase.from("projects").select("*").order("created_at", { ascending: false }),
            fetch("/api/admin/reports").then(r => r.json()).catch(() => ({ data: [] })),
            supabase.from("missions").select("*").order("display_order", { ascending: true }),
            supabase.from("photo_albums").select("*").order("created_at", { ascending: false }),
          ]);

      if (eventsRes.data) setEvents(eventsRes.data);
      if (videosRes.data) setVideos(videosRes.data);
      if (partnersRes.data) setPartners(partnersRes.data);
      if (photosRes.data) setPhotos(photosRes.data);
      setVisitorCount(visitsRes.count ?? 0);
      if (historyRes.data) setHistory(historyRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      if (donationsRes.data) setDonations(donationsRes.data);
        if (membersRes.data) setMembers(membersRes.data);
          if (newsRes.data) setNews(newsRes.data);
          if (projectsRes.data) setProjects(projectsRes.data);
          if (reportsRes.data) setReports(reportsRes.data);
          if (missionsRes.data) setMissions(missionsRes.data);
          if (!albumsRes.error && albumsRes.data) setAlbums(albumsRes.data);
          if (albumsRes.error) {
            // Table doesn't exist yet - fetch migration SQL
            fetch("/api/admin/migrate-albums", { method: "POST" })
              .then(r => r.json())
              .then(d => { if (d.sql) setMigrationSql(d.sql); })
              .catch(() => {});
          }

      setLoading(false);
  };

  const logAdminAction = async (action: string, details?: string) => {
    const username = localStorage.getItem("admin_user") || "Unknown Admin";
    await supabase.from("update_history").insert([{
      admin_user: username,
      action,
      details
    }]);
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
        <div className="animate-spin h-8 w-8 border-4 border-terracotta-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddEvent = async () => {
    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      toast.error("Error adding event");
    } else {
      await logAdminAction("Added Event", `Created event: ${newEvent.title_en}`);
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
      else {
        await logAdminAction("Deleted Event", `Deleted event ID: ${id}`);
        toast.success("Event deleted successfully");
        fetchData();
      }
    }
  };

  const resetMissionForm = () => {
    setNewMission({ title_en: "", title_fr: "", description_en: "", description_fr: "", icon: "shield", display_order: 0 });
    setEditingMission(null);
    setShowMissionForm(false);
  };

  const handleOpenEditMission = (mission: any) => {
    setEditingMission(mission);
    setNewMission({ title_en: mission.title_en, title_fr: mission.title_fr || "", description_en: mission.description_en || "", description_fr: mission.description_fr || "", icon: mission.icon || "shield", display_order: mission.display_order || 0 });
    setShowMissionForm(true);
  };

  const handleSaveMission = async () => {
    if (!newMission.title_en.trim()) { toast.error("Title (EN) is required"); return; }
    try {
      if (editingMission) {
        const { error } = await supabase.from("missions").update(newMission).eq("id", editingMission.id);
        if (error) throw error;
        await logAdminAction("Updated Mission", `Updated: ${newMission.title_en}`);
        toast.success("Mission updated");
      } else {
        const { error } = await supabase.from("missions").insert([newMission]);
        if (error) throw error;
        await logAdminAction("Added Mission", `Created: ${newMission.title_en}`);
        toast.success("Mission added");
      }
      resetMissionForm();
      fetchData();
    } catch (err: any) { toast.error(err.message || "Error saving mission"); }
  };

  const handleDeleteMission = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("missions").delete().eq("id", id);
      if (error) toast.error("Error deleting mission");
      else { await logAdminAction("Deleted Mission", `ID: ${id}`); toast.success("Mission deleted"); fetchData(); }
    }
  };

    const resetVideoForm = () => {
      setNewVideo({ title_en: "", title_fr: "", url: "", thumbnail_url: "", category: "conservation" });
      setEditingVideo(null);
      setShowVideoForm(false);
    };

    const handleOpenEditVideo = (video: any) => {
      setEditingVideo(video);
      setNewVideo({
        title_en: video.title_en,
        title_fr: video.title_fr || "",
        url: video.url,
        thumbnail_url: video.thumbnail_url || "",
        category: video.category || "conservation"
      });
      setShowVideoForm(true);
    };

    const handleSaveVideo = async () => {
      if (!newVideo.title_en.trim() || !newVideo.url.trim()) {
        toast.error("Title and URL are required");
        return;
      }
      try {
        if (editingVideo) {
          const { error } = await supabase.from("videos").update(newVideo).eq("id", editingVideo.id);
          if (error) throw error;
          // Sync to media table
          await supabase.from("media").update({
            url: newVideo.url,
            caption_en: newVideo.title_en,
            caption_fr: newVideo.title_fr,
            thumbnail_url: newVideo.thumbnail_url || "",
          }).eq("id", editingVideo.id);
          await logAdminAction("Updated Video", `Updated video: ${newVideo.title_en}`);
          toast.success("Video updated successfully");
        } else {
          const { data, error } = await supabase.from("videos").insert([newVideo]).select().single();
          if (error) throw error;
          // Also insert into media table with same id
          await supabase.from("media").insert([{
            id: data.id,
            type: "video",
            url: newVideo.url,
            caption_en: newVideo.title_en,
            caption_fr: newVideo.title_fr,
            thumbnail_url: newVideo.thumbnail_url || "",
          }]);
          await logAdminAction("Added Video", `Added video: ${newVideo.title_en}`);
          toast.success("Video added successfully");
        }
        resetVideoForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving video");
      }
    };

    const handleDeleteVideo = async (id: string) => {
      if (confirm("Are you sure?")) {
        const { error } = await supabase.from("videos").delete().eq("id", id);
        if (error) { toast.error("Error deleting video"); return; }
        // Also delete from media table
        const { error: mediaError } = await supabase.from("media").delete().eq("id", id);
        if (mediaError) { toast.error("Error deleting video media"); return; }
        await logAdminAction("Deleted Video", `Deleted video ID: ${id}`);
        toast.success("Video deleted successfully");
        fetchData();
      }
    };

    const resetPartnerForm = () => {
      setNewPartner({ name: "", logo_url: "", website_url: "", type: "international" });
      setEditingPartner(null);
      setShowPartnerForm(false);
    };

    const handleOpenEditPartner = (partner: any) => {
      setEditingPartner(partner);
      setNewPartner({
        name: partner.name,
        logo_url: partner.logo_url || "",
        website_url: partner.website_url || "",
        type: partner.type || "international"
      });
      setShowPartnerForm(true);
    };

    const handleSavePartner = async () => {
      if (!newPartner.name.trim()) {
        toast.error("Partner name is required");
        return;
      }
      try {
        if (editingPartner) {
          const { error } = await supabase.from("partners").update(newPartner).eq("id", editingPartner.id);
          if (error) throw error;
          await logAdminAction("Updated Partner", `Updated partner: ${newPartner.name}`);
          toast.success("Partner updated successfully");
        } else {
          const { error } = await supabase.from("partners").insert([newPartner]);
          if (error) throw error;
          await logAdminAction("Added Partner", `Added partner: ${newPartner.name}`);
          toast.success("Partner added successfully");
        }
        resetPartnerForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving partner");
      }
    };

    const handleDeletePartner = async (id: string) => {
      if (confirm("Are you sure?")) {
        const { error } = await supabase.from("partners").delete().eq("id", id);
        if (error) toast.error("Error deleting partner");
        else {
          await logAdminAction("Deleted Partner", `Deleted partner ID: ${id}`);
          toast.success("Partner deleted successfully");
          fetchData();
        }
      }
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

    const resetPhotoForm = () => {
      setNewPhoto({ caption_en: "", caption_fr: "", url: "", album_id: "" });
      setSelectedFile(null);
      setEditingPhoto(null);
      setShowPhotoForm(false);
    };

    const handleOpenEditPhoto = (photo: any) => {
      setEditingPhoto(photo);
      setNewPhoto({
        caption_en: photo.caption_en || "",
        caption_fr: photo.caption_fr || "",
        url: photo.url || "",
        album_id: photo.album_id || ""
      });
      setSelectedFile(null);
      setShowPhotoForm(true);
    };

    const handleSavePhoto = async () => {
      if (!editingPhoto && !selectedFile) {
        toast.error("Please select a photo to upload");
        return;
      }

      setUploading(true);
      try {
        let photoUrl = editingPhoto?.url || "";

        if (selectedFile) {
          const fileExt = selectedFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `gallery/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('photos')
            .upload(filePath, selectedFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(filePath);

          photoUrl = publicUrl;
        }

        if (editingPhoto) {
          const { error: dbError } = await supabase.from("media").update({
            url: photoUrl,
            caption_en: newPhoto.caption_en,
            caption_fr: newPhoto.caption_fr,
            album_id: newPhoto.album_id || null
          }).eq("id", editingPhoto.id);
          if (dbError) throw dbError;
          await logAdminAction("Updated Photo", `Updated photo: ${newPhoto.caption_en || editingPhoto.id}`);
          toast.success("Photo updated successfully");
        } else {
          const { error: dbError } = await supabase.from("media").insert([{
            type: "photo",
            url: photoUrl,
            caption_en: newPhoto.caption_en,
            caption_fr: newPhoto.caption_fr,
            album_id: newPhoto.album_id || null
          }]);
          if (dbError) throw dbError;
          await logAdminAction("Added Photo", `Uploaded new photo: ${newPhoto.caption_en || 'No caption'}`);
          toast.success("Photo uploaded successfully");
        }

        resetPhotoForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving photo");
      } finally {
        setUploading(false);
      }
    };

    const handleDeletePhoto = async (id: string, url: string) => {
      if (confirm("Are you sure?")) {
        try {
          const pathMatch = url.match(/photos\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from('photos').remove([pathMatch[1]]);
          }
          const { error } = await supabase.from("media").delete().eq("id", id);
          if (error) throw error;
          await logAdminAction("Deleted Photo", `Deleted photo ID: ${id}`);
          toast.success("Photo deleted successfully");
          fetchData();
        } catch {
          toast.error("Error deleting photo");
        }
      }
    };

  // Album CRUD
  const resetAlbumForm = () => {
    setNewAlbum({ name_en: "", name_fr: "" });
    setAlbumBulkFiles([]);
    setEditingAlbum(null);
    setShowAlbumForm(false);
  };

  const handleSaveAlbum = async () => {
    if (!newAlbum.name_en.trim()) { toast.error("Album name (EN) is required"); return; }
    setUploadingAlbum(true);
    try {
      if (editingAlbum) {
        const { error } = await supabase.from("photo_albums").update({ name_en: newAlbum.name_en, name_fr: newAlbum.name_fr }).eq("id", editingAlbum.id);
        if (error) throw error;
        await logAdminAction("Updated Album", `Updated: ${newAlbum.name_en}`);
        toast.success("Album updated");
      } else {
        // Upload all photos first
        const uploadedUrls: string[] = [];
        for (const file of albumBulkFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
          const filePath = `gallery/${fileName}`;
          const { error: uploadError } = await supabase.storage.from('photos').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('photos').getPublicUrl(filePath);
          uploadedUrls.push(publicUrl);
        }
        const cover_url = uploadedUrls[0] || "";
        const { data: albumData, error } = await supabase
          .from("photo_albums")
          .insert([{ name_en: newAlbum.name_en, name_fr: newAlbum.name_fr, cover_url }])
          .select()
          .single();
        if (error) throw error;
        if (uploadedUrls.length > 0) {
          const photoInserts = uploadedUrls.map(url => ({ type: "photo", url, caption_en: "", caption_fr: "", album_id: albumData.id }));
          const { error: photosError } = await supabase.from("media").insert(photoInserts);
          if (photosError) throw photosError;
        }
        await logAdminAction("Created Album", `Created album: ${newAlbum.name_en} with ${uploadedUrls.length} photos`);
        toast.success(`Album created with ${uploadedUrls.length} photos`);
      }
      resetAlbumForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Error saving album");
    } finally {
      setUploadingAlbum(false);
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    if (confirm("Delete this album? Photos will remain but be unassigned from the album.")) {
      try {
        await supabase.from("media").update({ album_id: null }).eq("album_id", id);
        const { error } = await supabase.from("photo_albums").delete().eq("id", id);
        if (error) throw error;
        await logAdminAction("Deleted Album", `Deleted album ID: ${id}`);
        toast.success("Album deleted");
        if (photoAlbumFilter === id) setPhotoAlbumFilter(null);
        fetchData();
      } catch (err: any) {
        toast.error(err.message || "Error deleting album");
      }
    }
  };

  const resetMemberForm = () => {
    setNewMember({ name: "", role_en: "", role_fr: "", bio_en: "", bio_fr: "", photo_url: "", display_order: 0 });
    setMemberPhotoFile(null);
    setEditingMember(null);
    setShowMemberForm(false);
  };

  const handleOpenEditMember = (member: any) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      role_en: member.role_en,
      role_fr: member.role_fr,
      bio_en: member.bio_en,
      bio_fr: member.bio_fr,
      photo_url: member.photo_url || "",
      display_order: member.display_order
    });
    setMemberPhotoFile(null);
    setShowMemberForm(true);
  };

  const uploadMemberPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('member-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveMember = async () => {
    if (!newMember.name.trim()) {
      toast.error(t('admin.members.name') + " is required");
      return;
    }

    setUploadingMember(true);
    try {
      let photo_url = editingMember?.photo_url || newMember.photo_url || "";

      if (memberPhotoFile) {
        // Delete old photo if editing and replacing
        if (editingMember?.photo_url) {
          const pathMatch = editingMember.photo_url.match(/member-photos\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from('member-photos').remove([pathMatch[1]]);
          }
        }
        photo_url = await uploadMemberPhoto(memberPhotoFile);
      }

      if (editingMember) {
        const { error } = await supabase.from("group_members").update({
            ...newMember,
            photo_url
          }).eq("id", editingMember.id);
        if (error) throw error;
        await logAdminAction("Updated Member", `Updated member: ${newMember.name}`);
        toast.success(t('admin.members.edit') + " - OK");
      } else {
        const { error } = await supabase.from("group_members").insert([{
          ...newMember,
          photo_url
        }]);
        if (error) throw error;
        await logAdminAction("Added Member", `Added member: ${newMember.name}`);
        toast.success(t('admin.members.add') + " - OK");
      }

      resetMemberForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Error saving member");
    } finally {
      setUploadingMember(false);
    }
  };

    const handleDeleteMember = async (id: string, photoUrl: string) => {
      if (confirm(t('admin.members.deleteConfirm'))) {
        try {
          if (photoUrl) {
            const pathMatch = photoUrl.match(/member-photos\/(.+)$/);
            if (pathMatch) {
              await supabase.storage.from('member-photos').remove([pathMatch[1]]);
            }
          }
          const { error } = await supabase.from("group_members").delete().eq("id", id);
          if (error) throw error;
          await logAdminAction("Deleted Member", `Deleted member ID: ${id}`);
          toast.success("Member deleted successfully");
          fetchData();
        } catch {
          toast.error("Error deleting member");
        }
      }
    };

    // News CRUD
    const resetNewsForm = () => {
      setNewNews({ title_en: "", title_fr: "", content_en: "", content_fr: "", image_url: "", published_at: "" });
      setEditingNews(null);
      setShowNewsForm(false);
    };

    const handleOpenEditNews = (item: any) => {
      setEditingNews(item);
      setNewNews({
        title_en: item.title_en,
        title_fr: item.title_fr,
        content_en: item.content_en,
        content_fr: item.content_fr,
        image_url: item.image_url || "",
        published_at: item.published_at ? item.published_at.slice(0, 10) : (item.created_at ? item.created_at.slice(0, 10) : "")
      });
      setShowNewsForm(true);
    };

    const handleSaveNews = async () => {
      if (!newNews.title_en.trim()) {
        toast.error(t('admin.news.titleEn') + " is required");
        return;
      }
      try {
        const payload = {
          ...newNews,
          published_at: newNews.published_at || null
        };
        if (editingNews) {
          const { error } = await supabase.from("news").update(payload).eq("id", editingNews.id);
          if (error) throw error;
          await logAdminAction("Updated News", `Updated article: ${newNews.title_en}`);
          toast.success(t('admin.news.edit') + " - OK");
        } else {
          const { error } = await supabase.from("news").insert([payload]);
          if (error) throw error;
          await logAdminAction("Added News", `Added article: ${newNews.title_en}`);
          toast.success(t('admin.news.add') + " - OK");
        }
        resetNewsForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving article");
      }
    };

      const handleDeleteNews = async (id: string) => {
        if (confirm(t('admin.news.deleteConfirm'))) {
          try {
            const { error } = await supabase.from("news").delete().eq("id", id);
            if (error) throw error;
            await logAdminAction("Deleted News", `Deleted article ID: ${id}`);
            toast.success("Article deleted successfully");
            fetchData();
          } catch {
            toast.error("Error deleting article");
          }
        }
      };

      // Projects CRUD
      const resetProjectForm = () => {
        setNewProject({ title_en: "", title_fr: "", description_en: "", description_fr: "", image_url: "", category_en: "", category_fr: "" });
        setEditingProject(null);
        setShowProjectForm(false);
      };

      const handleOpenEditProject = (item: any) => {
        setEditingProject(item);
        setNewProject({
          title_en: item.title_en,
          title_fr: item.title_fr,
          description_en: item.description_en,
          description_fr: item.description_fr,
          image_url: item.image_url || "",
          category_en: item.category_en || "",
          category_fr: item.category_fr || ""
        });
        setShowProjectForm(true);
      };

      const handleSaveProject = async () => {
        if (!newProject.title_en.trim()) {
          toast.error(t('admin.projects.titleEn') + " is required");
          return;
        }
        try {
          if (editingProject) {
            const { error } = await supabase.from("projects").update(newProject).eq("id", editingProject.id);
            if (error) throw error;
            await logAdminAction("Updated Project", `Updated project: ${newProject.title_en}`);
            toast.success(t('admin.projects.edit') + " - OK");
          } else {
            const { error } = await supabase.from("projects").insert([newProject]);
            if (error) throw error;
            await logAdminAction("Added Project", `Added project: ${newProject.title_en}`);
            toast.success(t('admin.projects.add') + " - OK");
          }
          resetProjectForm();
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error saving project");
        }
      };

      const handleDeleteProject = async (id: string) => {
        if (confirm(t('admin.projects.deleteConfirm'))) {
          try {
            const { error } = await supabase.from("projects").delete().eq("id", id);
            if (error) throw error;
            await logAdminAction("Deleted Project", `Deleted project ID: ${id}`);
            toast.success("Project deleted successfully");
            fetchData();
          } catch {
            toast.error("Error deleting project");
          }
        }
      };

      // Reports CRUD
      const resetReportForm = () => {
        setNewReport({ title_en: "", title_fr: "", description_en: "", description_fr: "", file_url: "", year: new Date().getFullYear().toString() });
        setReportPdfFile(null);
        setEditingReport(null);
        setShowReportForm(false);
      };

      const handleOpenEditReport = (item: any) => {
        setEditingReport(item);
        setNewReport({
          title_en: item.title_en,
          title_fr: item.title_fr,
          description_en: item.description_en || "",
          description_fr: item.description_fr || "",
          file_url: item.file_url || "",
          year: item.year || new Date().getFullYear().toString()
        });
        setReportPdfFile(null);
        setShowReportForm(true);
      };

      const handleSaveReport = async () => {
        if (!newReport.title_en.trim()) {
          toast.error(t('admin.reports.titleEn') + " is required");
          return;
        }
        setUploadingReport(true);
        try {
          let file_url = newReport.file_url;

          if (reportPdfFile) {
            const fileExt = reportPdfFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `reports/${fileName}`;
            const { error: uploadError } = await supabase.storage
              .from('reports')
              .upload(filePath, reportPdfFile);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('reports').getPublicUrl(filePath);
            file_url = publicUrl;
          }

          const body = editingReport
            ? { id: editingReport.id, ...newReport, file_url }
            : { ...newReport, file_url };

          const res = await fetch("/api/admin/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json.error || "Failed to save report");

          await logAdminAction(editingReport ? "Updated Report" : "Added Report", `Report: ${newReport.title_en}`);
          toast.success(editingReport ? t('admin.reports.edit') + " - OK" : t('admin.reports.add') + " - OK");
          resetReportForm();
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error saving report");
        } finally {
          setUploadingReport(false);
        }
      };

      const handleDeleteReport = async (id: string, fileUrl: string) => {
        if (confirm(t('admin.reports.deleteConfirm'))) {
          try {
            if (fileUrl) {
              const pathMatch = fileUrl.match(/reports\/(.+)$/);
              if (pathMatch) {
                await supabase.storage.from('reports').remove([pathMatch[1]]);
              }
            }
            const res = await fetch("/api/admin/reports", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || "Failed to delete report");
            await logAdminAction("Deleted Report", `Deleted report ID: ${id}`);
            toast.success("Report deleted successfully");
            fetchData();
          } catch (err: any) {
            toast.error(err.message || "Error deleting report");
          }
        }
      };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sage-800 text-white py-12 px-4 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="Salamandra Nature" className="h-14 w-auto" />
              <div>
                <h1 className="text-3xl font-black">{t('admin.dashboard')}</h1>
                <p className="text-sage-300 font-medium">{t('admin.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <Users className="w-5 h-5 text-terracotta-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-sage-300 font-bold uppercase tracking-wider leading-none">{t('admin.totalVisitors')}</span>
                  <span className="text-xl font-black leading-none">{visitorCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('admin.logout')}
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.location.href = "/"}>
                  {t('admin.goToWebsite')}
                </Button>
              </div>
            </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-row items-start gap-6">
            <TabsList className="flex flex-col h-auto w-52 shrink-0 bg-white rounded-2xl border border-sage-100 shadow-sm p-2 self-start sticky top-4 items-stretch justify-start space-y-0.5">
              <TabsTrigger value="events" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <CalendarDays className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.events')}
              </TabsTrigger>
              <TabsTrigger value="news" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Newspaper className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.news')}
              </TabsTrigger>
              <TabsTrigger value="projects" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <FolderOpen className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.projects')}
              </TabsTrigger>
              <TabsTrigger value="videos" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Video className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.videos')}
              </TabsTrigger>
              <TabsTrigger value="photos" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <ImageIcon className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.photos')}
              </TabsTrigger>
              <TabsTrigger value="partners" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Handshake className="w-4 h-4 mr-2.5 shrink-0" /> {t('nav.partners')}
              </TabsTrigger>
              <TabsTrigger value="members" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Users className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.members')}
              </TabsTrigger>
              <TabsTrigger value="reports" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <FileText className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.reports')}
              </TabsTrigger>
              <TabsTrigger value="history" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <History className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.history')}
              </TabsTrigger>
              <TabsTrigger value="logs" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Activity className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.logs')}
              </TabsTrigger>
              <TabsTrigger value="donations" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Receipt className="w-4 h-4 mr-2.5 shrink-0" /> {t('admin.tabs.donations')}
              </TabsTrigger>
              <TabsTrigger value="missions" className="w-full justify-start rounded-xl px-4 py-2.5 h-auto font-semibold transition-all data-[state=active]:bg-terracotta-500 data-[state=active]:text-white text-sage-700 hover:bg-sage-50 data-[state=active]:hover:bg-terracotta-500">
                <Target className="w-4 h-4 mr-2.5 shrink-0" /> {language === 'fr' ? 'Missions' : 'Missions'}
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 min-w-0">

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.events.manage')}</h2>
                <Button onClick={() => setShowEventForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.events.add')}
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-sage-800">{event.title_en} / {event.title_fr}</h3>
                    <div className="text-terracotta-500 text-sm font-medium flex items-center gap-4 mt-1">
                      <span>{event.date}</span>
                      <span>{event.location_en}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
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

            <TabsContent value="news" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.news.manage')}</h2>
                <Button onClick={() => { resetNewsForm(); setShowNewsForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.news.add')}
                </Button>
              </div>

              <div className="grid gap-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                    {item.image_url && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0">
                        <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-sage-800 truncate">{item.title_en}</h3>
                      <p className="text-terracotta-500 text-sm font-medium">{item.title_fr}</p>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-1">{item.content_en}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-sage-400 font-bold">
                      {new Date(item.published_at || item.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleOpenEditNews(item)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button onClick={() => handleDeleteNews(item.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <div className="text-center py-12 text-sage-400">
                    <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('admin.news.empty')}</p>
                  </div>
                )}
              </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800">{t('admin.projects.manage')}</h2>
                  <Button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.projects.add')}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {projects.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                      {item.image_url && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0">
                          <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-lg text-sage-800 truncate">{item.title_en}</h3>
                        <p className="text-terracotta-500 text-sm font-medium">{item.title_fr}</p>
                        <p className="text-sage-500 text-xs mt-1 line-clamp-1">{item.description_en}</p>
                        {item.category_en && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-sage-100 text-sage-700 text-xs font-bold rounded-full">{item.category_en}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button onClick={() => handleOpenEditProject(item)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                          <Edit3 className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => handleDeleteProject(item.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 text-sage-400">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin.projects.empty')}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800">{t('admin.reports.manage')}</h2>
                  <Button onClick={() => { resetReportForm(); setShowReportForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.reports.add')}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {reports.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 rounded-xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-7 h-7 text-terracotta-500" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-3 mb-0.5">
                          <h3 className="font-bold text-lg text-sage-800 truncate">{item.title_en}</h3>
                          {item.year && (
                            <span className="flex-shrink-0 text-xs font-semibold text-sage-500 bg-sage-100 px-2 py-0.5 rounded-full">{item.year}</span>
                          )}
                        </div>
                        <p className="text-terracotta-500 text-sm font-medium truncate">{item.title_fr}</p>
                        {item.description_en && (
                          <p className="text-sage-500 text-xs mt-1 line-clamp-1">{item.description_en}</p>
                        )}
                      </div>
                      {item.file_url && (
                        <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                          <Download className="w-4 h-4" /> PDF
                        </a>
                      )}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button onClick={() => handleOpenEditReport(item)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                          <Edit3 className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => handleDeleteReport(item.id, item.file_url)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reports.length === 0 && (
                    <div className="text-center py-12 text-sage-400">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin.reports.empty')}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800">{t('admin.videos.manage')}</h2>
                  <Button onClick={() => { resetVideoForm(); setShowVideoForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.videos.add')}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                    <div className="aspect-video bg-slate-200 relative">
                      {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title_en} className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenEditVideo(video)} className="bg-white/90 hover:bg-white">
                          <Edit3 className="w-5 h-5 text-terracotta-500" />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-sage-800 line-clamp-1">{video.title_en}</h3>
                      <p className="text-xs text-terracotta-500 font-bold uppercase tracking-wider mt-2">{video.category}</p>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && (
                  <div className="col-span-full text-center py-12 text-sage-400">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No videos yet. Add your first video!</p>
                  </div>
                )}
              </div>
              </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Photos & Albums</h2>
              <div className="flex gap-2">
                <Button onClick={() => { resetAlbumForm(); setShowAlbumForm(true); }} variant="outline" className="rounded-xl font-bold border-sage-200">
                  <Images className="w-4 h-4 mr-2" /> Create Album
                </Button>
                <Button onClick={() => { resetPhotoForm(); setShowPhotoForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> Add Photo
                </Button>
              </div>
            </div>

            {/* Migration notice */}
            {migrationSql && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-amber-800 mb-1">Database Migration Required</h3>
                    <p className="text-sm text-amber-700 mb-3">To enable albums, run the following SQL in your <a href="https://supabase.com/dashboard/project/iqxjqpxnurxlmolncews/sql" target="_blank" className="underline font-semibold">Supabase SQL Editor</a>:</p>
                    <pre className="bg-amber-900/10 text-amber-900 text-xs rounded-xl p-4 overflow-x-auto whitespace-pre-wrap font-mono">{migrationSql}</pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                      onClick={() => {
                        navigator.clipboard.writeText(migrationSql);
                        setSqlCopied(true);
                        setTimeout(() => setSqlCopied(false), 2000);
                      }}
                    >
                      {sqlCopied ? <><Check className="w-3 h-3 mr-1" /> Copied!</> : <><Copy className="w-3 h-3 mr-1" /> Copy SQL</>}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Albums section */}
            {!migrationSql && (
              <div>
                <h3 className="text-lg font-bold text-sage-700 mb-4 flex items-center gap-2">
                  <Images className="w-5 h-5 text-terracotta-500" /> Albums
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {albums.map(album => {
                    const albumPhotoCount = photos.filter(p => p.album_id === album.id).length;
                    return (
                      <div
                        key={album.id}
                        onClick={() => setPhotoAlbumFilter(photoAlbumFilter === album.id ? null : album.id)}
                        className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${
                          photoAlbumFilter === album.id
                            ? 'border-terracotta-500 shadow-lg shadow-terracotta-100'
                            : 'border-sage-100 hover:border-terracotta-300 hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-square bg-sage-100">
                          {album.cover_url ? (
                            <img src={album.cover_url} alt={album.name_en} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Images className="w-10 h-10 text-sage-300" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white font-bold text-sm line-clamp-1">{album.name_en}</p>
                          <p className="text-white/70 text-xs">{albumPhotoCount} photo{albumPhotoCount !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <button
                            onClick={e => { e.stopPropagation(); setEditingAlbum(album); setNewAlbum({ name_en: album.name_en, name_fr: album.name_fr || "" }); setShowAlbumForm(true); }}
                            className="bg-white/90 hover:bg-white rounded-lg p-1.5 text-terracotta-600"
                          ><Edit3 className="w-3.5 h-3.5" /></button>
                          <button
                            onClick={e => { e.stopPropagation(); handleDeleteAlbum(album.id); }}
                            className="bg-white/90 hover:bg-white rounded-lg p-1.5 text-red-500"
                          ><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => { resetAlbumForm(); setShowAlbumForm(true); }}
                    className="aspect-square rounded-2xl border-2 border-dashed border-sage-200 hover:border-terracotta-400 hover:bg-sage-50 transition-colors flex flex-col items-center justify-center gap-2 text-sage-400 hover:text-terracotta-500"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-sm font-medium">New Album</span>
                  </button>
                  {albums.length === 0 && (
                    <div className="col-span-full text-center py-8 text-sage-400">
                      <Images className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">No albums yet. Create one to organize your photos!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Photos filter bar */}
            {!migrationSql && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-sage-600">Filter:</span>
                <button
                  onClick={() => setPhotoAlbumFilter(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    photoAlbumFilter === null ? 'bg-terracotta-500 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                >All ({photos.length})</button>
                {albums.map(album => (
                  <button
                    key={album.id}
                    onClick={() => setPhotoAlbumFilter(photoAlbumFilter === album.id ? null : album.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      photoAlbumFilter === album.id ? 'bg-terracotta-500 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                    }`}
                  >{album.name_en} ({photos.filter(p => p.album_id === album.id).length})</button>
                ))}
                {albums.length > 0 && (
                  <button
                    onClick={() => setPhotoAlbumFilter('none')}
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                      photoAlbumFilter === 'none' ? 'bg-terracotta-500 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                    }`}
                  >Uncategorized ({photos.filter(p => !p.album_id).length})</button>
                )}
              </div>
            )}

            {/* Photos grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos
                .filter(p => {
                  if (photoAlbumFilter === null) return true;
                  if (photoAlbumFilter === 'none') return !p.album_id;
                  return p.album_id === photoAlbumFilter;
                })
                .map(photo => {
                  const album = albums.find(a => a.id === photo.album_id);
                  return (
                    <div key={photo.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                      <div className="aspect-square bg-slate-200 relative">
                        <img src={photo.url} alt={photo.caption_en || "Photo"} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleOpenEditPhoto(photo)} className="bg-white/90 hover:bg-white">
                            <Edit3 className="w-5 h-5 text-terracotta-500" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeletePhoto(photo.id, photo.url)}>
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        {album && (
                          <div className="absolute top-2 left-2">
                            <span className="bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">{album.name_en}</span>
                          </div>
                        )}
                      </div>
                      {(photo.caption_en || photo.caption_fr) && (
                        <div className="p-4">
                          <p className="text-sm text-sage-800 line-clamp-2">{photo.caption_en || photo.caption_fr}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              {photos.filter(p => {
                if (photoAlbumFilter === null) return true;
                if (photoAlbumFilter === 'none') return !p.album_id;
                return p.album_id === photoAlbumFilter;
              }).length === 0 && (
                <div className="col-span-full text-center py-12 text-terracotta-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{photoAlbumFilter ? "No photos in this album yet. Add photos and assign them to this album." : "No photos yet. Add your first photo!"}</p>
                </div>
              )}
            </div>
          </TabsContent>

            <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Partners</h2>
              <Button onClick={() => { resetPartnerForm(); setShowPartnerForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Partner
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm relative group text-center">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => handleOpenEditPartner(partner)} className="text-terracotta-400 hover:text-terracotta-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePartner(partner.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-sage-50 rounded-xl flex items-center justify-center">
                    {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" /> : <Handshake className="w-8 h-8 text-sage-200" />}
                  </div>
                  <h3 className="font-bold text-sage-800 text-sm">{partner.name}</h3>
                  <p className="text-xs text-sage-400 mt-1">{partner.type}</p>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="col-span-full text-center py-12 text-sage-400">
                  <Handshake className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No partners yet. Add your first partner!</p>
                </div>
              )}
            </div>
              </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.members.manage')}</h2>
                <Button onClick={() => { resetMemberForm(); setShowMemberForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.members.add')}
                </Button>
              </div>

              <div className="grid gap-4">
                {members.map(member => (
                  <div key={member.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-sage-100 flex-shrink-0">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-sage-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-sage-800 truncate">{member.name}</h3>
                      <p className="text-terracotta-500 text-sm font-medium">
                        {language === 'fr' ? member.role_fr : member.role_en}
                      </p>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-1">
                        {language === 'fr' ? member.bio_fr : member.bio_en}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-sage-400 font-bold">
                      #{member.display_order}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleOpenEditMember(member)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button onClick={() => handleDeleteMember(member.id, member.photo_url)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-center py-12 text-sage-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('admin.members.empty')}</p>
                  </div>
                )}
              </div>
            </TabsContent>

              <TabsContent value="history" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">Update History</h2>
                <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-sage-800">{item.admin_user}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-bold">
                            {item.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-600 italic">{item.details}</td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No history records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">System Logs</h2>
                <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            log.level === 'error' ? 'bg-red-100 text-red-700' : 
                            log.level === 'warning' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-800 font-medium">{log.message}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No system logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">Donation Receipts</h2>
                <div className="flex gap-3">
                  <div className="bg-terracotta-50 px-4 py-2 rounded-xl border border-terracotta-100">
                    <span className="text-xs text-terracotta-600 font-bold uppercase block leading-none mb-1">Total Received</span>
                    <span className="text-xl font-black text-terracotta-700">
                      ${donations.reduce((acc, d) => acc + (d.status === 'completed' ? Number(d.amount) : 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(donation.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-sage-800">{donation.donor_name || 'Anonymous'}</span>
                            <span className="text-xs text-sage-400">{donation.donor_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-sage-800">
                          {donation.currency.toUpperCase()} {Number(donation.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            donation.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            donation.status === 'failed' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {donation.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No donation records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="missions" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{language === 'fr' ? 'Gérer les Missions' : 'Manage Missions'}</h2>
                <Button onClick={() => { resetMissionForm(); setShowMissionForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {language === 'fr' ? 'Ajouter une Mission' : 'Add Mission'}
                </Button>
              </div>
              <div className="grid gap-4">
                {missions.map(m => (
                  <div key={m.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-sage-50 rounded-xl flex items-center justify-center border border-sage-100 flex-shrink-0">
                      <Target className="w-6 h-6 text-terracotta-500" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-sage-800 truncate">{m.title_en}</h3>
                      <p className="text-terracotta-500 text-sm font-medium">{m.title_fr}</p>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-1">{m.description_en}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleOpenEditMission(m)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button onClick={() => handleDeleteMission(m.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {missions.length === 0 && (
                  <div className="text-center py-12 text-sage-400">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{language === 'fr' ? 'Aucune mission. Les missions par défaut seront affichées.' : 'No missions yet. Default missions will be shown.'}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            </div>
          </Tabs>
      </div>

      {/* Forms (Modals-like) */}
      <AnimatePresence>
        {showEventForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={() => setShowEventForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Event</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEventForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (EN)</label>
                    <Input value={newEvent.title_en} onChange={e => setNewEvent({...newEvent, title_en: e.target.value})} placeholder="Event title in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (FR)</label>
                    <Input value={newEvent.title_fr} onChange={e => setNewEvent({...newEvent, title_fr: e.target.value})} placeholder="Titre de l'événement en Français" className="rounded-xl" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Date</label>
                    <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Location (EN)</label>
                    <Input value={newEvent.location_en} onChange={e => setNewEvent({...newEvent, location_en: e.target.value})} placeholder="Location in English" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Description (EN)</label>
                  <Textarea value={newEvent.description_en} onChange={e => setNewEvent({...newEvent, description_en: e.target.value})} placeholder="Detailed description in English" className="rounded-xl min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Description (FR)</label>
                  <Textarea value={newEvent.description_fr} onChange={e => setNewEvent({...newEvent, description_fr: e.target.value})} placeholder="Description détaillée en Français" className="rounded-xl min-h-[100px]" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                <Button variant="ghost" onClick={() => setShowEventForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddEvent} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">Save Event</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showVideoForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetVideoForm} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">{editingVideo ? "Edit Video" : "Add New Video"}</h2>
                <Button variant="ghost" size="icon" onClick={resetVideoForm} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (EN)</label>
                    <Input value={newVideo.title_en} onChange={e => setNewVideo({...newVideo, title_en: e.target.value})} placeholder="Video title" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (FR)</label>
                    <Input value={newVideo.title_fr} onChange={e => setNewVideo({...newVideo, title_fr: e.target.value})} placeholder="Titre de la vidéo" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Video URL (YouTube/Vimeo)</label>
                  <Input value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Thumbnail URL</label>
                  <Input value={newVideo.thumbnail_url} onChange={e => setNewVideo({...newVideo, thumbnail_url: e.target.value})} placeholder="Image URL for preview" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Category</label>
                  <select 
                    value={newVideo.category} 
                    onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full h-11 rounded-xl border border-sage-100 bg-white px-3 text-sm focus:ring-2 focus:ring-terracotta-400 outline-none"
                  >
                    <option value="conservation">Conservation</option>
                    <option value="educational">Educational</option>
                    <option value="fieldwork">Fieldwork</option>
                  </select>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                <Button variant="ghost" onClick={resetVideoForm} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleSaveVideo} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">{editingVideo ? "Update Video" : "Save Video"}</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showPartnerForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetPartnerForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingPartner ? "Edit Partner" : "Add New Partner"}</h2>
                  <Button variant="ghost" size="icon" onClick={resetPartnerForm} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Partner Name</label>
                    <Input value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} placeholder="Organization Name" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Website URL</label>
                    <Input value={newPartner.website_url} onChange={e => setNewPartner({...newPartner, website_url: e.target.value})} placeholder="https://..." className="rounded-xl" />
                  </div>
                  <DragDropImageUpload
                      value={newPartner.logo_url}
                      onChange={(url) => setNewPartner({...newPartner, logo_url: url})}
                      bucket="photos"
                      folder="partners"
                      label="Partner Logo"
                    />
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Type</label>
                    <select 
                      value={newPartner.type} 
                      onChange={e => setNewPartner({...newPartner, type: e.target.value})}
                      className="w-full h-11 rounded-xl border border-sage-100 bg-white px-3 text-sm focus:ring-2 focus:ring-terracotta-400 outline-none"
                    >
                      <option value="international">International</option>
                      <option value="local">Local</option>
                      <option value="governmental">Governmental</option>
                    </select>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={resetPartnerForm} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleSavePartner} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">{editingPartner ? "Update Partner" : "Save Partner"}</Button>
                </div>
              </motion.div>
            </div>
          )}

          {showPhotoForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetPhotoForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingPhoto ? "Edit Photo" : "Add New Photo"}</h2>
                  <Button variant="ghost" size="icon" onClick={resetPhotoForm} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">Photo File</label>
                      {editingPhoto && editingPhoto.url && !selectedFile && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-sage-200">
                          <img src={editingPhoto.url} alt="Current" className="w-full h-40 object-cover" />
                          <p className="text-xs text-sage-400 p-2 text-center">Current photo (drop a new file to replace)</p>
                        </div>
                      )}
                      <div
                        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="photo-upload"
                        />
                          {selectedFile ? (
                            <div className="text-center">
                              <ImageIcon className="w-8 h-8 mx-auto text-terracotta-500 mb-2" />
                              <p className="text-sm text-sage-800 font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-terracotta-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 mx-auto text-terracotta-400 mb-2" />
                              <p className="text-sm text-terracotta-500 font-medium">Drag & drop or click to upload</p>
                              <p className="text-xs text-terracotta-400">JPG, PNG, GIF up to 10MB</p>
                            </div>
                          )}
                      </div>
                    </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Caption (EN)</label>
                    <Input value={newPhoto.caption_en} onChange={e => setNewPhoto({...newPhoto, caption_en: e.target.value})} placeholder="Photo description in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Caption (FR)</label>
                    <Input value={newPhoto.caption_fr} onChange={e => setNewPhoto({...newPhoto, caption_fr: e.target.value})} placeholder="Description en Français" className="rounded-xl" />
                  </div>
                  {albums.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">Album (optional)</label>
                      <select
                        value={newPhoto.album_id}
                        onChange={e => setNewPhoto({...newPhoto, album_id: e.target.value})}
                        className="w-full h-11 rounded-xl border border-sage-100 bg-white px-3 text-sm focus:ring-2 focus:ring-terracotta-400 outline-none"
                      >
                        <option value="">— No album —</option>
                        {albums.map(album => (
                          <option key={album.id} value={album.id}>{album.name_en}{album.name_fr ? ` / ${album.name_fr}` : ''}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={resetPhotoForm} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleSavePhoto} disabled={uploading || (!editingPhoto && !selectedFile)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </span>
                    ) : editingPhoto ? "Update Photo" : "Upload Photo"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

            {showMemberForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetMemberForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingMember ? t('admin.members.edit') : t('admin.members.add')}</h2>
                  <Button variant="ghost" size="icon" onClick={resetMemberForm} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.photo')}</label>
                    <div className="flex items-center gap-6">
                      {(memberPhotoFile || editingMember?.photo_url) && (
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-sage-100 flex-shrink-0">
                          <img
                            src={memberPhotoFile ? URL.createObjectURL(memberPhotoFile) : editingMember?.photo_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                        <div className="flex-grow">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && setMemberPhotoFile(e.target.files[0])}
                            className="hidden"
                            id="member-photo-upload"
                          />
                          <div
                            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setMemberPhotoFile(f); }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById('member-photo-upload')?.click()}
                            className="flex items-center justify-center gap-3 w-full h-24 border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="w-6 h-6 mx-auto text-terracotta-400 mb-1" />
                              <p className="text-sm text-terracotta-500 font-medium">{t('admin.members.uploadPhoto')}</p>
                              <p className="text-xs text-sage-400">Drag & drop or click</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.photoUrl')}</label>
                      <Input value={newMember.photo_url} onChange={e => setNewMember({...newMember, photo_url: e.target.value})} placeholder="/images/photo.jpg or https://..." className="rounded-xl" />
                      <p className="text-xs text-sage-400">{t('admin.members.photoUrlHint')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.members.name')}</label>
                      <Input value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Full name" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.order')}</label>
                      <Input type="number" value={newMember.display_order} onChange={e => setNewMember({...newMember, display_order: parseInt(e.target.value) || 0})} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.roleEn')}</label>
                      <Input value={newMember.role_en} onChange={e => setNewMember({...newMember, role_en: e.target.value})} placeholder="Role in English" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.roleFr')}</label>
                      <Input value={newMember.role_fr} onChange={e => setNewMember({...newMember, role_fr: e.target.value})} placeholder="Rôle en Français" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.bioEn')}</label>
                    <Textarea value={newMember.bio_en} onChange={e => setNewMember({...newMember, bio_en: e.target.value})} placeholder="Short bio in English" className="rounded-xl min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.bioFr')}</label>
                    <Textarea value={newMember.bio_fr} onChange={e => setNewMember({...newMember, bio_fr: e.target.value})} placeholder="Courte bio en Français" className="rounded-xl min-h-[80px]" />
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={resetMemberForm} className="rounded-xl font-bold">{t('admin.members.cancel')}</Button>
                  <Button onClick={handleSaveMember} disabled={uploadingMember} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                    {uploadingMember ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : t('admin.members.save')}
                  </Button>
                </div>
              </motion.div>
            </div>
            )}

            {showNewsForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetNewsForm} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                  <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-black">{editingNews ? t('admin.news.edit') : t('admin.news.add')}</h2>
                    <Button variant="ghost" size="icon" onClick={resetNewsForm} className="text-white/60 hover:text-white">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.news.titleEn')}</label>
                        <Input value={newNews.title_en} onChange={e => setNewNews({...newNews, title_en: e.target.value})} placeholder={t('admin.news.placeholderTitleEn')} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.news.titleFr')}</label>
                        <Input value={newNews.title_fr} onChange={e => setNewNews({...newNews, title_fr: e.target.value})} placeholder={t('admin.news.placeholderTitleFr')} className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">Publication Date</label>
                      <Input type="date" value={newNews.published_at} onChange={e => setNewNews({...newNews, published_at: e.target.value})} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.news.contentEn')}</label>
                      <Textarea value={newNews.content_en} onChange={e => setNewNews({...newNews, content_en: e.target.value})} placeholder={t('admin.news.placeholderContentEn')} className="rounded-xl min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.news.contentFr')}</label>
                      <Textarea value={newNews.content_fr} onChange={e => setNewNews({...newNews, content_fr: e.target.value})} placeholder={t('admin.news.placeholderContentFr')} className="rounded-xl min-h-[120px]" />
                    </div>
                    <DragDropImageUpload
                        value={newNews.image_url}
                        onChange={(url) => setNewNews({...newNews, image_url: url})}
                        bucket="photos"
                        folder="news"
                        label={t('admin.news.imageUrl')}
                      />
                  </div>
                  <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                    <Button variant="ghost" onClick={resetNewsForm} className="rounded-xl font-bold">{t('admin.cancel')}</Button>
                    <Button onClick={handleSaveNews} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">
                      {t('admin.news.save')}
                    </Button>
                  </div>
                </motion.div>
              </div>
              )}

              {showProjectForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetProjectForm} />
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                    <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                      <h2 className="text-2xl font-black">{editingProject ? t('admin.projects.edit') : t('admin.projects.add')}</h2>
                      <Button variant="ghost" size="icon" onClick={resetProjectForm} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.titleEn')}</label>
                          <Input value={newProject.title_en} onChange={e => setNewProject({...newProject, title_en: e.target.value})} placeholder="Project title in English" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.titleFr')}</label>
                          <Input value={newProject.title_fr} onChange={e => setNewProject({...newProject, title_fr: e.target.value})} placeholder="Titre du projet en Français" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.projects.descEn')}</label>
                        <Textarea value={newProject.description_en} onChange={e => setNewProject({...newProject, description_en: e.target.value})} placeholder="Description in English" className="rounded-xl min-h-[120px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.projects.descFr')}</label>
                        <Textarea value={newProject.description_fr} onChange={e => setNewProject({...newProject, description_fr: e.target.value})} placeholder="Description en Français" className="rounded-xl min-h-[120px]" />
                      </div>
                      <DragDropImageUpload
                          value={newProject.image_url}
                          onChange={(url) => setNewProject({...newProject, image_url: url})}
                          bucket="photos"
                          folder="projects"
                          label={t('admin.projects.imageUrl')}
                        />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.categoryEn')}</label>
                          <Input value={newProject.category_en} onChange={e => setNewProject({...newProject, category_en: e.target.value})} placeholder="Conservation" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.categoryFr')}</label>
                          <Input value={newProject.category_fr} onChange={e => setNewProject({...newProject, category_fr: e.target.value})} placeholder="Conservation" className="rounded-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                      <Button variant="ghost" onClick={resetProjectForm} className="rounded-xl font-bold">{t('admin.cancel')}</Button>
                      <Button onClick={handleSaveProject} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">
                        {t('admin.projects.save')}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
              {showReportForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetReportForm} />
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                    <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                      <h2 className="text-2xl font-black">{editingReport ? t('admin.reports.edit') : t('admin.reports.add')}</h2>
                      <Button variant="ghost" size="icon" onClick={resetReportForm} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.reports.titleEn')}</label>
                          <Input value={newReport.title_en} onChange={e => setNewReport({...newReport, title_en: e.target.value})} placeholder="Report title in English" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.reports.titleFr')}</label>
                          <Input value={newReport.title_fr} onChange={e => setNewReport({...newReport, title_fr: e.target.value})} placeholder="Titre du rapport en Français" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.reports.descEn')}</label>
                        <Textarea value={newReport.description_en} onChange={e => setNewReport({...newReport, description_en: e.target.value})} placeholder="Short description in English" className="rounded-xl min-h-[80px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.reports.descFr')}</label>
                        <Textarea value={newReport.description_fr} onChange={e => setNewReport({...newReport, description_fr: e.target.value})} placeholder="Courte description en Français" className="rounded-xl min-h-[80px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.reports.year')}</label>
                        <Input value={newReport.year} onChange={e => setNewReport({...newReport, year: e.target.value})} placeholder="2024" className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.reports.uploadPdf')}</label>
                        <div className="border-2 border-dashed border-sage-200 rounded-xl p-6 text-center hover:border-terracotta-300 transition-colors">
                          <input
                            type="file"
                            accept=".pdf"
                            id="report-pdf-upload"
                            className="hidden"
                            onChange={e => setReportPdfFile(e.target.files?.[0] || null)}
                          />
                          <label htmlFor="report-pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                            <FileText className="w-10 h-10 text-sage-300" />
                            {reportPdfFile ? (
                              <span className="text-sm font-bold text-sage-700">{reportPdfFile.name}</span>
                            ) : (
                              <span className="text-sm text-sage-500">Click to upload PDF</span>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.reports.fileUrl')}</label>
                        <Input value={newReport.file_url} onChange={e => setNewReport({...newReport, file_url: e.target.value})} placeholder="https://... (or upload above)" className="rounded-xl" />
                        <p className="text-xs text-sage-400">Upload takes priority if both provided.</p>
                      </div>
                    </div>
                    <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                      <Button variant="ghost" onClick={resetReportForm} className="rounded-xl font-bold">{t('admin.cancel')}</Button>
                      <Button onClick={handleSaveReport} disabled={uploadingReport} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                        {uploadingReport ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                          </span>
                        ) : t('admin.reports.save')}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
        {showAlbumForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetAlbumForm} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">{editingAlbum ? "Edit Album" : "Create New Album"}</h2>
                  {!editingAlbum && <p className="text-sage-300 text-sm mt-1">Upload multiple photos to add to this album</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={resetAlbumForm} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Album Name (EN) *</label>
                    <Input value={newAlbum.name_en} onChange={e => setNewAlbum({...newAlbum, name_en: e.target.value})} placeholder="Album name in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Album Name (FR)</label>
                    <Input value={newAlbum.name_fr} onChange={e => setNewAlbum({...newAlbum, name_fr: e.target.value})} placeholder="Nom de l'album en Français" className="rounded-xl" />
                  </div>
                </div>
                {!editingAlbum && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Photos <span className="text-sage-400 font-normal">(select multiple)</span></label>
                    <div
                      onDrop={e => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                        setAlbumBulkFiles(prev => [...prev, ...files]);
                      }}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => document.getElementById('album-photos-upload')?.click()}
                      className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors p-4"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || []);
                          setAlbumBulkFiles(prev => [...prev, ...files]);
                        }}
                        className="hidden"
                        id="album-photos-upload"
                      />
                      {albumBulkFiles.length > 0 ? (
                        <div className="w-full">
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {albumBulkFiles.map((f, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-sage-100">
                                <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
                                <button
                                  onClick={ev => { ev.stopPropagation(); setAlbumBulkFiles(prev => prev.filter((_, j) => j !== i)); }}
                                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"
                                ><X className="w-3 h-3" /></button>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-terracotta-500 font-medium text-center">{albumBulkFiles.length} photo{albumBulkFiles.length !== 1 ? 's' : ''} selected — click to add more</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-10 h-10 mx-auto text-terracotta-400 mb-2" />
                          <p className="text-sm text-terracotta-500 font-medium">Drag & drop or click to select photos</p>
                          <p className="text-xs text-sage-400 mt-1">Select multiple photos at once</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                <Button variant="ghost" onClick={resetAlbumForm} className="rounded-xl font-bold">Cancel</Button>
                <Button
                  onClick={handleSaveAlbum}
                  disabled={uploadingAlbum || (!editingAlbum && albumBulkFiles.length === 0 && !newAlbum.name_en.trim())}
                  className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50"
                >
                  {uploadingAlbum ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {editingAlbum ? "Saving..." : `Uploading ${albumBulkFiles.length} photo${albumBulkFiles.length !== 1 ? 's' : ''}...`}
                    </span>
                  ) : editingAlbum ? "Update Album" : "Create Album"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {showMissionForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetMissionForm} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-8 z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-sage-800">{editingMission ? (language === 'fr' ? 'Modifier la Mission' : 'Edit Mission') : (language === 'fr' ? 'Nouvelle Mission' : 'New Mission')}</h3>
                <button onClick={resetMissionForm} className="text-sage-400 hover:text-sage-600"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-sage-700 mb-1">Title (EN) *</label>
                  <Input value={newMission.title_en} onChange={e => setNewMission({ ...newMission, title_en: e.target.value })} placeholder="Mission title in English" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-sage-700 mb-1">Titre (FR)</label>
                  <Input value={newMission.title_fr} onChange={e => setNewMission({ ...newMission, title_fr: e.target.value })} placeholder="Titre de la mission en français" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-sage-700 mb-1">Description (EN)</label>
                  <Textarea value={newMission.description_en} onChange={e => setNewMission({ ...newMission, description_en: e.target.value })} rows={3} placeholder="Description in English" className="rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-sage-700 mb-1">Description (FR)</label>
                  <Textarea value={newMission.description_fr} onChange={e => setNewMission({ ...newMission, description_fr: e.target.value })} rows={3} placeholder="Description en français" className="rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-sage-700 mb-1">Icon</label>
                    <select value={newMission.icon} onChange={e => setNewMission({ ...newMission, icon: e.target.value })} className="w-full h-10 rounded-xl border border-input bg-white px-3 text-sm">
                      {['shield','book','search','target','leaf','education','tree','globe','sprout'].map(ic => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-sage-700 mb-1">Display Order</label>
                    <Input type="number" value={newMission.display_order} onChange={e => setNewMission({ ...newMission, display_order: parseInt(e.target.value) || 0 })} className="rounded-xl" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleSaveMission} className="flex-1 bg-terracotta-500 hover:bg-terracotta-600 rounded-xl font-bold">
                  <Save className="w-4 h-4 mr-2" /> {editingMission ? 'Update' : 'Save'}
                </Button>
                <Button onClick={resetMissionForm} variant="outline" className="rounded-xl">Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
            </AnimatePresence>
    </div>
  );
}
