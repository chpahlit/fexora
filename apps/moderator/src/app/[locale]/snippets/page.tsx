"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Snippet {
  id: string;
  title: string;
  body: string;
  category: "greeting" | "upsell" | "faq" | "closing" | "custom";
  creatorId?: string;
  creatorUsername?: string;
}

const CATEGORIES = ["greeting", "upsell", "faq", "closing", "custom"] as const;

export default function SnippetsPage() {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", category: "custom" as string });

  const { data } = useQuery({
    queryKey: ["moderator", "snippets"],
    queryFn: () => client.get<Snippet[]>("/moderator/snippets"),
  });

  const snippets = data?.success ? data.data ?? [] : [];

  async function handleCreate() {
    if (!form.title || !form.body) return;
    await client.post("/moderator/snippets", form);
    queryClient.invalidateQueries({ queryKey: ["moderator", "snippets"] });
    setShowCreate(false);
    setForm({ title: "", body: "", category: "custom" });
  }

  async function handleDelete(id: string) {
    await client.delete(`/moderator/snippets/${id}`);
    queryClient.invalidateQueries({ queryKey: ["moderator", "snippets"] });
  }

  function handleCopy(body: string) {
    navigator.clipboard.writeText(body);
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Snippets & Templates</h1>
          <Button onClick={() => setShowCreate(!showCreate)}>
            {showCreate ? "Cancel" : "New Snippet"}
          </Button>
        </div>

        {showCreate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Snippet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Welcome greeting"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Message Template</Label>
                <Textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="Hey {{username}}, thanks for reaching out! ..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{{username}}"} for variable substitution
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreate} disabled={!form.title || !form.body}>Create</Button>
            </CardFooter>
          </Card>
        )}

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <SnippetGrid snippets={snippets} onCopy={handleCopy} onDelete={handleDelete} />
          </TabsContent>
          {CATEGORIES.map((c) => (
            <TabsContent key={c} value={c}>
              <SnippetGrid
                snippets={snippets.filter((s) => s.category === c)}
                onCopy={handleCopy}
                onDelete={handleDelete}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function SnippetGrid({
  snippets,
  onCopy,
  onDelete,
}: {
  snippets: Snippet[];
  onCopy: (body: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 mt-4">
      {snippets.length > 0 ? (
        snippets.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">{s.category}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onCopy(s.body)}>
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(s.id)}>
                    Delete
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{s.body}</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-2 rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No snippets in this category</p>
        </div>
      )}
    </div>
  );
}
