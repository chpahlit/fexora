"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function DmcaContent() {
  const { client } = useAuth();
  const [description, setDescription] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() || !contentUrl.trim() || !ownerName.trim() || !ownerEmail.trim()) return;

    setSubmitting(true);
    const formData = new FormData();
    formData.append("description", description);
    formData.append("contentUrl", contentUrl);
    formData.append("originalUrl", originalUrl);
    formData.append("ownerName", ownerName);
    formData.append("ownerEmail", ownerEmail);
    if (file) formData.append("proofFile", file);

    await client.upload("/dmca/reports", formData);
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-lg font-semibold">DMCA Report Submitted</p>
            <p className="text-sm text-muted-foreground">
              Thank you for your report. Our team will review it within 48 hours
              and take appropriate action. You will receive updates via email.
            </p>
            <Button onClick={() => setSubmitted(false)}>Submit Another Report</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">DMCA Takedown Request</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Report content that infringes your copyright. Please provide evidence of ownership.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Report Details</CardTitle>
            <CardDescription>
              Fill out this form to request the removal of copyrighted content.
              All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Full Name *</Label>
              <Input
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Legal name of the copyright owner"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Contact Email *</Label>
              <Input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Infringing Content URL *</Label>
              <Input
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://fexora.com/content/..."
                required
              />
              <p className="text-xs text-muted-foreground">
                The URL of the content on FEXORA that infringes your copyright.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Original Work URL</Label>
              <Input
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://your-website.com/original-work"
              />
              <p className="text-xs text-muted-foreground">
                Link to where your original work is published (if available).
              </p>
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the copyrighted work and explain how the content infringes your rights..."
                rows={4}
                maxLength={5000}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Proof of Ownership (optional)</Label>
              <Input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-muted-foreground">
                Upload proof of copyright ownership (registration, original files, etc.)
              </p>
            </div>

            <div className="rounded-lg border p-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Legal Declaration</p>
              <p>
                By submitting this form, I declare under penalty of perjury that I am the copyright
                owner (or authorized agent) and that the information provided is accurate. I understand
                that misrepresentation may result in legal liability.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={submitting || !description.trim() || !contentUrl.trim() || !ownerName.trim() || !ownerEmail.trim()}
            >
              {submitting ? "Submitting..." : "Submit DMCA Report"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function DmcaPage() {
  return (
    <ProtectedRoute>
      <DmcaContent />
    </ProtectedRoute>
  );
}
