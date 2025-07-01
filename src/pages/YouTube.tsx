
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Play, ExternalLink, Users, Video, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail_url: string;
  created_at: string;
}

const YouTube = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['youtube-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Video[];
    },
  });

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url: string) => {
    const videoId = extractVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading videos...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Channel Header Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Video className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">JSN Academy</h1>
              <p className="text-xl text-red-100 mb-6 max-w-2xl">
                Your trusted partner for TRB exam preparation. Subscribe to our channel for expert guidance, 
                study materials, and exam strategies that lead to success.
              </p>
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>1000+ Subscribers</span>
                </div>
                <div className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  <span>{videos.length} Videos</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  <span>50K+ Views</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button 
                  asChild
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  <a 
                    href="https://www.youtube.com/@jsnacademy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit YouTube Channel
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-12 max-w-md mx-auto">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Available</h3>
                <p className="text-gray-600">
                  {searchTerm ? "No videos found matching your search." : "Videos will be added soon. Stay tuned!"}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Educational Videos</h2>
                <p className="text-lg text-gray-600">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => {
                  const embedUrl = getEmbedUrl(video.youtube_url);
                  
                  return (
                    <Card key={video.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-0">
                        {embedUrl ? (
                          <div className="aspect-video">
                            <iframe
                              src={embedUrl}
                              title={video.title}
                              className="w-full h-full rounded-t-lg"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                            <Play className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="text-lg mb-2 line-clamp-2">{video.title}</CardTitle>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(video.created_at).toLocaleDateString()}
                          </span>
                          <a
                            href={video.youtube_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Watch on YouTube →
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Channel Info Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Subscribe to Our Channel</h2>
              <p className="text-gray-600 mb-6">
                Stay updated with our latest educational videos, exam tips, and study strategies. Our YouTube channel features:
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Subject-wise video lectures
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Exam preparation strategies
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Previous year question analysis
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Tips and tricks for TRB exams
                </li>
              </ul>
            </div>
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="YouTube learning" 
                className="rounded-lg shadow-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default YouTube;
