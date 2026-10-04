# Kenya Insider — Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        End User (Browser)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App (Port 3000)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Pages & Components (App Router)                    │    │
│  │  - Static: Homepage, Experiences, Destinations      │    │
│  │  - Dynamic: [experiences/slug], [destinations/slug] │    │
│  │  - Protected: /dashboard, /admin                    │    │
│  └─────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  API Routes (/api/*)                                │    │
│  │  - POST /api/trip-requests (✓)                      │    │
│  │  - POST /api/bookings (✗)                           │    │
│  │  - POST /api/contact (✗)                            │    │
│  │  - POST /api/newsletter (✗)                         │    │
│  │  - GET /api/reviews (✗)                             │    │
│  └─────────────────────────────────────────────────────┘    │
└──────┬──────────────────────────────┬──────────────────────┘
       │                              │
       │ Server-side SDK              │ Client-side SDK
       │                              │
       ▼                              ▼
┌──────────────────────┐   ┌──────────────────────┐
│ Supabase Backend     │   │ Supabase Auth        │
│ (PostgreSQL)         │   │ (JWT Tokens)         │
│ - trip_requests      │   │                      │
│ - bookings           │   │ Users:               │
│ - contact_messages   │   │ - id (uuid)          │
│ - newsletter_subs    │   │ - email              │
│ - reviews            │   │ - metadata (role)    │
│ - profiles (RLS)     │   │                      │
└──────────────────────┘   └──────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
RootLayout
├── LocaleProvider (Context for language state)
├── UtilityNav (Social links, utility buttons)
├── StickyNav (Main navigation)
├── Route Component (Page content)
│   ├── Hero sections
│   ├── Content sections
│   ├── Forms (TripPlanner, Newsletter, etc.)
│   └── CTA buttons
├── SiteFooter (Navigation, links)
└── WhatsAppButton (Fixed position)
```

### Component Types

#### Pages (in `app/`)
- Static pages: Home, Experiences, Destinations, FAQ, etc.
- Dynamic pages: [slug] routes for experiences/destinations
- Protected pages: /dashboard, /admin with auth checks

#### Layout Components
- `StickyNav.tsx` — Primary navigation
- `SiteFooter.tsx` — Footer with links
- `UtilityNav.tsx` — Social media links
- `WhatsAppButton.tsx` — Floating WhatsApp button

#### Feature Components
- `TripPlanner.tsx` — Multi-step trip planning form
- `Newsletter.tsx` — Email subscription form
- `AuthForm.tsx` — Sign in/register
- `AdminDashboard.tsx` — Request management
- `UserDashboard.tsx` — User trip requests view

#### Display Components
- `ExperienceCard.tsx`, `ExperienceGrid.tsx`, `ExperienceExplorer.tsx`
- `DestinationCard.tsx`, `DestinationGrid.tsx`
- `ReviewCard.tsx`, `ReviewSection.tsx`
- `FaqAccordion.tsx`, `BlogCard.tsx`, `BlogGrid.tsx`

#### UI Components (Reusable)
- `Button.tsx` — Styled button
- `Card.tsx` — Card container
- `Input.tsx`, `Select.tsx`, `Textarea.tsx` — Form inputs
- `Modal.tsx` — Modal dialog
- `Badge.tsx` — Badge component
- `Loading.tsx`, `EmptyState.tsx`, `ErrorState.tsx` — States

### Client vs Server Components

#### Server Components (Default)
- All page.tsx files (render at build time or request time)
- Image optimization via Next.js Image
- Data fetching at server level

#### Client Components (`'use client'`)
- `TripPlanner` — Form state management
- `Newsletter` — Form state management
- `AuthForm` — Form state, redirect logic
- `AdminDashboard` — Real-time data fetching, mutations
- `UserDashboard` — Real-time data fetching
- `LanguageSwitcher` — Locale state via context
- All dashboard components — Client-side interactivity

## Backend Architecture

### API Route Pattern

```typescript
// /api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // 1. Parse request body
  const body = await request.json();
  
  // 2. Validate required fields
  if (!body.required_field) {
    return NextResponse.json({ error: '...' }, { status: 400 });
  }
  
  // 3. Initialize Supabase server client
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }
  
  // 4. Execute database operation
  const { data, error } = await supabase
    .from('table_name')
    .insert({ ... });
  
  // 5. Return response
  if (error) {
    return NextResponse.json({ error: 'Operation failed' }, { status: 500 });
  }
  
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

### Implemented Endpoint: POST /api/trip-requests

```typescript
// Request body
{
  name: string,           // Required
  email: string,          // Required, validated
  arrival: string,        // Required, ISO date
  departure: string,      // Required, ISO date
  travelers: string,      // Required
  travelingWith?: string, // Optional
  interests?: string[],   // Optional
  destinations?: string[],// Optional
  notes?: string         // Optional
}

// Response (success)
{ "ok": true } // 201 Created

// Response (error)
{ "error": "Please provide valid contact and travel details." } // 400
{ "error": "We could not save your request. Please try again." } // 500
{ "error": "The booking service is not configured yet." } // 503
```

### Authentication Flow

```
User -> Sign Up/Sign In -> Supabase Auth
                             ↓
                        Creates JWT Token
                             ↓
                        Stores in Session
                             ↓
Subsequent Requests -> Include JWT in Header
                             ↓
                        API validates JWT
                             ↓
              Fetches user data via RLS policies
```

## Data Flow Patterns

### Trip Request Creation Flow
```
1. User fills TripPlanner form
2. Form validates inputs (client-side)
3. POST to /api/trip-requests
4. Server validates again (backend validation)
5. Supabase inserts into trip_requests table
6. RLS policy: Anyone can insert (no auth required)
7. Return success/error to client
8. Admin sees in AdminDashboard via auth query
```

### Trip Request View Flow (Admin)
```
1. Admin visits /admin
2. AdminDashboard checks if logged in + has admin role
3. Fetches trip_requests from Supabase
4. RLS policy: Only admins can select
5. Renders table with requests
6. Admin updates status via select dropdown
7. Client sends update to Supabase
8. RLS policy: Only admins can update
9. Table re-renders with new status
```

### Trip Request View Flow (User)
```
1. User visits /dashboard
2. UserDashboard checks if logged in
3. Fetches trip_requests filtered by user's email
4. RLS policy: Users can only see own requests (by email match)
5. Renders list of their requests
6. User can see status updates
```

## State Management

### Application State
- **Global:** Locale (language preference) via `LocaleProvider` context
- **Page-level:** Form inputs, loading states, error messages
- **Server:** Session management via Supabase Auth tokens

### Data Persistence
- **Frontend:** Browser localStorage for locale preference
- **Backend:** Supabase PostgreSQL for all data
- **Cache:** None currently (no caching layer)

## Security Architecture

### Row-Level Security (RLS) Policies

#### trip_requests table
- **Insert:** Anonymous users can insert (no auth required)
- **Select:** 
  - Customers: Can see own by email match
  - Admins: Can see all
- **Update:**
  - Admins only: Can update status
  - Customers: Cannot update

#### profiles table
- **Select:**
  - Users: Can see own profile
  - Admins: Can see all
- **Update:**
  - Users: Can update own profile (except role field)
  - Admins: Can update all

#### bookings table
- **Select:**
  - Users: Can see own bookings
  - Admins: Can see all
- **Insert:**
  - Users: Can create own bookings
- **Update:**
  - Admins: Can update all
  - Users: Cannot update

#### reviews table
- **Select:**
  - Public: Can see published reviews only
  - Authors: Can see own reviews
  - Admins: Can see all
- **Insert:**
  - Authenticated users: Can create
- **Update:**
  - Authors or admins: Can update

### Authentication Security
- Passwords: Hashed by Supabase Auth (bcrypt)
- Sessions: JWT tokens with expiration
- Environment: API keys in .env (never exposed to client)
- Service Role Key: Used only server-side for admin operations

## Performance Considerations

### Current Implementation
- Static content (experiences, destinations) hardcoded in memory
- No database query caching
- No pagination on dashboard tables
- No image CDN (served from /public directory)
- No code splitting beyond Next.js defaults

### Potential Bottlenecks
1. Dashboard queries fetch ALL requests (no limit)
2. Experiences/destinations not lazy-loaded
3. No database indexes beyond primary keys
4. No API rate limiting

### Recommended Optimizations
1. Implement pagination on dashboards (limit 50, offset)
2. Move experiences/destinations to database with caching
3. Add database indexes on foreign keys and frequently filtered fields
4. Implement API rate limiting
5. Set up image CDN (Cloudinary, Vercel Image Optimization)
6. Use Supabase caching headers for static content

## Scalability

### Current Limitations
- Single-region Supabase instance
- No load balancing
- No database read replicas
- Single-threaded Node.js processes

### Scaling Recommendations
1. Implement Supabase connection pooling
2. Add Redis caching layer for frequently accessed data
3. Set up CDN for static assets
4. Implement database read replicas for reporting/admin
5. Use Vercel Edge Functions for reduced latency

