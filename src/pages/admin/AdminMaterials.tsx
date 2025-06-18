
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  pages: number;
  format: string;
  is_active: boolean;
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
    format: "PDF"
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['admin_materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Material[];
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
        format: "PDF"
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
      format: material.format || "PDF"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      deleteMaterial.mutate(id);
    }
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
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Manage Materials</h1>
            <p className="text-xl text-blue-100">Add, edit, and manage study materials</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
                <DialogDescription>
                  {editingMaterial ? "Update the material details" : "Create a new study material"}
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
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  required
                />
                
                <Input
                  type="number"
                  placeholder="Number of pages"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: Number(e.target.value)})}
                />
                
                <Input
                  placeholder="Format (e.g., PDF, Printed)"
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                />
                
                <Button type="submit" className="w-full" disabled={saveMaterial.isPending}>
                  {saveMaterial.isPending ? "Saving..." : editingMaterial ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Materials List */}
      <section className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="text-center">Loading materials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant={material.is_active ? "default" : "secondary"}>
                      {material.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(material)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(material.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle>{material.title}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Category:</strong> {material.category.replace('_', ' ')}</p>
                    <p><strong>Price:</strong> ₹{material.price}</p>
                    <p><strong>Pages:</strong> {material.pages}</p>
                    <p><strong>Format:</strong> {material.format}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default AdminMaterials;
