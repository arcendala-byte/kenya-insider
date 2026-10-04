# Kenya Insider — Route Inventory

## Route Structure

The application supports two route structures:

1. **Localized routes** (Primary, in `app/[locale]/`)
   - Dynamic locale parameter: `en`, `fr`
   - Not yet fully implemented (pages exist as placeholders)

2. **Non-localized legacy routes** (in `app/`)
   - Backward compatibility routes
   - All content pages currently use this structure

## Complete Route List

### Public Pages (No Authentication Required)

#### Homepage & Core
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/` | `app/page.tsx` | ✓ | Hero, categories, featured experiences, destinations explorer, newsletter |
| `/en` | `app/[locale]/page.tsx` | ⚠️ | Localized home (placeholder, not actively routed) |
| `/fr` | `app/[locale]/page.tsx` | ⚠️ | Localized home (placeholder, not actively routed) |

#### Experiences
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/experiences` | `app/experiences/page.tsx` | ✓ | Experience listing with filters and explorer |
| `/experiences/[slug]` | `app/experiences/[slug]/page.tsx` | ✓ | Individual experience detail page |
| Supported slugs: | | | |
| | `nairobi-insider` | ✓ | Nairobi Insider Experience |
| | `nairobi-wildlife` | ✓ | Nairobi Wildlife Experience |
| | `nairobi-food-culture` | ✓ | Nairobi Food & Culture Experience |
| | `maasai-mara-safari` | ✓ | Maasai Mara Safari Experience |
| | `naivasha-weekend-escape` | ✓ | Naivasha Weekend Escape |
| | `mount-kenya-adventure` | ✓ | Mount Kenya Adventure |
| | `diani-beach-escape` | ✓ | Diani Beach Escape |
| | `kenya-custom-experience` | ✓ | Kenya Custom Experience |

#### Destinations
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/destinations` | `app/destinations/page.tsx` | ✓ | Destination grid with featured selections |
| `/destinations/[slug]` | `app/destinations/[slug]/page.tsx` | ✓ | Individual destination detail page |
| Supported slugs: | | | |
| | `nairobi` | ✓ | Nairobi |
| | `maasai-mara` | ✓ | Maasai Mara |
| | `amboseli` | ✓ | Amboseli |
| | `naivasha` | ✓ | Naivasha |
| | `diani` | ✓ | Diani |
| | `mombasa` | ✓ | Mombasa |
| | `lamu` | ✓ | Lamu |
| | `watamu` | ✓ | Watamu |

#### Information Pages
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/about` | `app/about/page.tsx` | ✓ | About Kenya Insider |
| `/faq` | `app/faq/page.tsx` | ✓ | FAQ with accordion (7 questions) |
| `/contact` | `app/contact/page.tsx` | ✓ | Contact info page (redirects to trip planner) |
| `/plan-your-trip` | `app/plan-your-trip/page.tsx` | ✓ | Trip planning form landing page |
| `/journal` | `app/journal/page.tsx` | ✗ | Placeholder: "Being prepared..." |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | ✓ | Privacy policy content |
| `/terms-and-conditions` | `app/terms-and-conditions/page.tsx` | ✓ | Terms & conditions content |
| `/cancellation` | `app/cancellation/page.tsx` | ✓ | Cancellation policy content |

#### Services
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/services` | Not found | ✗ | Not implemented |
| `/services/kenya-welcome` | `app/services/kenya-welcome/page.tsx` | ✓ | Kenya Welcome service details |

### Authentication Pages (Public, But Redirect If Logged In)
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/sign-in` | `app/sign-in/page.tsx` | ✓ | Sign in form (Supabase Auth) |
| `/register` | `app/register/page.tsx` | ✓ | Registration form (Supabase Auth) |

### Protected Pages (Authentication Required)
| Route | Component | Status | Notes |
|-------|-----------|--------|-------|
| `/dashboard` | `app/dashboard/page.tsx` | ✓ | User's trip requests + account management |
| | → `UserDashboard.tsx` | | Shows: email, planning requests list, sign out |
| `/admin` | `app/admin/page.tsx` | ✓ | Admin trip request management (admin role required) |
| | → `AdminDashboard.tsx` | | Shows: all requests table, status updates |

### API Endpoints
| Route | Method | Status | Purpose | Auth |
|-------|--------|--------|---------|------|
| `/api/trip-requests` | POST | ✓ | Submit trip planning request | None |
| `/api/bookings` | GET | ✗ | Get user bookings | User |
| `/api/bookings` | POST | ✗ | Create booking | User |
| `/api/contact` | POST | ✗ | Submit contact form | None |
| `/api/newsletter` | POST | ✗ | Subscribe to newsletter | None |
| `/api/reviews` | GET | ✗ | Get experience reviews | None |
| `/api/reviews` | POST | ✗ | Submit review | User |

### Localized Routes (Planned But Not Active)
Located in `app/[locale]/`, these routes are defined but:
- Not actively routed (no middleware redirects)
- Mostly placeholder implementations
- Will supersede non-localized routes when implemented

| Route | Status | Notes |
|-------|--------|-------|
| `/[locale]/about` | ⚠️ | Placeholder structure exists |
| `/[locale]/admin` | ⚠️ | Placeholder structure exists |
| `/[locale]/cancellation-policy` | ⚠️ | Placeholder structure exists |
| `/[locale]/concierge` | ⚠️ | Not implemented |
| `/[locale]/contact` | ⚠️ | Placeholder structure exists |
| `/[locale]/destinations` | ⚠️ | Placeholder structure exists |
| `/[locale]/experiences` | ⚠️ | Placeholder structure exists |
| `/[locale]/faq` | ⚠️ | Placeholder structure exists |
| `/[locale]/journal` | ⚠️ | Placeholder structure exists |
| `/[locale]/plan-your-trip` | ⚠️ | Placeholder structure exists |
| `/[locale]/privacy` | ⚠️ | Placeholder structure exists |
| `/[locale]/services` | ⚠️ | Placeholder structure exists |
| `/[locale]/services/photography` | ⚠️ | Placeholder structure exists |
| `/[locale]/terms` | ⚠️ | Placeholder structure exists |

## Route Architecture Details

### Dynamic Routes

#### Experiences Dynamic Segment
- **File:** `app/experiences/[slug]/page.tsx`
- **Route Pattern:** `/experiences/[slug]`
- **Params:** `slug` (experience slug from `lib/catalog.ts`)
- **Data Fetching:** Experience details from hardcoded catalog
- **Fallback:** Shows 404 if slug not found in catalog

#### Destinations Dynamic Segment
- **File:** `app/destinations/[slug]/page.tsx`
- **Route Pattern:** `/destinations/[slug]`
- **Params:** `slug` (destination slug from `lib/catalog.ts`)
- **Data Fetching:** Destination details from hardcoded catalog
- **Fallback:** Shows 404 if slug not found in catalog

#### Localized Routes (Proposed)
- **File:** `app/[locale]/[resource]/page.tsx`
- **Route Pattern:** `/[locale]/[resource]`
- **Params:** `locale` (en, fr, es)
- **Status:** Structure exists but not functional
- **Required:** i18next implementation to load content by locale

## Navigation Structure

### Header Navigation (StickyNav)
- Home
- Experiences
- Destinations
- Plan your trip
- About
- FAQ
- Contact
- Language Switcher (EN/FR/ES dropdown)

### Footer Navigation (SiteFooter)
**Explore Column:**
- Experiences
- Destinations
- Journal
- About
- Plan your trip
- Contact

**Good to Know Column:**
- FAQ
- Privacy
- Terms
- Cancellation Policy

### Utility Navigation (UtilityNav)
- Instagram (if configured)
- Facebook (if configured)
- Language links (manual)

### Floating Elements
- WhatsApp Button (fixed position, bottom-right)
  - Only visible if `NEXT_PUBLIC_WHATSAPP_NUMBER` is configured
  - Links to WhatsApp with preset message

## Route Middleware

### Current Implementation
Located in `middleware.ts`:
```typescript
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
```
**Status:** Minimal - only passes requests through (no locale routing)

### Missing Middleware
- Locale detection (language preference from headers)
- Locale routing (redirect to /[locale] paths)
- Authentication checks (currently done in components)
- Role-based route protection

## Authentication Flow by Route

### Public Routes → Sign In Required
```
/experiences → /sign-in (if trying to access protected action)
/plan-your-trip → submits without auth, but can see dashboard if logged in
/dashboard → redirects to /sign-in if not authenticated
/admin → redirects to /sign-in if not authenticated, then to /dashboard if not admin
```

### Session Management
- Supabase handles JWT tokens in cookies
- Next.js automatically validates with each request
- Components check `supabase.auth.getUser()` for auth status
- Role check: `data.user.user_metadata.role === 'admin'`

## Special Routes

### Catch-All & Not Found
- Unmatched routes return Next.js 404 page
- 404 page includes site footer and navigation

### Redirects
- Sign in → `/dashboard` (if already logged in)
- Register → `/dashboard` (after successful registration)
- Admin (non-admin user) → `/dashboard`
- Dashboard (not logged in) → `/sign-in`

## SEO Configuration

### Metadata
Each page includes `metadata` export:
- `title`: Page title
- `description`: Meta description
- `openGraph`: OG tags for social sharing
- `twitter`: Twitter card configuration

### Sitemap & Robots
- Not explicitly configured
- Next.js generates default sitemap at `/sitemap.xml`
- Default robots.txt allows all

## Performance Routes

### Static Generation
- Homepage: Generated at build time (fast)
- Experience/destination pages: Generated at build time
- FAQ, policy pages: Generated at build time

### Dynamic Rendering
- `/dashboard`: Rendered on each request (user-specific data)
- `/admin`: Rendered on each request (admin data)

### No ISR (Incremental Static Regeneration)
- Not currently implemented
- Would help cache dashboard data

## Route Query Parameters

### Supported Query Parameters
- None explicitly defined
- Experience explorer has filtering UI (client-side filtering)

### Future Query Parameters (Planned)
- `/experiences?category=wildlife` (not implemented)
- `/destinations?region=coast` (not implemented)
- `/dashboard?status=new` (not implemented)

## Error Handling

### Route-Level Errors
- Missing experience/destination slug: Shows 404
- Authentication errors in protected routes: Redirects to /sign-in
- Database connection errors: Shows error message in dashboard

### API Error Handling
- 400: Validation error (bad input)
- 500: Server error (database error)
- 501: Not implemented (unimplemented endpoints)
- 503: Service unavailable (Supabase not configured)

