import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Settings, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface QuestionSet {
  id: string;
  name: string;
  questions: string[];
  is_global: boolean;
  created_at: string;
}

const QuestionSets = () => {
  const navigate = useNavigate();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadQuestionSets();
  }, []);

  const loadQuestionSets = async () => {
    setLoading(true);
    // TODO: Replace with actual Supabase query when table exists
    // const { data, error } = await supabase.from("question_sets").select("*").order("created_at");
    
    // Mock data for now
    const mockData: QuestionSet[] = [
      {
        id: "1",
        name: "Default Questions",
        questions: [
          "Question 1: What are the key insights or main points?",
          "Question 2: How does this relate to our audience?",
          "Question 3: What action should readers take?",
          "Question 4: What makes this information unique or valuable?"
        ],
        is_global: true,
        created_at: new Date().toISOString()
      }
    ];
    
    setQuestionSets(mockData);
    setLoading(false);
  };

  const filteredSets = questionSets.filter(set =>
    set.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Question Sets</h1>
            <p className="text-muted-foreground">
              Manage question templates for your content sources
            </p>
          </div>
          <Button onClick={() => navigate("/questions/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Question Set
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search question sets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Question Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => (
            <Card 
              key={set.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/questions/${set.id}/edit`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <CardTitle className="text-lg">{set.name}</CardTitle>
                  </div>
                  {set.is_global && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <CardDescription>
                  {set.questions.length} questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {set.questions.slice(0, 2).map((question, index) => (
                    <p key={index} className="text-sm text-muted-foreground line-clamp-2">
                      {question}
                    </p>
                  ))}
                  {set.questions.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{set.questions.length - 2} more questions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No question sets found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Try adjusting your search terms" : "Create your first question set to get started"}
              </p>
              <Button onClick={() => navigate("/questions/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Question Set
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default QuestionSets;