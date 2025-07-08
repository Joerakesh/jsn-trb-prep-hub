import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Star,
  MessageCircle,
  QrCode,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  format: string;
  image_url: string;
  preview_url: string;
  preview_pages: number;
}

const convertToPreviewLink = (url: string): string => {
  if (!url.includes("drive.google.com")) return url;

  const fileIdMatch = url.match(/\/file\/d\/([^/]+)\//);
  if (!fileIdMatch) return url;

  const fileId = fileIdMatch[1];
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: material,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["material", id],
    queryFn: async () => {
      if (!id) throw new Error("Material ID is required");

      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data as Material;
    },
    enabled: !!id,
  });

  const handleContactAdmin = () => {
    if (!user) {
      toast.error("Please login to contact admin");
      navigate("/login");
      return;
    }

    if (!material) return;

    const message = `Hi, I'm interested in purchasing: ${material.title}`;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleViewInGoogleDrive = () => {
    if (material?.preview_url) {
      const previewLink = convertToPreviewLink(material.preview_url);
      window.open(previewLink, "_blank");
    } else {
      toast.info("Google Drive link not available");
    }
  };

  const formatCategory = (category: string) => {
    return category.replace("_", " ");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "UG_TRB":
        return "bg-blue-100 text-blue-800";
      case "PG_TRB":
        return "bg-purple-100 text-purple-800";
      case "General":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Loading material details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-lg text-red-600 mb-4">Material not found</div>
          <Button onClick={() => navigate("/materials")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Materials
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/materials")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - PDF Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Material Preview
                </CardTitle>
                <CardDescription>
                  Preview the first {material.preview_pages} pages of this
                  material
                </CardDescription>
              </CardHeader>
              <CardContent>
                {material.preview_url ? (
                  <div className="space-y-4">
                    {/* PDF Embed */}
                    <div className="w-full h-96 border rounded-lg overflow-hidden">
                      <embed
                        src={convertToPreviewLink(material.preview_url)}
                        type="application/pdf"
                        className="w-full h-full"
                        title="Material Preview"
                      />
                    </div>

                    {/* View in Google Drive Button */}
                    <Button
                      onClick={handleViewInGoogleDrive}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View in Google Drive
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-96 border rounded-lg flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Preview not available</p>
                      <p className="text-sm text-gray-400">
                        Contact admin for more details
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Material Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <Badge className={getCategoryColor(material.category)}>
                    {formatCategory(material.category)}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">
                  {material.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {material.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Material Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-5 w-5" />
                    <span>{material.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="h-5 w-5" />
                    <span>{material.format}</span>
                  </div>
                </div>

                {/* Purchase Process */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">How to Purchase</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold text-blue-600">
                          1
                        </div>
                        <p className="text-sm">
                          Contact admin via WhatsApp for pricing and
                          availability
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold text-blue-600">
                          2
                        </div>
                        <p className="text-sm">
                          Pay using GPay QR code and share payment screenshot
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold text-blue-600">
                          3
                        </div>
                        <p className="text-sm">
                          Receive the complete material via courier delivery
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleContactAdmin}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact Admin
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1">
                            <QrCode className="h-4 w-4 mr-2" />
                            View GPay QR
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Payment via GPay</DialogTitle>
                            <DialogDescription>
                              Scan the QR code below to make payment and share
                              the screenshot with admin on WhatsApp
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center justify-center p-6">
                            <div className="bg-white p-4 rounded-lg shadow-lg">
                              <img
                                src="/gpay.jpg"
                                alt="GPay QR Code"
                                className="w-48 h-48 border"
                              />
                            </div>
                          </div>
                          <div className="text-center text-sm text-gray-600">
                            After payment, share screenshot with admin for order
                            confirmation
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Download className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">
                          Physical Delivery
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Materials are delivered as physical copies via courier
                          service after payment confirmation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MaterialDetail;
