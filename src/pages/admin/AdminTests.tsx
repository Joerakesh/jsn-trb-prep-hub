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
import { Plus, Edit, Trash2, Users, ExternalLink, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Test {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  questions: string;
  google_form_url: string;
  participants_count: number;
  is_active: boolean;
}

const AdminTests = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UG_TRB",
    duration: "",
    difficulty: "Medium",
    questions: "",
    google_form_url: ""
  });

  // Reset form data
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "UG_TRB",
      duration: "",
      difficulty: "Medium",
      questions: "",
      google_form_url: ""
    });
    setEditingTest(null);
  };

  const { data: tests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tests:', error);
        throw error;
      }
      return data as Test[];
    },
    enabled: isAdmin
  });

  const saveTest = useMutation({
    mutationFn: async (data: any) => {
      setIsSubmitting(true);
      try {
        if (editingTest) {
          const { error } = await supabase
            .from('tests')
            .update({
              ...data,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingTest.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('tests')
            .insert({
              ...data,
              participants_count: 0,
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          if (error) throw error;
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tests'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success(
        editingTest ? "Test updated successfully!" : "Test created successfully!",
        {
          icon: <CheckCircle className="h-4 w-4" />,
          duration: 3000
        }
      );
      refetch();
    },
    onError: (error: any) => {
      console.error('Error saving test:', error);
      toast.error(
        `Failed to ${editingTest ? 'update' : 'create'} test: ${error.message || 'Unknown error'}`,
        {
          icon: <AlertTriangle className="h-4 w-4" />,
          duration: 5000
        }
      );
      setIsSubmitting(false);
    }
  });

  const deleteTest = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tests')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tests'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast.success("Test deleted successfully!", {
        icon: <CheckCircle className="h-4 w-4" />
      });
      refetch();
    },
    onError: (error: any) => {
      console.error('Error deleting test:', error);
      toast.error(`Failed to delete test: ${error.message || 'Unknown error'}`, {
        icon: <AlertTriangle className="h-4 w-4" />
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Please enter a test title");
      return;
    }
    
    if (!formData.google_form_url.trim()) {
      toast.error("Please enter a Google Form URL");
      return;
    }

    // Validate Google Form URL
    if (!formData.google_form_url.includes('forms.gle') && !formData.google_form_url.includes('docs.google.com/forms')) {
      toast.error("Please enter a valid Google Form URL");
      return;
    }

    saveTest.mutate(formData);
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || "",
      category: test.category,
      duration: test.duration || "",
      difficulty: test.difficulty || "Medium",
      questions: test.questions || "",
      google_form_url: test.google_form_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTest.mutate(id);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
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
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Online Tests Management</h1>
            <p className="text-purple-100">Create and manage tests and assessments for students</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Plus className="h-4 w-4 mr-2" />
                Create New Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingTest ? "Edit Test" : "Create New Test"}
                </DialogTitle>
                <DialogDescription>
                  {editingTest ? "Update the test details below" : "Fill in the details to create a new online test"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Test Title *</label>
                    <Input
                      placeholder="Enter test title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      placeholder="Enter test description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UG_TRB">UG TRB</SelectItem>
                        <SelectItem value="PG_TRB">PG TRB</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                      placeholder="e.g., 2 hours, 90 minutes"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Questions Info</label>
                    <Input
                      placeholder="e.g., 100 questions, Multiple choice"
                      value={formData.questions}
                      onChange={(e) => setFormData({...formData, questions: e.target.value})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Google Form URL *</label>
                    <Input
                      placeholder="https://forms.gle/... or https://docs.google.com/forms/..."
                      value={formData.google_form_url}
                      onChange={(e) => setFormData({...formData, google_form_url: e.target.value})}
                      required
                      type="url"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the shareable Google Form URL for the test
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : editingTest ? "Update Test" : "Create Test"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Tests Management */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Online Tests ({tests.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </CardTitle>
            <CardDescription>Manage all online tests and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p>Loading tests...</p>
              </div>
            ) : tests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No tests created yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Test
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Details</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 truncate">{test.title}</p>
                            <p className="text-sm text-gray-500 truncate">{test.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {test.category.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{test.duration || 'Not set'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            test.difficulty === 'Easy' ? 'default' : 
                            test.difficulty === 'Medium' ? 'secondary' : 
                            'destructive'
                          }>
                            {test.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-sm">{test.participants_count}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={test.is_active ? "default" : "secondary"}>
                            {test.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            {test.google_form_url && (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={test.google_form_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  title="Open test"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(test)}
                              title="Edit test"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" title="Delete test">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Delete Test
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{test.title}"? This action cannot be undone and will remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(test.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Test
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default AdminTests;
