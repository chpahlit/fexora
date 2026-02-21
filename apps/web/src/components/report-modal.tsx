"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const REPORT_CATEGORIES = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "illegal", label: "Illegal Content" },
  { value: "copyright", label: "Copyright Violation" },
  { value: "fraud", label: "Fraud / Scam" },
  { value: "other", label: "Other" },
] as const;

interface ReportModalProps {
  targetType: "content" | "comment" | "message" | "profile";
  targetId: string;
  onClose: () => void;
}

export function ReportModal({ targetType, targetId, onClose }: ReportModalProps) {
  const { client } = useAuth();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    await client.post("/reports", {
      targetType,
      targetId,
      category,
      description: description.trim() || undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-background rounded-lg border shadow-lg w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold">Thank you for your report</p>
            <p className="text-sm text-muted-foreground">
              We will review your report and take appropriate action.
            </p>
            <Button onClick={onClose}>Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Report {targetType}</h2>
              <p className="text-sm text-muted-foreground">
                Select a reason for your report.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`rounded-md border px-3 py-2 text-sm text-left transition-colors ${
                      category === cat.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional details (optional)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                maxLength={1000}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!category || submitting}>
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
