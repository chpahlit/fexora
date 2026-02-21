"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Segment = "all_followers" | "all_subscribers" | "custom";

function MassMessagingContent() {
  const t = useTranslations();
  const { client } = useAuth();
  const [segment, setSegment] = useState<Segment>("all_followers");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number } | null>(null);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setResult(null);
    const res = await client.post<{ recipientCount: number }>("/creator/mass-message", {
      segment,
      body: message,
    });
    setSending(false);
    if (res.success && res.data) {
      setResult({ sent: res.data.recipientCount });
      setMessage("");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Mass Messaging</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send to Audience</CardTitle>
          <CardDescription>
            Send a message to your followers or subscribers. Limited to 1 message per hour.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Recipients</Label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as Segment)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="all_followers">All Followers</option>
              <option value="all_subscribers">All Subscribers</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={6}
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/5000
            </p>
          </div>

          {result && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              Message queued for {result.sent} recipients
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSend} disabled={sending || !message.trim()}>
            {sending ? t("common.loading") : "Send Message"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function MassMessagingPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <MassMessagingContent />
    </ProtectedRoute>
  );
}
