import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Palette, MessageSquare, Zap } from "lucide-react";

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">Customize ChatLLM</h1>
          <p className="text-zinc-600 mt-2">Personalize your AI chat experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Chat Preferences
              </CardTitle>
              <CardDescription>
                Configure how the AI responds to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="streaming">Streaming responses</Label>
                <Switch id="streaming" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="autocomplete">Auto-complete suggestions</Label>
                <Switch id="autocomplete" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="memory">Remember conversation context</Label>
                <Switch id="memory" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark mode</Label>
                <Switch id="darkMode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode">Compact message layout</Label>
                <Switch id="compactMode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">UI animations</Label>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button>Save Preferences</Button>
        </div>
      </div>
    </div>
  );
}