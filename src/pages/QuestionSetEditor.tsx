import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface QuestionSet {
  id: string;
  name: string;
  questions: string[];
  is_global: boolean;
}

const QuestionSetEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [questionSet, setQuestionSet] = useState<QuestionSet>({
    id: "",
    name: "",
    questions: [""],
    is_global: false
  });

  useEffect(() => {
    if (isEditing) {
      loadQuestionSet();
    }
  }, [id]);

  const loadQuestionSet = async () => {
    setLoading(true);
    // TODO: Replace with actual Supabase query when table exists
    // const { data, error } = await supabase.from("question_sets").select("*").eq("id", id).single();
    
    // Mock data for now
    const mockData: QuestionSet = {
      id: id!,
      name: "Sample Question Set",
      questions: [
        "Question 1: What are the key insights?",
        "Question 2: How does this help our audience?",
        "Question 3: What action should be taken?"
      ],
      is_global: false
    };
    
    setQuestionSet(mockData);
    setLoading(false);
  };

  const handleAddQuestion = () => {
    setQuestionSet(prev => ({
      ...prev,
      questions: [...prev.questions, ""]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    if (questionSet.questions.length <= 1) {
      toast.error("At least one question is required");
      return;
    }
    
    setQuestionSet(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestionSet(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? value : q)
    }));
  };

  const handleSave = async () => {
    if (!questionSet.name.trim()) {
      toast.error("Please enter a name for the question set");
      return;
    }

    const validQuestions = questionSet.questions.filter(q => q.trim());
    if (validQuestions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    setSaving(true);
    try {
      // TODO: Replace with actual Supabase operation when table exists
      // if (isEditing) {
      //   await supabase.from("question_sets").update(questionSet).eq("id", id);
      // } else {
      //   await supabase.from("question_sets").insert(questionSet);
      // }
      
      toast.success(`Question set ${isEditing ? 'updated' : 'created'} successfully`);
      navigate("/questions");
    } catch (error) {
      console.error("Error saving question set:", error);
      toast.error("Failed to save question set");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/questions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Question Sets
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/questions")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Question Sets
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEditing ? "Edit Question Set" : "Create Question Set"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Update your question set template" 
              : "Create a new set of questions for content extraction"
            }
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Give your question set a name and configure its settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Question Set Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Marketing Analysis, Technical Review"
                  value={questionSet.name}
                  onChange={(e) => setQuestionSet(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="global"
                  checked={questionSet.is_global}
                  onCheckedChange={(checked) => setQuestionSet(prev => ({ ...prev, is_global: checked }))}
                />
                <Label htmlFor="global">Set as global default</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Global question sets are used when no specific set is selected for a reference card
              </p>
            </CardContent>
          </Card>

          {/* Questions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Define the questions that will be used to extract insights from content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {questionSet.questions.map((question, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Textarea
                    placeholder={`Question ${index + 1}...`}
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveQuestion(index)}
                    disabled={questionSet.questions.length <= 1}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleAddQuestion}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Question
              </Button>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate("/questions")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : (isEditing ? "Update" : "Create")} Question Set
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuestionSetEditor;