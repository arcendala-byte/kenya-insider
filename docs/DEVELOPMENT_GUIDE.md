# Kenya Insider — Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ (verify with `node --version`)
- npm 9+ or pnpm 8+
- Git
- Supabase account (free tier OK for development)
- Text editor (VS Code recommended)

### First-Time Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd kenya_insider
```

#### 2. Install Dependencies
```bash
npm install
# OR
pnpm install
```

#### 3. Environment Configuration

Create `.env.local` in project root:
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your values
# See .env.example for all options
```

**Required for development:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For API routes
NEXT_PUBLIC_WHATSAPP_NUMBER=+254780003817
```

**Optional:**
```env
RESEND_API_KEY=your-key  # Not needed for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 4. Set Up Supabase Database

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project (free tier is fine)
   - Get project URL and API keys

2. **Apply Database Schema:**
   - In Supabase dashboard → SQL Editor
   - Copy content from `supabase/schema.sql`
   - Execute the script
   - Verify all 6 tables created:
     ```sql
     \dt  -- Lists all tables
     ```

3. **Enable Row-Level Security:**
   - Verify RLS policies were created (should be in schema.sql)
   - Test with: `SELECT * FROM pg_policies;`

#### 5. Start Development Server
```bash
npm run dev
# OR
pnpm dev
```

Visit http://localhost:3000

### Development Workflow

#### Daily Development
```bash
# Start dev server (auto-hot-reload)
npm run dev

# In another terminal, watch for TypeScript errors
npm run type-check

# Or run tests (if available)
npm test
```

#### Before Committing
```bash
# Check for type errors
npm run type-check

# Check for linting issues (if eslint configured)
npm run lint

# Build to test production bundle
npm run build
```

#### Viewing Supabase Changes
- All schema changes happen in Supabase dashboard
- Use Supabase → Table Editor to inspect data
- Use SQL Editor to run queries

---

## Project Structure Deep Dive

### `/app` — Next.js App Router

```
app/
├── [locale]/           # Locale-specific routes (planned)
├── api/               # API endpoints
│   ├── trip-requests/ # ✓ Implemented
│   ├── bookings/      # Not implemented
│   ├── contact/       # Not implemented
│   ├── newsletter/    # Not implemented
│   └── reviews/       # Not implemented
├── experiences/       # Experience pages
├── destinations/      # Destination pages
├── dashboard/         # User dashboard
├── admin/            # Admin dashboard
├── sign-in/          # Authentication
├── register/         # Authentication
├── faq/              # Static pages
├── contact/          # Static pages
├── privacy-policy/   # Static pages
├── terms-and-conditions/ # Static pages
├── cancellation/     # Static pages
├── services/         # Static pages
├── layout.tsx        # Root layout
├── page.tsx          # Homepage
├── globals.css       # Global styles
└── middleware.ts     # Next.js middleware
```

### `/components` — React Components

```
components/
├── auth/             # AuthForm.tsx
├── booking/          # BookingForm, BookingModal (mostly empty)
├── dashboard/        # AdminDashboard, UserDashboard
├── destinations/     # Cards, grids
├── experiences/      # Cards, grids, filters
├── footer/           # Footer components
├── forms/            # Form components
├── navigation/       # Nav, menus
├── reviews/          # Review components
├── site/             # Site-specific components
├── ui/               # Reusable UI components
├── LanguageSwitcher.tsx
└── LocaleProvider.tsx
```

### `/lib` — Utilities & Libraries

```
lib/
├── auth/           # auth.ts (empty, planned)
├── supabase/       # Supabase client setup
│   ├── client.ts   # Browser client
│   ├── server.ts   # Server client
│   └── middleware.ts # (empty)
├── utils/          # Helper functions
├── validations/    # Form validation
├── catalog.ts      # Hardcoded experiences/destinations
└── i18n.ts         # Internationalization
```

### `/types` — TypeScript Types

```
types/
├── blog.ts        # Blog/article types
├── booking.ts     # Booking types
├── customer.ts    # (empty)
├── database.ts    # (empty)
├── destination.ts # Destination type
├── experience.ts  # Experience type
├── review.ts      # Review type
└── trip-request.ts # Trip request type
```

---

## Common Development Tasks

### Adding a New Page

#### 1. Create the page file
```typescript
// app/my-page/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description for SEO',
};

export default function MyPage() {
  return (
    <main>
      <h1>My Page</h1>
      <p>Content here</p>
    </main>
  );
}
```

#### 2. Link to it from navigation
- Edit `components/navigation/StickyNav.tsx` OR
- Edit `components/site/SiteFooter.tsx`

#### 3. Add to TypeScript paths if needed
- Check `tsconfig.json` for path aliases

### Adding a New Component

#### 1. Create component file
```typescript
// components/my-feature/MyComponent.tsx
'use client';  // If using interactivity

export default function MyComponent() {
  return <div>Component here</div>;
}
```

#### 2. Add to appropriate category folder
- `/auth` — Authentication related
- `/booking` — Booking related
- `/forms` — Form inputs
- `/ui` — Reusable UI elements
- `/site` — Site-specific features

#### 3. Export from index if needed (optional)
```typescript
// components/my-feature/index.ts
export { default as MyComponent } from './MyComponent';
```

### Implementing an API Endpoint

#### 1. Create route file
```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const body = await request.json();
    
    // 2. Validate
    if (!body.required_field) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }
    
    // 3. Get Supabase client
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 503 }
      );
    }
    
    // 4. Database operation
    const { data, error } = await supabase
      .from('table_name')
      .insert({ ...body });
    
    // 5. Handle error
    if (error) {
      return NextResponse.json(
        { error: 'Operation failed' },
        { status: 500 }
      );
    }
    
    // 6. Return success
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}
```

#### 2. Test with curl
```bash
curl -X POST http://localhost:3000/api/my-endpoint \
  -H "Content-Type: application/json" \
  -d '{"required_field": "value"}'
```

### Connecting Component to API

```typescript
// components/my-form/MyForm.tsx
'use client';

import { useState } from 'react';

export default function MyForm() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/my-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ required_field: 'value' })
      });
      
      if (!response.ok) throw new Error();
      
      setMessage('Success!');
    } catch (error) {
      setMessage('Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? 'Processing...' : 'Submit'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### Adding a Database Query

#### 1. Server Component (SSR)
```typescript
// app/my-page/page.tsx (no 'use client')
import { getSupabaseServerClient } from '@/lib/supabase/server';

export default async function MyPage() {
  const supabase = getSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .limit(10);

  if (error) {
    return <p>Error loading data</p>;
  }

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### 2. Client Component (with useEffect)
```typescript
// components/my-component/MyComponent.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    supabase
      .from('table_name')
      .select('*')
      .limit(10)
      .then(({ data }) => {
        setData(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Working with Supabase Auth

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  // Not authenticated
  router.push('/sign-in');
}

// User is authenticated
console.log(user.id, user.email);
```

#### Check Admin Role
```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

const isAdmin = profile?.role === 'admin';
```

### Styling with Tailwind

#### Class Patterns
```typescript
// Layout
className="mx-auto max-w-7xl px-5 py-16"

// Grid
className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"

// Flexbox
className="flex items-center justify-between gap-4"

// Colors (theme colors defined in tailwind.config.js)
className="bg-forestGreen text-warmIvory border-softGold"

// Responsive
className="text-sm md:text-base lg:text-lg"

// States
className="hover:bg-darkForest focus:ring-2 disabled:opacity-60"
```

#### Custom Theme Colors
Defined in `tailwind.config.js`:
- `darkForest` — Primary dark color
- `forestGreen` — Primary accent
- `warmIvory` — Light background
- `sandBeige` — Borders
- `softGold` — Highlights

---

## Debugging

### Browser DevTools
```javascript
// In browser console, access the current page:
// Trip planner state:
window.__DATA__  // If exposed (currently not)

// Manual test:
fetch('/api/trip-requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@example.com',
    arrival: '2024-12-01',
    departure: '2024-12-10',
    travelers: '2'
  })
}).then(r => r.json()).then(console.log)
```

### Server Logs
```bash
# In dev terminal where you ran `npm run dev`:
npm run dev

# Look for errors in terminal output
# POST requests appear as: POST /api/trip-requests 201
```

### Supabase Logs
1. Go to Supabase dashboard
2. → Logs → API logs
3. See all API requests and responses
4. Check error messages from database

### TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Or watch for changes
npx tsc --watch
```

---

## Testing Locally

### Test Trip Request Form
1. Go to http://localhost:3000/plan-your-trip
2. Fill in form:
   - Dates: Any valid dates
   - Travelers: "2"
   - Interests: Select at least one
   - Destinations: Select at least one
   - Name: "Test User"
   - Email: "test@example.com"
3. Submit
4. Should see success message
5. Check Supabase: Should see row in `trip_requests` table

### Test Authentication
1. Go to http://localhost:3000/register
2. Sign up with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: (min 8 chars)
3. Should create profile automatically
4. Check Supabase: Row should appear in `profiles` table with role='customer'
5. Go to /dashboard
6. Should see empty list (no trip requests yet)

### Test Admin Dashboard
1. Manually set role to 'admin' in Supabase:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE id = 'user-uuid';
   ```
2. Sign in with that account
3. Go to /admin
4. Should see trip requests table with all submissions
5. Try updating status (dropdown)
6. Should update in Supabase

---

## Build & Deployment

### Local Build
```bash
npm run build

# Check build output
ls .next/

# Start production server
npm start
```

### Environment Variables for Production
```bash
# Create .env.production
NEXT_PUBLIC_SUPABASE_URL=prod-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-key
# ... other vars
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or link existing project
vercel link
vercel deploy
```

---

## Code Quality Standards

### TypeScript
- No `any` types (use proper types)
- Strict mode enabled
- React.FC deprecated → Use function return type

### React
- Use functional components (no class components)
- Use hooks for state (useState, useEffect, etc.)
- Use 'use client' for interactive components

### Styling
- Use Tailwind classes (no inline styles)
- Responsive design (mobile-first)
- Follow theme colors from config

### Database
- Always use parameterized queries (Supabase does this)
- Never concatenate SQL strings
- Use RLS policies for security

### Error Handling
- Always catch errors in async/await
- Return meaningful error messages
- Log errors for debugging

### Naming Conventions
- **Files:** kebab-case (my-component.tsx)
- **Components:** PascalCase (MyComponent)
- **Variables:** camelCase (myVariable)
- **Constants:** UPPER_SNAKE_CASE (MY_CONSTANT)
- **Types:** PascalCase (MyType, MyInterface)

---

## Performance Optimization

### Image Optimization
- Use Next.js Image component
- Set width/height props
- Use proper srcSet sizes
- Consider WebP format

### Code Splitting
- Next.js automatically code-splits pages
- Use dynamic imports for heavy components:
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./Heavy'));
```

### Database Queries
- Only select columns you need
- Use LIMIT for large tables
- Add indexes for frequently filtered columns
- Consider caching

### Bundle Size
- Check with `npm run build`
- Remove unused dependencies
- Consider tree-shaking

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Supabase
- [Supabase Dashboard](https://app.supabase.com)
- [SQL Editor Tutorial](https://supabase.com/docs/guides/database/overview)
- [Auth Setup Guide](https://supabase.com/docs/guides/auth/overview)

### External Tools
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) — API testing
- [PgAdmin](https://www.pgadmin.org) — Database management

---

## Getting Help

### Troubleshooting Checklist
1. [ ] Check .env.local has all required variables
2. [ ] Check Supabase database has schema applied
3. [ ] Clear `.next/` folder and rebuild
4. [ ] Restart dev server
5. [ ] Check browser console for errors
6. [ ] Check terminal output for errors
7. [ ] Check Supabase logs for API errors
8. [ ] Check network tab in DevTools

### Common Issues

**"Supabase is not configured"**
- Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

**"Row-level security violation"**
- User doesn't have permission (RLS policy)
- Check user authentication status
- Check user role for admin operations

**"Cannot find module"**
- Check path is correct in imports
- Check tsconfig.json paths
- Clear .next folder and rebuild

**Images not loading**
- Check path in `/public/images`
- Check filename spelling
- Check image file exists

---

## Next Steps After Setup

1. **Apply database schema** (Critical)
2. **Implement missing APIs** (Critical)
3. **Integrate Resend email** (Critical)
4. **Fix TypeScript warnings** (High)
5. **Test all features locally** (High)
6. **Deploy to staging** (High)
7. **Get feedback from stakeholders** (High)
8. **Fix issues and iterate** (Ongoing)

