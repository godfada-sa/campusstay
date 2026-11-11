"use client";

import { useActionState } from "react";

import { studentLogin, type StudentAuthState } from "@/lib/actions/auth";

const initial: StudentAuthState = { error: null };

export function StudentLoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(studentLogin, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="label" htmlFor="phone">
          Phone number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          className="input"
          placeholder="024 123 4567"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
        />
      </div>

      {state.error ? (
        <p className="border border-[#d9b4a6] bg-[#f8eae4] px-3 py-2 text-sm text-[#7e2f13]">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
