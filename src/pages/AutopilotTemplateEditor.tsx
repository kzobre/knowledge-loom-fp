import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Save, X } from "lucide-react";

const AutopilotTemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditing] = useState(!!id);
  const [availableFeeds, setAvailableFeeds] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    frequency: "weekly",
    output_format: "blog_post",
    topic_filters: [] as string[],
    source_feed_ids: [] as string[],
    is_active: true
  });

  const [newTopic, setNewTopic] = useState("");

  const loadFeeds = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("source_feeds")
      .select("id, name")
      .eq("user_id", session.user.id)
      .eq("is_active", true);

    setAvailableFeeds(data || []);
  };

  const loadTemplate = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("autopilot_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Failed to load template");
      navigate("/autopilot");
    } else {
      setFormData({
        name: data.name || "",
        frequency: data.frequency || "weekly",
        output_format: data.output_format || "blog_post",
        topic_filters: data.topic_filters || [],
        source_feed_ids: data.source_feed_ids || [],
        is_active: data.is_active ?? true
      });
    }
  };

  useEffect(() => {
    loadFeeds();
    if (id) {
      loadTemplate();
    }
  }, [id]);

  const addTopic = () => {
    if (newTopic.trim() && !formData.topic_filters.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topic_filters: [...prev.topic_filters, newTopic.trim()]
      }));
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topic_filters: prev.topic_filters.filter(t => t !== topic)
    }));
  };

  const toggleFeed = (feedId: string) => {
    setFormData(prev => ({
      ...prev,
      source_feed_ids: prev.source_feed_ids.includes(feedId)
        ? prev.source_feed_ids.filter(id => id !== feedId)
        : [...prev.source_feed_ids, feedId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("autopilot_templates")
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq("id", id);

        if (error) throw error;
        toast.success("Template updated successfully");
      } else {
        const { error } = await supabase
          .from("autopilot_templates")
          .insert([{
            ...formData,
            user_id: session.user.id
          }]);

        if (error) throw error;
        toast.success("Template created successfully");
      }

      navigate("/autopilot");
    } catch (error) {
      console.error("Failed to save template:", error);
      toast.error("Failed to save template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/autopilot")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Template" : "Create New Template"}
            </CardTitle>
            <CardDescription>
              Configure your automated content generation settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Weekly Tech Insights"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={formData.output_format} onValueChange={(value) => setFormData(prev => ({ ...prev, output_format: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Topic Filters</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a topic..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                  />
                  <Button type="button" onClick={addTopic}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.topic_filters.map((topic) => (
                    <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                      {topic}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTopic(topic)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Source Feeds</Label>
                <div className="space-y-2 mt-2">
                  {availableFeeds.map((feed) => (
                    <div key={feed.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`feed-${feed.id}`}
                        checked={formData.source_feed_ids.includes(feed.id)}
                        onChange={() => toggleFeed(feed.id)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`feed-${feed.id}`} className="text-sm cursor-pointer">
                        {feed.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => navigate("/autopilot")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : (isEditing ? "Update Template" : "Create Template")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AutopilotTemplateEditor;
