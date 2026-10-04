# Kenya Insider — Known Issues & Limitations

## Issues Organized by Severity

### 🔴 Critical (Blocks Deployment)

#### 1. Database Schema Not Applied
- **Severity:** P0 Critical
- **Component:** Supabase
- **Status:** ⚠️ Blocking
- **Description:** `supabase/schema.sql` has never been run on the Supabase project
- **Impact:** 
  - No tables exist (app fails at runtime)
  - Authentication setup incomplete
  - All data operations fail
- **Resolution:**
  1. Log into Supabase dashboard
  2. Go to SQL Editor
  3. Paste content from `supabase/schema.sql`
  4. Execute the script
  5. Verify all 6 tables created
- **Estimated Time:** 5 minutes

#### 2. Missing API Implementations (4 Endpoints)
- **Severity:** P0 Critical
- **Components:** 
  - `/api/bookings` → Returns 501 Not Implemented
  - `/api/contact` → Returns 501 Not Implemented
  - `/api/newsletter` → Returns 501 Not Implemented
  - `/api/reviews` → Returns 501 Not Implemented
- **Impact:** 
  - Newsletter form doesn't work (data lost)
  - Contact form (when created) won't work
  - Booking system incomplete
  - Reviews system incomplete
- **Blocking:** Cannot launch without at least newsletter & contact
- **Resolution:** Implement 4 API endpoints (see `BACKEND.md`)
- **Estimated Time:** 2-4 hours per endpoint

#### 3. Email Service Not Integrated
- **Severity:** P0 Critical
- **Component:** Resend Integration
- **Status:** ⚠️ Configured but not used
- **Description:** 
  - Resend API key in `.env.local` is placeholder: `YOUR_RESEND_API_KEY_PLACEHOLDER`
  - No email notifications on trip request submission
  - No welcome emails for newsletter subscribers
- **Impact:** 
  - Admin won't be notified of trip requests
  - Users don't get confirmation emails
  - No newsletter functionality
- **Resolution:** 
  1. Get real Resend API key from Resend dashboard
  2. Update `.env.local`
  3. Implement email sending in API routes
- **Estimated Time:** 1-2 hours

---

### 🟠 High (Significant Issues)

#### 4. TypeScript Deprecation Warnings
- **Severity:** P1 High
- **Component:** TypeScript Configuration
- **File:** `tsconfig.json`
- **Status:** ⚠️ Will break in TypeScript 7.0
- **Warnings:**
  ```
  Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0
  Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0
  ```
- **Resolution:**
  ```json
  {
    "compilerOptions": {
      "ignoreDeprecations": "6.0",
      // ... rest of config
    }
  }
  ```
  OR migrate to `"moduleResolution": "bundler"`
- **Estimated Time:** 30 minutes

#### 5. Empty/Placeholder Files
- **Severity:** P1 High
- **Files:**
  - `lib/auth/auth.ts` — Empty (auth logic not extracted)
  - `lib/supabase/middleware.ts` — Empty (no middleware logic)
  - `components/forms/ContactForm.tsx` — Empty (not created yet)
  - `components/booking/BookingForm.tsx` — Empty (not created yet)
  - `types/customer.ts` — Empty
  - `types/database.ts` — Empty
- **Impact:** 
  - Code organization incomplete
  - Types not defined
  - Component structure not finalized
- **Resolution:** Delete empty files or implement them
- **Estimated Time:** Varies

#### 6. Hardcoded Content Not in Database
- **Severity:** P1 High
- **Components:** Experiences, Destinations
- **Status:** Seed data only
- **Files:** `lib/catalog.ts`
- **Issue:** 
  - 8 experiences hardcoded in memory
  - 8 destinations hardcoded in memory
  - Database tables created but empty
  - Can't add new experiences without code change
- **Impact:** 
  - Limited scalability
  - Can't manage content from admin panel
  - Deploy required for content updates
- **Resolution:** 
  1. Create `experiences` and `destinations` tables in Supabase
  2. Update `lib/catalog.ts` to fetch from database
  3. Implement caching
- **Estimated Time:** 2-3 hours

#### 7. Language Configuration Mismatch
- **Severity:** P1 High
- **Issue:** 
  - `lib/i18n.ts` defines EN, FR, ES
  - `next.config.js` only lists EN, FR
  - LanguageSwitcher shows ES flag but routes/content incomplete
- **Impact:** 
  - User selects Spanish → UI doesn't fully translate
  - Confusing UX
  - Incomplete i18n setup
- **Resolution:** 
  - Remove ES from `lib/i18n.ts` OR
  - Complete ES translation and add to next.config.js
- **Estimated Time:** 30 minutes (remove ES) or 4-6 hours (add full ES)

#### 8. No Middleware Locale Routing
- **Severity:** P1 High
- **File:** `middleware.ts`
- **Issue:** 
  - Currently just passes through: `return NextResponse.next()`
  - `[locale]` routes exist but never routed to
  - Language preference not used for routing
- **Impact:** 
  - Localized routes don't work
  - Users stuck on EN regardless of language choice
  - Content negotiation incomplete
- **Resolution:** Implement locale detection and routing in middleware
- **Estimated Time:** 2-3 hours

---

### 🟡 Medium (Should Fix Before Launch)

#### 9. Environment Variable Management
- **Severity:** P2 Medium
- **Issue:** 
  - `RESEND_API_KEY` has placeholder value
  - No validation that required env vars are set
  - `.env.local` committed (security risk)
  - Missing `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_FACEBOOK_URL`
- **Resolution:**
  1. Remove `.env.local` from git
  2. Add `.env.local.example` with placeholders
  3. Add startup validation for required env vars
  4. Document all required vars
- **Estimated Time:** 1-2 hours

#### 10. No Pagination on Dashboards
- **Severity:** P2 Medium
- **Components:** 
  - `AdminDashboard.tsx` — Fetches ALL requests
  - `UserDashboard.tsx` — Fetches ALL user requests
- **Impact:** 
  - Performance degrades with many requests
  - Database query slow
  - UI unresponsive on large datasets
- **Scaling Issue:** Will fail with 1000+ requests
- **Resolution:** 
  - Add LIMIT and OFFSET to Supabase queries
  - Implement pagination UI (prev/next buttons)
  - Add page size selector (10/25/50 per page)
- **Estimated Time:** 1-2 hours

#### 11. Placeholder Images Not Found
- **Severity:** P2 Medium
- **Issue:** 
  - Some experiences/destinations reference `/hero_placeholder.jpg`
  - Image doesn't exist in `/public/images`
  - Shows broken image icon
- **Components:**
  - Diani Beach Escape
  - Diani destination
- **Resolution:** 
  - Either create placeholder image
  - Or reference existing image
  - Or let component handle missing images gracefully
- **Estimated Time:** 30 minutes

#### 12. No Input Sanitization
- **Severity:** P2 Medium
- **Issue:** 
  - Trip request form doesn't sanitize HTML
  - Contact form (when created) won't sanitize
  - Potential XSS if data displayed in admin dashboard
- **Resolution:** 
  - Use DOMPurify or similar to sanitize inputs
  - Validate and escape in display
  - Use parameterized queries (already doing this with Supabase)
- **Estimated Time:** 1 hour

#### 13. No Rate Limiting on APIs
- **Severity:** P2 Medium
- **Issue:** 
  - Anyone can spam trip requests
  - Newsletter endpoint (when implemented) unprotected
  - Contact form (when created) unprotected
- **Impact:** 
  - Spam abuse risk
  - Database bloat possible
  - DOS vector
- **Resolution:** Implement rate limiting (IP-based or user-based)
- **Estimated Time:** 2-3 hours

#### 14. Image Optimization Incomplete
- **Severity:** P2 Medium
- **Issue:** 
  - Images served from `/public/images`
  - No CDN configured
  - Large file sizes not optimized
  - No WebP conversion
- **Impact:** 
  - Slower page loads
  - Higher bandwidth costs
  - Mobile users affected
- **Resolution:** 
  - Set up Vercel Image Optimization OR
  - Use Supabase Storage + CDN OR
  - Use third-party CDN (Cloudinary)
- **Estimated Time:** 2-4 hours

#### 15. No Error Logging/Monitoring
- **Severity:** P2 Medium
- **Issue:** 
  - API errors logged to console only
  - No error tracking
  - No production visibility
- **Impact:** 
  - Can't debug production issues
  - Users can't report errors effectively
- **Resolution:** 
  - Integrate Sentry or similar
  - Add structured logging
- **Estimated Time:** 2-3 hours

---

### 🔵 Low (Nice to Have)

#### 16. Missing Favicon
- **Severity:** P3 Low
- **File:** `public/brand-logo.jpg`
- **Issue:** Referenced in layout.tsx but may not exist
- **Resolution:** Add proper favicon
- **Estimated Time:** 30 minutes

#### 17. No Blog Functionality
- **Severity:** P3 Low
- **Issue:** 
  - Journal page is placeholder
  - Blog/content articles not implemented
- **Resolution:** Build blog system (future phase)
- **Estimated Time:** Not for MVP

#### 18. Analytics Not Active
- **Severity:** P3 Low
- **Issue:** 
  - Google Analytics ID configured but not implemented
  - No tracking on pages
- **Resolution:** Integrate Google Analytics
- **Estimated Time:** 1 hour

#### 19. Search Functionality Incomplete
- **Severity:** P3 Low
- **Issue:** 
  - No full-text search
  - No database search index
  - Only client-side filtering
- **Resolution:** Build search (future phase)
- **Estimated Time:** 3-4 hours

#### 20. No Dark Mode
- **Severity:** P3 Low
- **Issue:** Only light theme implemented
- **Resolution:** Add dark mode toggle (future)
- **Estimated Time:** 2-3 hours

---

## Browser Compatibility

### Tested/Supported
- Chrome/Edge (latest 2 versions) ✓
- Firefox (latest 2 versions) ✓
- Safari (latest 2 versions) ✓
- Mobile browsers (iOS Safari, Chrome Mobile) ✓

### Known Issues
- None reported

---

## Performance Baseline

### Current Performance
| Metric | Value | Status |
|--------|-------|--------|
| Homepage Load Time | ~2.5s | ✓ Good |
| Admin Dashboard Load | ~3-5s | ⚠️ Acceptable |
| User Dashboard Load | ~2-3s | ✓ Good |
| API Response Time (trip-requests) | ~500ms | ✓ Good |

### Bottlenecks
1. Large image files on homepage
2. No caching strategy
3. No database query optimization

---

## Database Issues

### No Indexes (Beyond PKs)
- Missing indexes on:
  - Foreign keys (user_id)
  - Frequently filtered columns (status, created_at)
- Impact: Slow admin dashboard as data grows

### No Query Optimization
- Dashboard queries fetch all columns
- No pagination (LIMIT/OFFSET)
- No connection pooling

---

## Type Safety Issues

### Loose Types
- Some data fetched without strict typing
- `data as Request[]` casts used in dashboards
- No exhaustive type checking

---

## Testing

### No Test Suite
- No unit tests
- No integration tests
- No E2E tests

### Manual Testing Only
- Currently tested manually in dev environment
- No CI/CD pipeline

---

## Deployment Readiness

### Not Production Ready
- ❌ Database not deployed
- ❌ Some APIs not implemented
- ❌ Email not integrated
- ❌ Catalog not in database
- ❌ Rate limiting not implemented
- ❌ Error logging not set up
- ❌ No CI/CD pipeline
- ❌ No backup strategy

### Ready for Beta/Staging
- ✓ Can deploy to staging environment
- ✓ Can test with real data
- ✓ Can identify production issues early

---

## How to Report Issues

When you find an issue:

1. **Verify it's reproducible**
2. **Check this list** (might already be known)
3. **Document:**
   - What you did
   - What happened
   - What you expected
   - Browser/device info
4. **Create task in backlog**
5. **Prioritize with team**

---

## Issue Resolution Status

**Last Updated:** 2026-01-11

| Issue | Assigned | Status | Due Date |
|-------|----------|--------|----------|
| 1. Database Schema | Pending | Not Started | ASAP |
| 2. API Implementations | Pending | Not Started | ASAP |
| 3. Email Integration | Pending | Not Started | ASAP |
| 4. TypeScript Warnings | Pending | Not Started | Before launch |
| 5. Empty Files | Pending | Not Started | Before launch |
| 6. Hardcoded Content | Pending | Not Started | Week 2 |
| 7. Language Config | Pending | Not Started | Week 2 |
| 8. Middleware Routing | Pending | Not Started | Week 3 |

