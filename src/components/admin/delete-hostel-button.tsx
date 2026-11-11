"use client";

import { useFormStatus } from "react-dom";

import { deleteHostel } from "@/lib/actions/hostels";

function Button({ name }: { name: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-danger"
      disabled={pending}
      onClick={(event) => {
        if (
          !window.confirm(
            `Delete ${name}? Its rooms and photos will be removed too. This cannot be undone.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Deleting…" : "Delete hostel"}
    </button>
  );
}

export function DeleteHostelButton({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteHostel}>
      <input type="hidden" name="id" value={id} />
      <Button name={name} />
    </form>
  );
}
