# CampusStay

A hostel directory for students at the University of Cape Coast. Students
compare rent, room types, amenities and the walk to campus, then call the
caretaker. There are no bookings, payments or student accounts.

## Stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS v4
- Supabase: Postgres, Auth (admin only), Storage
- Zod for form validation

## What is in here

| Path | Purpose |
| --- | --- |
| `src/app/(site)` | Public pages: home, hostel list, detail page, 404 |
| `src/app/(auth)` | Student signup and login |
| `src/app/admin` | Admin login and dashboard |
| `src/app/api/admin/upload` | Authenticated photo upload endpoint |
| `src/lib/actions` | Server actions for login, hostel save and delete |
| `src/lib/queries.ts` | All Supabase reads for the public site and admin |
| `supabase/migrations` | Schema, RLS, storage policies, search view |
| `scripts/seed.mjs` | Rebuilds the demo directory and admin account |
| `public/seed` | Demo photos used only by the seed script |

## Setup

1. Install dependencies.

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the Supabase keys. Set
   `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the first admin account. The service
   role key is used by the seed script only and must never be exposed to the
   browser.

3. Link the Supabase project and push the migrations.

   ```bash
   supabase link --project-ref <project-ref>
   supabase db push
   ```

4. Seed the demo data. This creates the amenities, nine hostels, room types,
   uploaded photos and the admin account from `ADMIN_EMAIL` and
   `ADMIN_PASSWORD`.

   ```bash
   npm run seed
   ```

5. Start the app.

   ```bash
   npm run dev
   ```

## Student accounts

The hostel list is public. Opening a hostel asks students to sign up or sign in
with a phone number and password. Signup collects full name, phone, password
and password confirmation. Supabase phone confirmation is turned off, so no SMS
code is sent.

Students can tap "I'm interested" on a hostel. The tap is stored in
`hostel_interests`, and the browser keeps a local list so the button stays
filled after a refresh. Admins see the count for each hostel.

## Admin

Open `/admin/login`. The seed script creates one admin from `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in `.env.local`. Change that password in Supabase after the
first sign-in. Admin access is granted by the `profiles.role` column.

From the dashboard you can add a hostel, edit rent and room types, tick
amenities, upload photos, and publish or unpublish a hostel. Photos go to the
`hostel-photos` Storage bucket; the database stores the public URL, so the
frontend never hardcodes images.

## Database notes

- Public reads use the anon key and row level security.
- Only `profiles.role = 'admin'` can write hostels, rooms, images or amenities,
  and only admins can upload to the storage bucket.
- `hostel_cards` is a view that adds the cover photo, the lowest rent and the
  total free beds for each published hostel.
- `hostel_interests` stores one tap per student per hostel. Students can only
  read their own rows; admins can read all of them.
- Deleting a hostel also removes its uploaded photos from Storage and its
  interest rows.

## Deploy to Vercel

1. Push the repository to GitHub and import it in Vercel.
2. Add these environment variables for Production and Preview:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
   `NEXT_PUBLIC_SITE_URL`.
3. Deploy.

The service role key and `ADMIN_*` values are only used by the seed script. Do
not add them to Vercel.

## Checks

```bash
npm run typecheck
npm run build
```

## Photography

The demo photos come from Wikimedia Commons and are not photos of the named
Cape Coast hostels. Replace them with real listing photos before publishing.
Sources and licences are recorded in `public/seed/credits.json`.
