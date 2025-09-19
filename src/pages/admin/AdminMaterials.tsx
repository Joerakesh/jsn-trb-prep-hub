
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  pages: number;
  format: string;
  preview_url: string | null;
  preview_pages: number | null;
}

const AdminMaterials = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UG_TRB",
    price: 0,
    pages: 0,
    format: "PDF",
    preview_url: "",
    preview_pages: 3
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['admin_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('id, title, description, category, price, pages, format, preview_url, preview_pages')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any;
    },
    enabled: isAdmin
  });

  const saveMaterial = useMutation({
    mutationFn: async (data: any) => {
      if (editingMaterial) {
        const { error } = await supabase
          .from('materials')
          .update(data)
          .eq('id', editingMaterial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('materials')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setIsDialogOpen(false);
      setEditingMaterial(null);
      setFormData({
        title: "",
        description: "",
        category: "UG_TRB",
        price: 0,
        pages: 0,
        format: "PDF",
        preview_url: "",
        preview_pages: 3
      });
      toast.success(editingMaterial ? "Material updated successfully" : "Material created successfully");
    },
    onError: (error) => {
      console.error('Error saving material:', error);
      toast.error("Failed to save material");
    }
  });

  const deleteMaterial = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast.success("Material deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting material:', error);
      toast.error("Failed to delete material");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMaterial.mutate(formData);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || "",
      category: material.category,
      price: material.price,
      pages: material.pages || 0,
      format: material.format || "PDF",
      preview_url: material.preview_url || "",
      preview_pages: material.preview_pages || 3
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMaterial.mutate(id);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
            <p className="text-blue-100">Add, edit, and manage study materials with Google Drive previews</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
                <DialogDescription>
                  {editingMaterial ? "Update the material details" : "Create a new study material with Google Drive preview"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Material title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                
                <Textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
                
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UG_TRB">UG TRB</SelectItem>
                    <SelectItem value="PG_TRB">PG TRB</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  type="number"
                  placeholder="Price (₹)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
                
                <Input
                  type="number"
                  placeholder="Total number of pages"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: Number(e.target.value)})}
                  required
                />
                
                <Input
                  placeholder="Format (e.g., PDF, Printed)"
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Google Drive Preview Link</label>
                  <Input
                    placeholder="https://drive.google.com/file/d/your-file-id/view"
                    value={formData.preview_url}
                    onChange={(e) => setFormData({...formData, preview_url: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">
                    Upload sample pages to Google Drive and paste the shareable link here
                  </p>
                </div>
                
                <Input
                  type="number"
                  placeholder="Number of preview pages"
                  value={formData.preview_pages}
                  onChange={(e) => setFormData({...formData, preview_pages: Number(e.target.value)})}
                  min={1}
                  max={10}
                />
                
                <Button type="submit" className="w-full" disabled={saveMaterial.isPending}>
                  {saveMaterial.isPending ? "Saving..." : editingMaterial ? "Update Material" : "Create Material"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Study Materials ({materials.length})</CardTitle>
            <CardDescription>Manage all study materials and their previews</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading materials...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <Card key={material.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="default">
                          Active
                        </Badge>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                  Delete Material
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{material.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(material.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Category:</span> {material.category.replace('_', ' ')}</p>
                        <p><span className="font-medium">Price:</span> ₹{material.price}</p>
                        <p><span className="font-medium">Pages:</span> {material.pages}</p>
                        <p><span className="font-medium">Format:</span> {material.format}</p>
                        {material.preview_url && (
                          <p><span className="font-medium">Preview:</span> {material.preview_pages} pages</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default AdminMaterials;
