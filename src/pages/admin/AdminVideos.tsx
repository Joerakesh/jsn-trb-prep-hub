
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url?: string;
  created_at: string;
}

const AdminVideos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: ""
  });

  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-youtube-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Video[];
    },
  });

  const addVideoMutation = useMutation({
    mutationFn: async (videoData: { title: string; description: string; youtube_url: string }) => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .insert([videoData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] });
      queryClient.invalidateQueries({ queryKey: ['youtube-videos'] });
      toast.success("Video added successfully!");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add video: " + error.message);
    },
  });

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, ...videoData }: { id: string; title: string; description: string; youtube_url: string }) => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .update(videoData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] });
      queryClient.invalidateQueries({ queryKey: ['youtube-videos'] });
      toast.success("Video updated successfully!");
      setIsDialogOpen(false);
      setEditingVideo(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update video: " + error.message);
    },
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-youtube-videos'] });
      queryClient.invalidateQueries({ queryKey: ['youtube-videos'] });
      toast.success("Video deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete video: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtube_url: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, ...formData });
    } else {
      addVideoMutation.mutate(formData);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      youtube_url: video.youtube_url
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      deleteVideoMutation.mutate(id);
    }
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">YouTube Videos Management</h1>
            <p className="text-gray-600 mt-2">Manage your YouTube channel videos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingVideo(null);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
                <DialogDescription>
                  {editingVideo ? "Update the video information below." : "Add a new YouTube video to your channel."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Video Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter video description"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={addVideoMutation.isPending || updateVideoMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {addVideoMutation.isPending || updateVideoMutation.isPending ? "Saving..." : (editingVideo ? "Update" : "Add")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Videos ({videos.length})</CardTitle>
            <CardDescription>
              Manage your YouTube channel videos and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading videos...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No videos added yet. Add your first video!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Preview</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video) => {
                    const videoId = extractVideoId(video.youtube_url);
                    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
                    
                    return (
                      <TableRow key={video.id}>
                        <TableCell>
                          {thumbnailUrl ? (
                            <img 
                              src={thumbnailUrl} 
                              alt={video.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <Play className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{video.title}</div>
                        </TableCell>
                        <TableCell className="max-w-sm">
                          <div className="truncate text-gray-600">{video.description}</div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(video.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(video.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVideos;
