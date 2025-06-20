
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SampleMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  pages: number;
  format: string;
  download_url: string;
  is_active: boolean;
}

const AdminSamples = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<SampleMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UG_TRB",
    pages: 0,
    format: "PDF",
    download_url: ""
  });

  const { data: samples = [], isLoading } = useQuery({
    queryKey: ['admin_samples'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sample_materials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SampleMaterial[];
    },
    enabled: isAdmin
  });

  const saveSample = useMutation({
    mutationFn: async (data: any) => {
      if (editingSample) {
        const { error } = await supabase
          .from('sample_materials')
          .update(data)
          .eq('id', editingSample.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sample_materials')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_samples'] });
      setIsDialogOpen(false);
      setEditingSample(null);
      setFormData({
        title: "",
        description: "",
        category: "UG_TRB",
        pages: 0,
        format: "PDF",
        download_url: ""
      });
      toast.success(editingSample ? "Sample updated successfully" : "Sample created successfully");
    },
    onError: (error) => {
      console.error('Error saving sample:', error);
      toast.error("Failed to save sample");
    }
  });

  const deleteSample = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sample_materials')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_samples'] });
      toast.success("Sample deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting sample:', error);
      toast.error("Failed to delete sample");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSample.mutate(formData);
  };

  const handleEdit = (sample: SampleMaterial) => {
    setEditingSample(sample);
    setFormData({
      title: sample.title,
      description: sample.description || "",
      category: sample.category,
      pages: sample.pages || 0,
      format: sample.format || "PDF",
      download_url: sample.download_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this sample material?")) {
      deleteSample.mutate(id);
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
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sample Materials</h1>
            <p className="text-green-100">Manage free sample materials for students</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Sample
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingSample ? "Edit Sample" : "Add New Sample"}</DialogTitle>
                <DialogDescription>
                  {editingSample ? "Update the sample details" : "Create a new sample material"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Sample title"
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
                  placeholder="Number of pages"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: Number(e.target.value)})}
                />
                
                <Input
                  placeholder="Format (e.g., PDF, DOC)"
                  value={formData.format}
                  onChange={(e) => setFormData({...formData, format: e.target.value})}
                />
                
                <Input
                  placeholder="Download URL"
                  value={formData.download_url}
                  onChange={(e) => setFormData({...formData, download_url: e.target.value})}
                />
                
                <Button type="submit" className="w-full" disabled={saveSample.isPending}>
                  {saveSample.isPending ? "Saving..." : editingSample ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Samples Table */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Sample Materials ({samples.length})</CardTitle>
            <CardDescription>Manage all sample materials available for download</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading samples...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Pages</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samples.map((sample) => (
                    <TableRow key={sample.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{sample.title}</p>
                          <p className="text-sm text-gray-500">{sample.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sample.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{sample.pages}</TableCell>
                      <TableCell>{sample.format}</TableCell>
                      <TableCell>
                        <Badge variant={sample.is_active ? "default" : "secondary"}>
                          {sample.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {sample.download_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={sample.download_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(sample)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(sample.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default AdminSamples;
