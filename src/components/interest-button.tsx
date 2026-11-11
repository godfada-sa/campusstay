"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "campusstay:interested-hostels";

function readSaved() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function remember(hostelId: string) {
  try {
    const ids = readSaved();
    if (!ids.includes(hostelId)) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...ids, hostelId]),
      );
    }
  } catch {
    // The server row is still the source of truth.
  }
}

export function InterestButton({
  hostelId,
  initiallyInterested,
}: {
  hostelId: string;
  initiallyInterested: boolean;
}) {
  const [saved, setSaved] = useState(initiallyInterested);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!saved && readSaved().includes(hostelId)) {
      setSaved(true);
    }
  }, [hostelId, saved]);

  async function handleClick() {
    if (saved || pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId }),
      });
      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(json.error ?? "Could not save that. Try again.");
      }

      remember(hostelId);
      setSaved(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not save that. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="sm:text-right">
      <button
        type="button"
        onClick={handleClick}
        disabled={saved || pending}
        aria-pressed={saved}
        className={saved ? "btn btn-outline" : "btn btn-primary"}
      >
        {saved ? "On your list" : pending ? "Saving…" : "I'm interested"}
      </button>
      <p
        className="mt-2 max-w-xs text-xs leading-5 text-muted"
        aria-live="polite"
      >
        {error
          ? error
          : saved
            ? "Noted. Call the caretaker to check the room."
            : "Tap once so we know students are asking about it."}
      </p>
    </div>
  );
}
