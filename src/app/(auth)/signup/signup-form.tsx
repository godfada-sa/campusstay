"use client";

import { useActionState } from "react";

import { studentSignUp, type StudentAuthState } from "@/lib/actions/auth";

const initial: StudentAuthState = { error: null };

export function StudentSignUpForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(studentSignUp, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />

      <div>
        <label className="label" htmlFor="full_name">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          className="input"
          placeholder="Ama Mensah"
        />
      </div>

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
        <p className="field-hint">This is the number you will sign in with.</p>
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="input"
        />
        <p className="field-hint">At least 8 characters.</p>
      </div>

      <div>
        <label className="label" htmlFor="confirm_password">
          Confirm password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="input"
        />
      </div>

      {state.error ? (
        <p className="border border-[#d9b4a6] bg-[#f8eae4] px-3 py-2 text-sm text-[#7e2f13]">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
