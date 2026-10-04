# Kenya Insider — Database Schema & Queries

## Database Overview

- **Type:** PostgreSQL (via Supabase)
- **Location:** `supabase/schema.sql`
- **Status:** Schema defined, not yet deployed
- **RLS (Row-Level Security):** Enabled on all data tables
- **Tables:** 6 main tables + auth.users

## Table Definitions

### 1. profiles

**Purpose:** User profile and role management  
**Sync Trigger:** Automatically created when user signs up via `on_auth_user_created`

```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key, Foreign Key to auth.users | User ID from Supabase Auth |
| `full_name` | text | - | User's full name (from signup metadata) |
| `role` | text | NOT NULL, DEFAULT 'customer', CHECK | Either 'customer' or 'admin' |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | Auto-set on creation |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() | Auto-updated on changes |

**Indexes:** Primary key on `id`

**Row-Level Security Policies:**
- `profiles own read`: Users can see own profile, admins can see all
- `profiles own update`: Users can update own profile (except role field)

**Triggers:**
- `profiles_updated_at`: Auto-update `updated_at` on modifications

---

### 2. trip_requests

**Purpose:** Store customer trip planning requests  
**Relationships:** Optional foreign key to auth.users (can be null if user doesn't register)

```sql
CREATE TABLE public.trip_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  arrival date NOT NULL,
  departure date NOT NULL,
  travelers text NOT NULL,
  traveling_with text,
  interests text[] NOT NULL DEFAULT '{}',
  destinations text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (departure >= arrival)
);

CREATE INDEX trip_requests_email_idx ON public.trip_requests(email);
CREATE INDEX trip_requests_status_idx ON public.trip_requests(status);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key | Auto-generated |
| `user_id` | uuid | Foreign Key (optional) | Link to auth.users if user registered |
| `name` | text | NOT NULL | Guest's name |
| `email` | text | NOT NULL | Guest's email (used for RLS filtering) |
| `arrival` | date | NOT NULL | Trip start date |
| `departure` | date | NOT NULL | Trip end date |
| `travelers` | text | NOT NULL | Number/description of travelers |
| `traveling_with` | text | - | Who they're traveling with |
| `interests` | text[] | DEFAULT '{}' | Array of interests (wildlife, food, etc.) |
| `destinations` | text[] | DEFAULT '{}' | Array of destination names/slugs |
| `notes` | text | - | Additional notes from user |
| `status` | text | DEFAULT 'new' | Workflow: new → reviewing → contacted → closed |
| `created_at` | timestamptz | NOT NULL | Auto-set |
| `updated_at` | timestamptz | NOT NULL | Auto-updated |

**Indexes:** 
- `email` (for customer lookup)
- `status` (for admin filtering)

**Row-Level Security Policies:**
- `trip request customer read`: Customers can see requests matching their email, admins can see all
- `trip request admin update`: Only admins can update status

**Triggers:**
- `trip_requests_updated_at`: Auto-update `updated_at` on modifications

**Constraints:**
- `departure >= arrival` (departure must be after or same as arrival)

---

### 3. bookings

**Purpose:** Experience booking records  
**Status:** Database schema defined but functionality not implemented

```sql
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  experience_slug text NOT NULL,
  start_date date,
  guests integer NOT NULL CHECK (guests > 0),
  total_amount numeric(12,2),
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key | Auto-generated |
| `user_id` | uuid | Foreign Key (optional) | Link to user |
| `experience_slug` | text | NOT NULL | Reference to experience (from catalog) |
| `start_date` | date | - | When booking starts |
| `guests` | integer | NOT NULL, CHECK > 0 | Number of guests |
| `total_amount` | numeric(12,2) | - | Total booking price |
| `currency` | text | DEFAULT 'KES' | Currency code |
| `status` | text | DEFAULT 'pending' | Workflow: pending → confirmed → cancelled/completed |
| `created_at` | timestamptz | NOT NULL | Auto-set |
| `updated_at` | timestamptz | NOT NULL | Auto-updated |

**Row-Level Security Policies:**
- `booking customer read`: Users can see own bookings, admins can see all
- Not yet: Insert/update policies (API not implemented)

**Triggers:**
- `bookings_updated_at`: Auto-update `updated_at` on modifications

---

### 4. contact_messages

**Purpose:** Store contact form submissions  
**Status:** Database schema defined, form API not implemented

```sql
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key | Auto-generated |
| `name` | text | NOT NULL | Sender's name |
| `email` | text | NOT NULL | Sender's email |
| `subject` | text | - | Message subject |
| `message` | text | NOT NULL | Message body |
| `status` | text | DEFAULT 'new' | Workflow: new → read → replied → closed |
| `created_at` | timestamptz | NOT NULL | Auto-set |

**Row-Level Security Policies:**
- Not yet implemented (should allow public inserts, admin reads/updates)

---

### 5. newsletter_subscribers

**Purpose:** Track email newsletter subscriptions  
**Status:** Database schema defined, subscription API not implemented

```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz
);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key | Auto-generated |
| `email` | text | UNIQUE, NOT NULL | Subscriber's email |
| `subscribed_at` | timestamptz | NOT NULL | When subscribed |
| `unsubscribed_at` | timestamptz | - | When unsubscribed (null = still subscribed) |

**Row-Level Security Policies:**
- Not yet implemented (should allow public inserts, admin reads/updates)

---

### 6. reviews

**Purpose:** Store experience reviews and ratings  
**Status:** Database schema defined, review functionality not implemented

```sql
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  experience_slug text,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title text,
  body text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Columns:**
| Column | Type | Constraints | Notes |
|--------|------|-----------|-------|
| `id` | uuid | Primary Key | Auto-generated |
| `user_id` | uuid | Foreign Key (optional) | Review author |
| `experience_slug` | text | - | Which experience is being reviewed |
| `rating` | integer | NOT NULL, CHECK 1-5 | Star rating |
| `title` | text | - | Review title |
| `body` | text | NOT NULL | Review content |
| `is_published` | boolean | DEFAULT false | Admin moderation flag |
| `created_at` | timestamptz | NOT NULL | Auto-set |

**Row-Level Security Policies:**
- `review public read`: Anyone can see published reviews
- `review user create`: Authenticated users can create reviews
- `review owner update`: Users can update own reviews, admins can update all

---

## Database Functions

### is_admin()

Helper function for RLS policies to check if current user is admin.

```sql
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS boolean LANGUAGE SQL STABLE SECURITY DEFINER 
SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

**Used in:** All RLS policies that need admin checks

---

## Database Triggers

### handle_new_user()

Automatically creates a profile when a user signs up via Supabase Auth.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) 
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name') 
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
AFTER INSERT ON auth.users 
FOR EACH ROW 
EXECUTE PROCEDURE public.handle_new_user();
```

### touch_updated_at()

Auto-updates the `updated_at` timestamp when a record is modified.

```sql
CREATE OR REPLACE FUNCTION public.touch_updated_at() 
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$;
```

**Applied to:**
- `profiles` table
- `trip_requests` table
- `bookings` table

---

## Common Queries

### Get Trip Request (Admin View)

```sql
SELECT id, name, email, status, created_at, destinations
FROM public.trip_requests
WHERE public.is_admin()  -- RLS policy enforces this
ORDER BY created_at DESC;
```

### Get User's Trip Requests

```sql
SELECT id, created_at, status, arrival, departure, destinations
FROM public.trip_requests
WHERE email = current_user_email  -- RLS policy enforces this
ORDER BY created_at DESC;
```

### Update Trip Request Status (Admin Only)

```sql
UPDATE public.trip_requests
SET status = 'contacted'
WHERE id = request_id
  AND public.is_admin();  -- RLS policy enforces this
```

### Create Trip Request (No Auth Required)

```sql
INSERT INTO public.trip_requests (
  name, email, arrival, departure, travelers, 
  traveling_with, interests, destinations, notes, status
) VALUES (
  'John Doe', 'john@example.com', '2024-12-01', '2024-12-10', '2',
  'My partner', ARRAY['Wildlife', 'Food'], ARRAY['Nairobi', 'Maasai Mara'], 
  'First time to Kenya', 'new'
)
RETURNING id, created_at;
```

### Get User Profile

```sql
SELECT id, full_name, role, created_at
FROM public.profiles
WHERE id = current_user_id;  -- RLS policy enforces this
```

### Promote User to Admin (Manual)

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

---

## Data Migration Plan

### From Current State (Hardcoded) to Database

#### 1. Experiences Migration
```sql
-- Create experiences table
CREATE TABLE IF NOT EXISTS public.experiences (
  slug text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  destination text NOT NULL,
  duration text NOT NULL,
  price text NOT NULL,
  description text NOT NULL,
  image text,
  best_for text,
  highlights text[],
  included text[],
  created_at timestamptz DEFAULT now()
);

-- Insert seed data from lib/catalog.ts
INSERT INTO public.experiences (...) VALUES (...);
```

#### 2. Destinations Migration
```sql
-- Create destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
  slug text PRIMARY KEY,
  name text NOT NULL,
  region text,
  image text,
  description text,
  best_for text,
  things_to_do text[],
  best_time text,
  ideal_duration text,
  created_at timestamptz DEFAULT now()
);

-- Insert seed data from lib/catalog.ts
INSERT INTO public.destinations (...) VALUES (...);
```

#### 3. Update Application Code
- Modify `lib/catalog.ts` to fetch from Supabase instead of hardcoded arrays
- Implement caching to avoid repeated queries
- Add error handling for database failures

---

## Database Performance

### Indexes
Currently defined:
- `trip_requests_email_idx` — Quick lookup by email
- `trip_requests_status_idx` — Filter by status

### Missing Indexes (Recommended)
```sql
-- For foreign key lookups
CREATE INDEX bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX trip_requests_user_id_idx ON public.trip_requests(user_id);

-- For sorting
CREATE INDEX trip_requests_created_at_idx ON public.trip_requests(created_at DESC);
CREATE INDEX bookings_created_at_idx ON public.bookings(created_at DESC);

-- For filtering
CREATE INDEX bookings_status_idx ON public.bookings(status);
CREATE INDEX reviews_experience_slug_idx ON public.reviews(experience_slug);
CREATE INDEX reviews_is_published_idx ON public.reviews(is_published);
```

### Optimization Notes
- Dashboard queries should paginate (add `LIMIT` and `OFFSET`)
- Use `SELECT DISTINCT` carefully (can be slow on large tables)
- Consider materialized views for frequently run admin reports

---

## Database Deployment

### Prerequisites
1. Supabase project created
2. Project URL and API keys obtained
3. Environment variables configured

### Deployment Steps
1. Log into Supabase dashboard
2. Navigate to SQL editor
3. Copy content from `supabase/schema.sql`
4. Paste into editor and run
5. Verify all tables created with `\dt`
6. Check RLS policies enabled with `\dp`

### Post-Deployment Checklist
- [ ] All 6 tables created
- [ ] Indexes on email and status created
- [ ] RLS policies enabled on all tables
- [ ] Triggers for `updated_at` created
- [ ] `is_admin()` function created
- [ ] User signs up successfully → profile auto-created
- [ ] Trip request submission works
- [ ] Admin can see all requests
- [ ] Customer can only see own requests

---

## Troubleshooting

### "Supabase is not configured"
- Check `NEXT_PUBLIC_SUPABASE_URL` in .env
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` in .env
- Verify project exists in Supabase dashboard

### "The booking service is not configured yet"
- Check `SUPABASE_SERVICE_ROLE_KEY` in .env (for API routes)
- Verify API route is using `getSupabaseServerClient()`

### RLS Policy Denies Access
- Verify user is authenticated (has valid JWT)
- For admin routes, verify profile.role = 'admin'
- Check RLS policy syntax in `supabase/schema.sql`

### "Row-level security violation"
- Indicates RLS policy is working (security feature)
- Check user has appropriate permissions for operation
- Admin operations require `public.is_admin()` = true

