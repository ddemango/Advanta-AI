import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Calendar, Search } from "lucide-react";

export default function MemoriesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-indigo-600" />
            AI Memories
          </h1>
          <p className="text-zinc-600 mt-2">Your saved conversations and important interactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Launch Strategy</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                2 days ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 mb-4">
                Comprehensive discussion about launching the new AI portal feature...
              </p>
              <Button variant="outline" size="sm">View Memory</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Code Review Guidelines</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                1 week ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 mb-4">
                Best practices for reviewing React components and TypeScript code...
              </p>
              <Button variant="outline" size="sm">View Memory</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Marketing Campaign Ideas</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                2 weeks ago
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 mb-4">
                Creative concepts for the Q1 marketing campaign targeting enterprise clients...
              </p>
              <Button variant="outline" size="sm">View Memory</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-zinc-500">No more memories to show</p>
        </div>
      </div>
    </div>
  );
}