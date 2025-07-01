
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
import { Plus, Edit, Trash2, Users, ExternalLink, AlertTriangle } from "lucide-react";
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UG_TRB",
    duration: "",
    difficulty: "Medium",
    questions: "",
    google_form_url: ""
  });

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ['admin_tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Test[];
    },
    enabled: isAdmin
  });

  const saveTest = useMutation({
    mutationFn: async (data: any) => {
      if (editingTest) {
        const { error } = await supabase
          .from('tests')
          .update(data)
          .eq('id', editingTest.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tests')
          .insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_tests'] });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      setIsDialogOpen(false);
      setEditingTest(null);
      setFormData({
        title: "",
        description: "",
        category: "UG_TRB",
        duration: "",
        difficulty: "Medium",
        questions: "",
        google_form_url: ""
      });
      toast.success(editingTest ? "Test updated successfully" : "Test created successfully");
    },
    onError: (error) => {
      console.error('Error saving test:', error);
      toast.error("Failed to save test");
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
      toast.success("Test deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting test:', error);
      toast.error("Failed to delete test");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <h1 className="text-3xl font-bold mb-2">Online Tests</h1>
            <p className="text-purple-100">Manage tests and assessments for students</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTest ? "Edit Test" : "Create New Test"}</DialogTitle>
                <DialogDescription>
                  {editingTest ? "Update the test details" : "Create a new online test"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Test title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                
                <Textarea
                  placeholder="Test description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                
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
                
                <Input
                  placeholder="Duration (e.g., 2 hours)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
                
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
                
                <Textarea
                  placeholder="Questions description"
                  value={formData.questions}
                  onChange={(e) => setFormData({...formData, questions: e.target.value})}
                />
                
                <Input
                  placeholder="Google Form URL"
                  value={formData.google_form_url}
                  onChange={(e) => setFormData({...formData, google_form_url: e.target.value})}
                />
                
                <Button type="submit" className="w-full" disabled={saveTest.isPending}>
                  {saveTest.isPending ? "Saving..." : editingTest ? "Update" : "Create"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Tests Table */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Online Tests ({tests.length})</CardTitle>
            <CardDescription>Manage all online tests and assessments</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading tests...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{test.title}</p>
                          <p className="text-sm text-gray-500">{test.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {test.category.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{test.duration}</TableCell>
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
                          {test.participants_count}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={test.is_active ? "default" : "secondary"}>
                          {test.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {test.google_form_url && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={test.google_form_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleEdit(test)}>
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
                                  Delete Test
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{test.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(test.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
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
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default AdminTests;
