import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link2, Slack, Mail, Calendar, Database, FileText } from "lucide-react";

export default function ConnectorsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <Link2 className="h-8 w-8 text-indigo-600" />
            Connectors
          </h1>
          <p className="text-zinc-600 mt-2">Integrate with your favorite tools and services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Slack className="h-5 w-5 text-purple-600" />
                Slack
              </CardTitle>
              <CardDescription>
                Send messages and notifications to Slack channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="slack">Enable Slack integration</Label>
                <Switch id="slack" />
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Gmail
              </CardTitle>
              <CardDescription>
                Access and manage your Gmail messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="gmail">Enable Gmail integration</Label>
                <Switch id="gmail" />
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Google Calendar
              </CardTitle>
              <CardDescription>
                Schedule and manage calendar events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="calendar">Enable Calendar integration</Label>
                <Switch id="calendar" defaultChecked />
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Google Drive
              </CardTitle>
              <CardDescription>
                Access and manage your Drive files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="drive">Enable Drive integration</Label>
                <Switch id="drive" />
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-600" />
                Database
              </CardTitle>
              <CardDescription>
                Connect to your databases and data sources
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="database">Enable DB integration</Label>
                <Switch id="database" />
              </div>
              <Button variant="outline" className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-zinc-300">
            <CardHeader>
              <CardTitle className="text-zinc-500">More Coming Soon</CardTitle>
              <CardDescription>
                Additional integrations in development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full text-zinc-500">Request Integration</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}