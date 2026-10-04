# Kenya Insider — Backend Implementation Status

## API Routes Overview

All API routes follow Next.js App Router convention: `app/api/[resource]/route.ts`

### POST /api/trip-requests

**Status:** ✓ Implemented and Working

**Purpose:** Submit a trip planning request

**Handler:** `app/api/trip-requests/route.ts`

**Request:**
```typescript
POST /api/trip-requests
Content-Type: application/json

{
  name: string,           // Required. Guest's full name
  email: string,          // Required. Valid email address
  arrival: string,        // Required. ISO date (YYYY-MM-DD)
  departure: string,      // Required. ISO date (YYYY-MM-DD)
  travelers: string,      // Required. Description (e.g., "2 people", "family of 4")
  travelingWith?: string, // Optional. Who they're traveling with
  interests?: string[],   // Optional. Array of interests
  destinations?: string[],// Optional. Array of destinations
  notes?: string         // Optional. Additional notes
}
```

**Response (Success - 201):**
```json
{ "ok": true }
```

**Response (Bad Request - 400):**
```json
{ "error": "Please provide valid contact and travel details." }
```

**Response (Service Unavailable - 503):**
```json
{ "error": "The booking service is not configured yet." }
```

**Response (Server Error - 500):**
```json
{ "error": "We could not save your request. Please try again." }
```

**Validation:**
- Email must match pattern `^\S+@\S+\.\S+$`
- Arrival and departure dates required
- Trip must last at least 0 days (departure >= arrival)

**Database Operation:**
- Inserts into `trip_requests` table
- Sets status to 'new'
- No user_id required (anonymous submission allowed)
- Triggers auto-creation of `updated_at` timestamp

**RLS:** No authentication required (public insert allowed)

**Implementation Notes:**
- Uses `getSupabaseServerClient()` with service role key
- Server-side validation prevents invalid data
- Email is stored as-is (not lowercased)
- Array fields stored as PostgreSQL arrays

---

### POST /api/bookings

**Status:** ✗ Not Implemented

**Purpose:** Create/manage experience bookings

**Handler:** `app/api/bookings/route.ts`

**Current Response:**
```json
{ "error": "Not implemented" } // 501 Not Implemented
```

**Planned Functionality:**

**Request (POST):**
```typescript
{
  experienceSlug: string,     // Which experience to book
  startDate: string,          // ISO date
  guests: number,             // Number of guests
  guestEmails?: string[],     // Guest contact info
  specialRequests?: string    // Notes (dietary, accessibility, etc.)
}
```

**Required Before Implementation:**
1. Authenticate user (get user_id from JWT)
2. Verify experience exists (validate slug against experiences table)
3. Check availability (need booking calendar/slots system)
4. Calculate price based on guests and dates
5. Store booking in `bookings` table
6. Send confirmation email via Resend
7. Return booking ID and confirmation details

**Database Changes Needed:**
```sql
-- Add experiences table (if not using hardcoded)
CREATE TABLE public.experiences (
  slug text PRIMARY KEY,
  title text,
  price_per_person numeric,
  max_capacity integer
);

-- Track booking availability
CREATE TABLE public.experience_slots (
  id uuid PRIMARY KEY,
  experience_slug text,
  date date,
  available_spots integer
);
```

---

### POST /api/contact

**Status:** ✗ Not Implemented

**Purpose:** Submit contact form

**Handler:** `app/api/contact/route.ts`

**Current Response:**
```json
{ "error": "Not implemented" } // 501 Not Implemented
```

**Planned Functionality:**

**Request:**
```typescript
{
  name: string,    // Sender's name
  email: string,   // Sender's email
  subject: string, // Message subject
  message: string  // Message body
}
```

**Required Before Implementation:**
1. Validate email format
2. Check for spam (honeypot field, rate limiting)
3. Insert into `contact_messages` table
4. Send notification email to admin via Resend
5. Send confirmation to user
6. Return 201 on success

**Related Component:**
- `components/forms/ContactForm.tsx` (currently empty)
- `app/contact/page.tsx` (currently redirects to trip planner)

---

### POST /api/newsletter

**Status:** ✗ Not Implemented (UI exists)

**Purpose:** Subscribe to email newsletter

**Handler:** `app/api/newsletter/route.ts`

**Current Response:**
```json
{ "error": "Not implemented" } // 501 Not Implemented
```

**Frontend:** `components/site/Newsletter.tsx` (✓ Form works, shows success message to user)

**Planned Functionality:**

**Request:**
```typescript
{
  email: string  // Email address to subscribe
}
```

**Implementation Steps:**
1. Validate email format
2. Check if already subscribed
3. Insert into `newsletter_subscribers` table
4. Send welcome email via Resend
5. Return 201 on success

**Unsubscribe Flow:**
- Include unsubscribe link in emails
- Link calls `POST /api/newsletter/unsubscribe` with token
- Sets `unsubscribed_at` timestamp

**Related Supabase Table:**
```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);
```

---

### GET/POST /api/reviews

**Status:** ✗ Not Implemented

**Purpose:** View and submit experience reviews

**Handler:** `app/api/reviews/route.ts`

**Current Response:**
```json
{ "error": "Not implemented" } // 501 Not Implemented
```

**GET /api/reviews**

**Query Parameters:**
```
?experience_slug=nairobi-insider&published=true&limit=10
```

**Response:**
```typescript
{
  reviews: Array<{
    id: string;
    title: string;
    body: string;
    rating: number;  // 1-5
    author?: string; // Only if published
    created_at: string;
  }>;
  total: number;
}
```

**POST /api/reviews**

**Request:**
```typescript
{
  experienceSlug: string,  // Which experience
  rating: number,          // 1-5 stars
  title: string,          // Review title
  body: string,           // Review text
  // Auth: user_id from JWT
}
```

**Response:**
```json
{
  id: "uuid",
  status: "pending",  // Requires admin approval
  message": "Review submitted. Thank you!"
}
```

**Moderation:**
- Reviews saved with `is_published = false`
- Admin reviews in dashboard and publishes
- Published reviews visible to all

---

## Server Functions & Utilities

### getSupabaseServerClient()

**Location:** `lib/supabase/server.ts`

```typescript
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? 
    createClient(url, key, { auth: { persistSession: false } }) : 
    null;
}
```

**Purpose:**
- Create Supabase client for server-side operations
- Uses `SUPABASE_SERVICE_ROLE_KEY` if available (for admin operations)
- Falls back to anonymous key if service key not configured

**Used in:** All API routes for database operations

**Note:** Service role key required for operations that bypass RLS policies

---

### supabase (Client)

**Location:** `lib/supabase/client.ts`

```typescript
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = url && anonKey ? 
  createClient(url, anonKey) : 
  null;
```

**Purpose:**
- Client-side Supabase instance for browser operations
- Handles authentication, JWT token management
- Subject to RLS policies

**Used in:**
- `AuthForm.tsx` (sign up/sign in)
- `AdminDashboard.tsx` (fetch requests, update status)
- `UserDashboard.tsx` (fetch user's requests)
- `Newsletter.tsx` (though API not implemented yet)

---

## Error Handling Patterns

### API Route Pattern

```typescript
// 1. Validate input
if (!body.required_field) {
  return NextResponse.json(
    { error: 'Field is required' }, 
    { status: 400 }
  );
}

// 2. Check client availability
const supabase = getSupabaseServerClient();
if (!supabase) {
  return NextResponse.json(
    { error: 'Service not configured' }, 
    { status: 503 }
  );
}

// 3. Execute operation
const { error } = await supabase.from('table').insert(data);
if (error) {
  return NextResponse.json(
    { error: 'Operation failed' }, 
    { status: 500 }
  );
}

// 4. Return success
return NextResponse.json({ ok: true }, { status: 201 });
```

### Client Component Error Handling

```typescript
// Components display error to user
const [message, setMessage] = useState('');

async function submit(e: React.FormEvent) {
  try {
    const response = await fetch('/api/endpoint', { ... });
    if (!response.ok) throw new Error();
    setMessage('Success!');
  } catch (error) {
    setMessage('Failed. Please try again.');
  }
}
```

---

## Database Operations

### Insert Operations

#### Trip Request Insertion
```typescript
const { error } = await supabase.from('trip_requests').insert({
  name: body.name,
  email: body.email,
  arrival: body.arrival,
  departure: body.departure,
  travelers: body.travelers,
  traveling_with: body.travelingWith || null,
  interests: body.interests || [],
  destinations: body.destinations || [],
  notes: body.notes || null,
  status: 'new'
});
```

**RLS:** Public inserts allowed (no auth required)

### Select Operations

#### Admin View All Requests
```typescript
const { data, error } = await supabase
  .from('trip_requests')
  .select('id,name,email,status,created_at,destinations')
  .order('created_at', { ascending: false });
```

**RLS:** Only returns if `public.is_admin()` = true

#### User View Own Requests
```typescript
const { data, error } = await supabase
  .from('trip_requests')
  .select('id,created_at,status,arrival,departure,destinations')
  .eq('email', user.email)
  .order('created_at', { ascending: false });
```

**RLS:** Only returns requests where email matches

### Update Operations

#### Admin Update Request Status
```typescript
const { error } = await supabase
  .from('trip_requests')
  .update({ status: 'contacted' })
  .eq('id', requestId);
```

**RLS:** Only succeeds if `public.is_admin()` = true

---

## Authentication in API Routes

### Getting Current User
```typescript
// Client-side
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirect to sign in
}
const userId = user.id;
const email = user.email;

// Check if admin
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', userId)
  .single();
const isAdmin = profile?.role === 'admin';
```

### Server-side
```typescript
// API routes can validate JWT via request headers
// Supabase client handles JWT automatically
// For more control, parse request.headers.get('authorization')
```

---

## Planned Email Integration (Resend)

**Environment Variables:**
```
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=noreply@kenyainsider.com
RESEND_TO_EMAIL=admin@kenyainsider.com
```

**Implementation Template:**

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send trip request confirmation
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: body.email,
  subject: 'We received your Kenya Insider trip request',
  html: '<h1>Thank you!</h1><p>We will review your request and be in touch soon.</p>'
});

// Send admin notification
await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: process.env.RESEND_TO_EMAIL,
  subject: `New trip request from ${body.name}`,
  html: `<h2>Guest: ${body.name}</h2><p>Email: ${body.email}</p>...`
});
```

---

## Rate Limiting (Not Implemented)

**Recommended Pattern:**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),  // 5 requests per hour
});

export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' }, 
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

---

## Testing API Endpoints

### Using curl

```bash
# Test trip request
curl -X POST http://localhost:3000/api/trip-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "arrival": "2024-12-01",
    "departure": "2024-12-10",
    "travelers": "2",
    "interests": ["Wildlife", "Food"],
    "destinations": ["Nairobi", "Maasai Mara"]
  }'
```

### Using Postman

1. Create POST request to `http://localhost:3000/api/trip-requests`
2. Set Body type to JSON
3. Enter request payload
4. Click Send
5. View response

---

## Deployment Considerations

### Before Production
1. [ ] All API endpoints implemented
2. [ ] Error handling complete
3. [ ] Input validation robust
4. [ ] Email service integrated and tested
5. [ ] Rate limiting implemented
6. [ ] CORS headers configured if needed
7. [ ] Environment variables set in production
8. [ ] Database RLS policies verified
9. [ ] Load testing completed
10. [ ] Logging and monitoring set up

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL          # Public
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public
SUPABASE_SERVICE_ROLE_KEY         # Secret - for API routes
RESEND_API_KEY                    # Secret - for emails
RESEND_FROM_EMAIL                 # Email address
RESEND_TO_EMAIL                   # Admin email
```

