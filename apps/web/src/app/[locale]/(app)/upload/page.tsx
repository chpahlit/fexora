"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { useCreateContent, useUploadContentMedia, useSubmitContent } from "@fexora/api-client";
import { createContentSchema } from "@fexora/shared";
import { UPLOAD_LIMITS } from "@fexora/shared";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function UploadContent() {
  const t = useTranslations();
  const router = useRouter();
  const createContent = useCreateContent();
  const uploadMedia = useUploadContentMedia();
  const submitContent = useSubmitContent();

  const [error, setError] = useState("");
  const [step, setStep] = useState<"form" | "upload" | "done">("form");
  const [contentId, setContentId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      if (dropped.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(dropped));
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      if (selected.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(selected));
      }
    }
  };

  async function handleCreateContent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      type: formData.get("type") as "Image" | "Video" | "Audio" | "Text",
      priceCredits: parseInt(formData.get("priceCredits") as string) || 0,
    };

    const validation = createContentSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? t("common.error"));
      return;
    }

    createContent.mutate(data, {
      onSuccess: (res) => {
        if (res.success && res.data) {
          setContentId(res.data.id);
          if (data.type === "Text") {
            // Text content doesn't need media upload
            submitContent.mutate(res.data.id, {
              onSuccess: () => router.push("/feed"),
            });
          } else {
            setStep("upload");
          }
        } else {
          setError(res.error ?? t("common.error"));
        }
      },
      onError: () => setError(t("common.error")),
    });
  }

  async function handleUploadMedia() {
    if (!contentId || !file) return;
    setError("");

    uploadMedia.mutate(
      { contentId, file },
      {
        onSuccess: (res) => {
          if (res.success) {
            // Submit for review
            submitContent.mutate(contentId, {
              onSuccess: () => {
                setStep("done");
                setTimeout(() => router.push("/feed"), 2000);
              },
            });
          } else {
            setError(res.error ?? t("common.error"));
          }
        },
        onError: () => setError(t("common.error")),
      }
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("content.upload")}</CardTitle>
          <CardDescription>Create and share content with your fans</CardDescription>
        </CardHeader>

        {step === "form" && (
          <form onSubmit={handleCreateContent}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required maxLength={200} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Content Type</Label>
                <Select id="type" name="type" defaultValue="Image">
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Text">Text</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceCredits">
                  Price ({t("content.coins")})
                </Label>
                <Input
                  id="priceCredits"
                  name="priceCredits"
                  type="number"
                  min={0}
                  defaultValue={0}
                />
                <p className="text-xs text-muted-foreground">
                  Set to 0 for free content
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={createContent.isPending}>
                {createContent.isPending ? t("common.loading") : t("common.next")}
              </Button>
            </CardFooter>
          </form>
        )}

        {step === "upload" && (
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-md"
                  />
                  <p className="text-sm text-muted-foreground">{file?.name}</p>
                </div>
              ) : file ? (
                <div className="space-y-2">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max {UPLOAD_LIMITS.IMAGE_MAX_SIZE / 1024 / 1024}MB for images,{" "}
                    {UPLOAD_LIMITS.VIDEO_MAX_SIZE / 1024 / 1024}MB for video
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*"
              />
            </div>

            <Button
              onClick={handleUploadMedia}
              disabled={!file || uploadMedia.isPending || submitContent.isPending}
              className="w-full"
            >
              {uploadMedia.isPending || submitContent.isPending
                ? t("common.loading")
                : t("content.upload")}
            </Button>
          </CardContent>
        )}

        {step === "done" && (
          <CardContent className="text-center py-12">
            <p className="text-lg font-medium text-green-600">
              {t("common.success")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("content.pending")}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function UploadPage() {
  return (
    <ProtectedRoute roles={["Creator", "Admin"]}>
      <UploadContent />
    </ProtectedRoute>
  );
}
