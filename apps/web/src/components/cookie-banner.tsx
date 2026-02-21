"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ConsentState {
  necessary: boolean;
  comfort: boolean;
  marketing: boolean;
  analytics: boolean;
}

const CONSENT_KEY = "fexora_cookie_consent";

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true,
    comfort: false,
    marketing: false,
    analytics: false,
  });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function saveConsent(state: ConsentState) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
    setVisible(false);
  }

  function handleAcceptAll() {
    const all: ConsentState = { necessary: true, comfort: true, marketing: true, analytics: true };
    saveConsent(all);
  }

  function handleAcceptSelected() {
    saveConsent(consent);
  }

  function handleRejectOptional() {
    const minimal: ConsentState = { necessary: true, comfort: false, marketing: false, analytics: false };
    saveConsent(minimal);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background shadow-lg">
      <div className="mx-auto max-w-4xl p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-sm">Cookie Settings</p>
            <p className="text-xs text-muted-foreground mt-1">
              We use cookies to enhance your experience. You can customize your preferences below.
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="space-y-2 rounded-md border p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked disabled className="rounded" />
              <span className="font-medium">Necessary</span>
              <span className="text-xs text-muted-foreground">— Required for the site to function</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={consent.comfort}
                onChange={(e) => setConsent({ ...consent, comfort: e.target.checked })}
                className="rounded"
              />
              <span className="font-medium">Comfort</span>
              <span className="text-xs text-muted-foreground">— Preferences and personalization</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={consent.analytics}
                onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                className="rounded"
              />
              <span className="font-medium">Analytics</span>
              <span className="text-xs text-muted-foreground">— Anonymous usage statistics</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={consent.marketing}
                onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                className="rounded"
              />
              <span className="font-medium">Marketing</span>
              <span className="text-xs text-muted-foreground">— Personalized recommendations</span>
            </label>
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" onClick={handleAcceptAll}>Accept All</Button>
          <Button size="sm" variant="outline" onClick={handleRejectOptional}>Essential Only</Button>
          {showDetails ? (
            <Button size="sm" variant="outline" onClick={handleAcceptSelected}>Save Preferences</Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setShowDetails(true)}>Customize</Button>
          )}
        </div>
      </div>
    </div>
  );
}
