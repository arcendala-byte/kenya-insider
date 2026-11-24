# 🌍 Kenya Insider — Experience Kenya Like a Local

A full-stack travel, culture, and destination discovery platform connecting travelers with curated experiences, hidden gems, and bespoke trip planning across Kenya.

🔗 **Live Demo:** [kenya-insider.vercel.app](https://vercel.app) 

---

## ✨ Key Features

- **Curated Destination & Experience Discovery:** Explore Kenya's wildlife safaris, coastal getaways, cultural tours, and off-the-beaten-path experiences.
- **Custom Trip Request & Planning Engine:** Interactive trip-planning workflow with date validation, group size selection, interest tags, and honeypot + rate-limit spam protection.
- **User & Admin Dashboards:** Dedicated traveler dashboard for tracking planned adventures and an administrative dashboard for managing incoming trip requests.
- **Automated Email Notifications & WhatsApp Integration:** Server-side transactional email alerts powered by Resend alongside direct WhatsApp concierge booking support.
- **Multi-Language Support:** Built-in internationalization (`next-i18next`) for welcoming global travelers.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL, Row Level Security, Server Client)
- **Email & Messaging:** Resend API, WhatsApp Direct Integration
- **Deployment:** Vercel

---

## 📂 Project Structure

```text
kenya-insider/
├── app/
│   ├── admin/                # Admin management dashboard
│   ├── api/trip-requests/    # Rate-limited trip request & email API route
│   ├── experiences/          # Curated tours and destination listings
│   └── plan-your-trip/       # Custom itinerary request flow
├── components/
│   ├── admin/                # Admin UI components
│   ├── dashboard/            # User dashboard components
│   └── site/                 # Navigation, hero, and landing page sections
├── lib/
│   ├── server/               # Rate limiting, validation, and Resend email helpers
│   └── supabase/             # Server & client Supabase connectors
├── supabase/                 # Database schemas and migrations
└── types/                    # Shared TypeScript definitions
```

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com
cd kenya-insider
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_WHATSAPP_NUMBER=+254700000000
RESEND_FROM_EMAIL="Insider Kenya <notifications@yourdomain.com>"
RESEND_TO_EMAIL="your-email@example.com"
RESEND_API_KEY=your_resend_api_key
```

### 4. Run the development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser to view the application.

---

## 👨‍💻 Author

**Arcel Ndala**  
- Portfolio: [arcndala.co.ke](https://arcndala.co.ke)  
- LinkedIn: [://linkedin.com](https://www.://linkedin.com-a453933b8)  
- GitHub: [@arcendala-byte](https://github.com)
