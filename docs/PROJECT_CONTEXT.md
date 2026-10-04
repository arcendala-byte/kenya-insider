# Kenya Insider — Project Context

**Last Updated:** 2026-09-11  
**Status:** Development Phase

## Project Overview

Kenya Insider is a premium travel experiences and planning platform designed to connect travelers with authentic, locally-informed Kenya experiences. The website functions as a digital storefront for curated travel packages, a trip planning tool, and an admin dashboard for managing customer requests.

### Core Value Proposition
- **Local Knowledge:** Deeply rooted Kenya travel expertise
- **Personalization:** Experiences designed around individual traveler needs
- **Curation:** Carefully selected experiences and destinations
- **Planning Support:** Request-based trip planning model (not instant booking)

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 14.2.4 |
| **Runtime** | React | 18.2.0 |
| **Language** | TypeScript | 5.4.5 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **UI Components** | Headless UI, Heroicons | @headlessui/react ^1.7.15, @heroicons/react ^2.1.3 |
| **Backend** | Supabase (PostgreSQL) | 2.39.4 |
| **Authentication** | Supabase Auth | Built-in |
| **Internationalization** | i18next | ^26.4.2 |
| **Email Service** | Resend (planned) | Not yet integrated |

---

## Folder Structure

```
kenya_insider/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Locale-specific routes (en, fr)
│   │   ├── about/
│   │   ├── admin/
│   │   ├── cancellation-policy/
│   │   ├── contact/
│   │   ├── destinations/
│   │   ├── experiences/
│   │   ├── faq/
│   │   ├── journal/              # Placeholder
│   │   ├── plan-your-trip/       # Placeholder
│   │   ├── privacy/              # Placeholder
│   │   ├── services/             # Placeholder
│   │   ├── terms/                # Placeholder
│   │   └── page.tsx              # Locale home
│   ├── api/                      # API Routes
│   │   ├── bookings/             # Not implemented
│   │   ├── contact/              # Not implemented
│   │   ├── newsletter/           # Not implemented
│   │   ├── reviews/              # Not implemented
│   │   └── trip-requests/        # ✓ Implemented
│   ├── [locale-legacy]/          # Non-localized legacy routes
│   │   ├── about/
│   │   ├── admin/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── destinations/
│   │   ├── experiences/
│   │   ├── faq/
│   │   ├── journal/
│   │   ├── plan-your-trip/
│   │   ├── privacy-policy/
│   │   ├── register/
│   │   ├── services/
│   │   ├── sign-in/
│   │   └── terms-and-conditions/
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── auth/
│   │   └── AuthForm.tsx           # Sign in/register form
│   ├── booking/
│   │   ├── BookingForm.tsx        # Empty
│   │   └── BookingModal.tsx       # Placeholder modal
│   ├── dashboard/
│   │   ├── AdminDashboard.tsx     # ✓ Implemented
│   │   └── UserDashboard.tsx      # ✓ Implemented
│   ├── destinations/
│   │   ├── DestinationCard.tsx
│   │   └── DestinationGrid.tsx
│   ├── experiences/
│   │   ├── ExperienceCard.tsx
│   │   ├── ExperienceFilters.tsx
│   │   └── ExperienceGrid.tsx
│   ├── footer/
│   ├── forms/
│   │   ├── ContactForm.tsx        # Empty
│   │   ├── NewsletterForm.tsx     # Form exists, backend not implemented
│   │   └── TripPlannerForm.tsx
│   ├── navigation/
│   │   ├── MobileMenu.tsx
│   │   ├── Navbar.tsx
│   │   ├── StickyNav.tsx
│   │   └── UtilityNav.tsx
│   ├── site/
│   │   ├── ExperienceExplorer.tsx
│   │   ├── FaqAccordion.tsx
│   │   ├── Newsletter.tsx         # ✓ Form works, backend pending
│   │   ├── SiteFooter.tsx         # ✓ Implemented
│   │   ├── SiteLogo.tsx
│   │   ├── TripPlanner.tsx        # ✓ Form implemented, API working
│   │   └── WhatsAppButton.tsx     # ✓ Implemented
│   ├── ui/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   ├── LanguageSwitcher.tsx       # ✓ Implemented
│   └── LocaleProvider.tsx         # ✓ Implemented
│
├── lib/                          # Utilities & Libraries
│   ├── auth/
│   │   └── auth.ts               # Empty (placeholder)
│   ├── supabase/
│   │   ├── client.ts             # ✓ Client-side Supabase
│   │   ├── server.ts             # ✓ Server-side Supabase
│   │   └── middleware.ts         # Empty
│   ├── utils/
│   ├── validations/
│   ├── catalog.ts                # ✓ Hardcoded experiences & destinations
│   └── i18n.ts                   # ✓ Internationalization config
│
├── types/                        # TypeScript Types
│   ├── blog.ts
│   ├── booking.ts
│   ├── customer.ts               # Empty
│   ├── database.ts               # Empty
│   ├── destination.ts
│   ├── experience.ts
│   ├── review.ts
│   └── trip-request.ts
│
├── public/                       # Static Assets
│   ├── images/                   # Image assets (organized by category)
│   ├── locales/                  # Locale files (en, fr)
│   └── og-image.png              # OG image
│
├── supabase/                     # Database
│   └── schema.sql                # Complete schema definition
│
├── middleware.ts                 # Next.js middleware (minimal)
├── next.config.js                # Next.js config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
├── next-i18next.config.js        # i18next config
├── package.json                  # Dependencies
└── .env.example                  # Environment variables template
```

---

## Architecture

### Frontend Architecture
- **App Router:** Uses Next.js 14 App Router for routing
- **Rendering Strategy:** Mix of SSR and Client Components
- **Styling:** Tailwind CSS with custom theme (forest green, warm ivory, soft gold color scheme)
- **State Management:** React hooks, Supabase client for persistence
- **Localization:** i18next for EN/FR/ES (EN/FR actively used)

### Backend Architecture
- **API Server:** Next.js API Routes (minimal implementation)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with role-based access (customer/admin)
- **File Storage:** Not yet implemented
- **Email Service:** Resend (configured but not integrated)

### Data Flow
1. **Frontend → API Routes:** Formsubmissions via POST requests
2. **API Routes → Supabase:** Data persisted via Supabase server client
3. **Supabase → Frontend:** Data fetched via Supabase client with row-level security
4. **Authentication:** Supabase Auth handles user management

---

## Database Schema

### Tables

#### 1. **profiles** (User Profiles)
```sql
- id (uuid, pk) → auth.users.id
- full_name (text)
- role (text: 'customer' | 'admin')
- created_at (timestamptz)
- updated_at (timestamptz)
```
**Row-Level Security:**
- Users can read their own profile
- Admins can read/update all profiles
- Users cannot change their own role

#### 2. **trip_requests** (Travel Planning Requests)
```sql
- id (uuid, pk)
- user_id (uuid, fk) → auth.users.id
- name (text)
- email (text)
- arrival (date)
- departure (date)
- travelers (text)
- traveling_with (text)
- interests (text[])
- destinations (text[])
- notes (text)
- status (text: 'new' | 'reviewing' | 'contacted' | 'closed')
- created_at (timestamptz)
- updated_at (timestamptz)
```
**Row-Level Security:**
- Customers can read own requests (by email)
- Admins can update all requests

#### 3. **bookings** (Experience Bookings)
```sql
- id (uuid, pk)
- user_id (uuid, fk) → auth.users.id
- experience_slug (text)
- start_date (date)
- guests (integer)
- total_amount (numeric)
- currency (text: default 'KES')
- status (text: 'pending' | 'confirmed' | 'cancelled' | 'completed')
- created_at (timestamptz)
- updated_at (timestamptz)
```
**Status:** Not yet fully implemented

#### 4. **contact_messages** (Contact Form Submissions)
```sql
- id (uuid, pk)
- name (text)
- email (text)
- subject (text)
- message (text)
- status (text: 'new' | 'read' | 'replied' | 'closed')
- created_at (timestamptz)
```
**Status:** Form backend not implemented

#### 5. **newsletter_subscribers** (Email Subscribers)
```sql
- id (uuid, pk)
- email (text, unique)
- subscribed_at (timestamptz)
- unsubscribed_at (timestamptz)
```
**Status:** Form exists, backend not implemented

#### 6. **reviews** (Experience Reviews)
```sql
- id (uuid, pk)
- user_id (uuid, fk) → auth.users.id
- experience_slug (text)
- rating (integer: 1-5)
- title (text)
- body (text)
- is_published (boolean)
- created_at (timestamptz)
```
**Status:** Not implemented

### Triggers
- `on_auth_user_created`: Creates profile when user signs up
- `touch_updated_at`: Auto-updates `updated_at` timestamp on modifications

---

## Content Management

### Experiences (Hardcoded in `lib/catalog.ts`)
8 curated experiences currently defined:
1. Nairobi Insider Experience
2. Nairobi Wildlife Experience
3. Nairobi Food & Culture Experience
4. Maasai Mara Safari Experience
5. Naivasha Weekend Escape
6. Mount Kenya Adventure
7. Diani Beach Escape
8. Kenya Custom Experience

**Status:** Development seed content. Should be migrated to Supabase `experiences` table.

### Destinations (Hardcoded in `lib/catalog.ts`)
8 destinations currently defined:
1. Nairobi
2. Maasai Mara
3. Amboseli
4. Naivasha
5. Diani
6. Mombasa
7. Lamu
8. Watamu

**Status:** Development seed content. Should be migrated to Supabase `destinations` table.

### Content Translations
- **Experiences:** French translations included in `experienceTranslations`
- **UI Copy:** English, French, Spanish definitions in `lib/i18n.ts`
- **Status:** English and French are active; Spanish defined but not configured

---

## Authentication & Authorization

### Current Implementation
- **Sign Up:** Email + password via Supabase Auth
- **Sign In:** Email + password via Supabase Auth
- **Session Management:** Supabase handles JWT tokens
- **Role-Based Access:** Two roles (customer, admin)

### Protected Routes
- `/dashboard`: Requires authentication (redirects to `/sign-in`)
- `/admin`: Requires admin role (redirects to `/dashboard`)

### Public Routes
- Homepage, experiences, destinations, FAQ, contact, etc.

---

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  # Supabase anonymous key (public)
SUPABASE_SERVICE_ROLE_KEY      # Supabase service role (server-only, for API routes)
```

### Optional
```
NEXT_PUBLIC_SITE_URL           # Site URL (default: http://localhost:3000)
NEXT_PUBLIC_WHATSAPP_NUMBER    # WhatsApp number for contact button
RESEND_API_KEY                 # Resend email service (not integrated yet)
RESEND_FROM_EMAIL              # From email for Resend
RESEND_TO_EMAIL                # Admin email for Resend
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID # Google Analytics (not integrated)
NEXT_PUBLIC_INSTAGRAM_URL      # Social media links
NEXT_PUBLIC_FACEBOOK_URL       # Social media links
```

### Current Status (.env.local)
- ✓ Supabase configured (project URL and keys present)
- ✓ WhatsApp number configured
- ⚠️ Resend API key has placeholder value
- ⚠️ Missing social media URLs

---

## Key Routes & Pages

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✓ Working | Homepage with hero, categories, featured experiences |
| `/experiences` | ✓ Working | Experience listing with filters |
| `/experiences/[slug]` | ✓ Working | Individual experience details |
| `/destinations` | ✓ Working | Destination listing |
| `/destinations/[slug]` | ✓ Working | Individual destination details |
| `/plan-your-trip` | ⚠️ Partial | Form works, API functional |
| `/faq` | ✓ Working | FAQ with accordion |
| `/contact` | ✓ Working | Contact info page (form not in place) |
| `/journal` | ✗ Placeholder | Page in progress notice |
| `/services` | ✗ Placeholder | Services listing page |
| `/services/kenya-welcome` | ✓ Working | Kenya Welcome service page |
| `/privacy-policy` | ✓ Working | Privacy policy |
| `/terms-and-conditions` | ✓ Working | Terms & conditions |
| `/cancellation` | ✓ Working | Cancellation policy |
| `/about` | ✓ Working | About page |
| `/sign-in` | ✓ Working | Authentication |
| `/register` | ✓ Working | Authentication |
| `/dashboard` | ✓ Working | User trip requests dashboard |
| `/admin` | ✓ Working | Admin trip requests management |

### Non-Locale Routes (Legacy)
Same pages exist at non-localized paths for backward compatibility.

---

## API Endpoints

| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/trip-requests` | POST | ✓ | Submit trip planning request |
| `/api/bookings` | GET/POST | ✗ | Booking management |
| `/api/contact` | GET/POST | ✗ | Contact form submission |
| `/api/newsletter` | POST | ✗ | Newsletter subscription |
| `/api/reviews` | GET/POST | ✗ | Review management |

---

## Integrations

### Implemented
- ✓ **Supabase:** Authentication and data persistence
- ✓ **Next.js Image Optimization:** Images via `/public/images`
- ✓ **Heroicons:** Icon library
- ✓ **Headless UI:** Unstyled accessible components

### Partially Implemented
- ⚠️ **i18next:** UI strings configured (EN/FR/ES), but not full content translation
- ⚠️ **WhatsApp:** Button exists, requires number in env

### Not Implemented
- ✗ **Email Service:** Resend configured in env but no integration
- ✗ **Analytics:** Google Analytics configured but not integrated
- ✗ **Payment:** No payment gateway integration
- ✗ **File Upload:** No image/document storage
- ✗ **CDN:** Images served from `/public`

---

## Development Guidelines

### Important Rules
1. **Do not rebuild from scratch** — enhance existing structure
2. **Preserve design theme** — forest green (#123C2A), warm ivory (#F7F3EA), soft gold (#B8945A)
3. **Maintain TypeScript strict mode** — no `any` types
4. **Row-level security** — all data queries must use RLS policies
5. **Client vs Server:** Use `'use client'` for interactive components, keep API routes server-only
6. **Localization:** Any new strings should be added to `lib/i18n.ts`

### Known TypeScript Issues
- `baseUrl` and `moduleResolution: 'node'` are deprecated (TypeScript 7.0)
- Add `"ignoreDeprecations": "6.0"` to `tsconfig.json` or migrate to `bundler`

### Code Quality Notes
- Several empty files exist (auth.ts, ContactForm.tsx, customer.ts, database.ts, middleware.ts)
- Comments indicate "seed content" should be replaced with database queries
- Placeholder images referenced for some experiences

---

## Deployment Readiness

### Prerequisites Before Production
1. [ ] Run `supabase/schema.sql` on Supabase project
2. [ ] Configure admin user in Supabase `profiles` table
3. [ ] Integrate Resend email service for trip request notifications
4. [ ] Populate experiences and destinations from database (not hardcoded)
5. [ ] Implement newsletter, contact, and review API endpoints
6. [ ] Set up CI/CD pipeline
7. [ ] Configure custom domain
8. [ ] Implement analytics
9. [ ] Add image CDN/storage (Supabase Storage or external)
10. [ ] Security: Review RLS policies, environment variables, CORS

### Performance Considerations
- Homepage loads 8 experiences and 8 destinations from memory
- Images are unoptimized (no external CDN configured)
- No caching strategy defined
- Database queries in dashboards are not paginated

---

## Next Steps (Priority Order)

1. **P0 - Critical:**
   - Apply database schema to Supabase
   - Implement newsletter API endpoint
   - Implement contact form backend
   - Move experiences/destinations to database

2. **P1 - High:**
   - Implement bookings API
   - Implement reviews API
   - Add payment gateway integration
   - Set up email notifications (Resend)

3. **P2 - Medium:**
   - Complete localized [locale] routes
   - Implement journal/blog functionality
   - Add image management system
   - Implement analytics

4. **P3 - Low:**
   - Spanish language support
   - Advanced filtering/search
   - User profile management
   - Email preferences

---

## Related Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical architecture details
- [ROUTES.md](./ROUTES.md) — Complete route inventory
- [DATABASE.md](./DATABASE.md) — Database schema and queries
- [BACKEND.md](./BACKEND.md) — API implementation status
- [FEATURES.md](./FEATURES.md) — Feature-by-feature status matrix
- [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) — Issues prioritized by severity
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) — Setup and development workflow

