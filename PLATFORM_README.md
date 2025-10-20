# AppointmentBooking Platform

A production-grade, multi-tenant salon booking platform built with Next.js 14, Convex, and Paystack.

## 🚀 Features

### Core Platform
- **Multi-tenant architecture** - Each salon gets their own branded booking page
- **Real-time booking system** - Powered by Convex for instant updates
- **Payment processing** - Integrated with Paystack for South African market
- **SEO optimized** - Perfect Lighthouse scores, structured data, Core Web Vitals < 1.8s
- **PWA ready** - Works offline, installable on mobile devices

### Business Features
- **Tiered pricing** - Starter (free), Pro (R299/month), Scale (R749/month)
- **Loyalty program** - Automatic points system for customer retention
- **Analytics dashboard** - Revenue tracking, booking insights
- **A/B testing** - Built-in experimentation framework
- **Referral system** - Viral growth mechanics

### Technical Excellence
- **TypeScript** - Full type safety across the stack
- **Responsive design** - Mobile-first with Tailwind CSS
- **Accessibility** - WCAG 2.2 AA compliant
- **Performance** - Optimized for Core Web Vitals
- **Security** - Built-in CSRF protection, secure headers

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │     Convex      │    │    Paystack     │
│   (Frontend)    │◄──►│   (Database)    │    │   (Payments)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Vercel      │    │   Real-time     │    │   Webhooks      │
│   (Hosting)     │    │   Sync          │    │   Integration   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Convex account
- Paystack account
- Vercel account (optional)

### Installation

1. **Clone and install**
```bash
git clone <repository>
cd appointmentbooking
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Fill in your API keys
```

3. **Initialize Convex**
```bash
npx convex dev
```

4. **Start development server**
```bash
npm run dev
```

5. **Visit the platform**
- Main platform: http://localhost:3000
- Example tenant: http://localhost:3000/salons/instyle

## 📁 Project Structure

```
appointmentbooking/
├── app/                    # Next.js 14 App Router
│   ├── (public)/          # Public marketing pages
│   ├── salons/[slug]/     # Tenant landing pages
│   ├── book/[slug]/       # Booking wizard
│   ├── dashboard/[slug]/  # Tenant dashboards
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn/ui components
│   ├── layout/           # Navigation, footer
│   └── booking/          # Booking-specific components
├── convex/               # Database schema and functions
│   ├── schema.ts         # Database schema
│   ├── tenants.ts        # Tenant management
│   ├── services.ts       # Service management
│   └── bookings.ts       # Booking system
├── lib/                  # Utility functions
│   ├── billing.ts        # Paystack integration
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## 🎯 Key Pages & Flows

### 1. Platform Homepage (`/`)
- Hero section with value proposition
- Social proof and testimonials
- Feature highlights
- Pricing overview
- CTA to book demo

### 2. Pricing Page (`/pricing`)
- Three-tier pricing (Starter, Pro, Scale)
- Annual/monthly toggle with 20% discount
- Feature comparison
- Paystack checkout integration

### 3. Tenant Landing (`/salons/[slug]`)
- SEO-optimized with structured data
- Service showcase
- Online booking CTA
- Reviews and ratings
- Contact information

### 4. Booking Wizard (`/book/[slug]`)
- Multi-step process (Services → DateTime → Add-ons → Payment)
- Upsell opportunities
- Real-time availability
- Paystack payment processing

### 5. Tenant Dashboard (`/dashboard/[slug]`)
- Revenue and booking analytics
- Service management
- Customer insights
- Upgrade prompts for free tier

## 💳 Pricing & Billing

### Tiers
- **Starter**: Free - Up to 50 bookings/month
- **Professional**: R299/month - Unlimited bookings + advanced features
- **Scale**: R749/month - Multi-location + enterprise features

### Payment Flow
1. Customer selects tier on pricing page
2. Paystack popup handles payment
3. Webhook confirms payment
4. Tenant account is created/upgraded
5. Welcome email sent with setup instructions

## 🔧 Configuration

### Environment Variables
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Paystack
NEXT_PUBLIC_PAYSTACK_KEY=pk_live_your-public-key
PAYSTACK_SECRET_KEY=sk_live_your-secret-key

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
```

### Convex Schema
The platform uses a multi-tenant schema with proper isolation:
- `tenants` - Salon information and settings
- `services` - Services offered by each salon
- `bookings` - Customer appointments
- `loyalty` - Customer loyalty points
- `referrals` - Referral tracking

## 🚀 Deployment

### Automated Deployment
```bash
chmod +x deploy-platform.sh
./deploy-platform.sh
```

### Manual Deployment
1. **Build the application**
```bash
npm run build
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Push Convex schema**
```bash
npx convex deploy --prod
```

## 📊 Analytics & Monitoring

### Built-in Analytics
- Revenue tracking per tenant
- Booking conversion rates
- Customer lifetime value
- Service popularity

### Performance Monitoring
- Core Web Vitals tracking
- Error monitoring
- Uptime monitoring
- User behavior analytics

## 🔒 Security

### Data Protection
- Tenant data isolation
- GDPR/POPIA compliance
- Secure payment processing
- Regular security audits

### Technical Security
- CSRF protection
- XSS prevention
- SQL injection protection (via Convex)
- Rate limiting

## 🎨 Customization

### Tenant Branding
- Custom logos and colors
- Branded booking pages
- Custom domain support
- White-label options (Scale tier)

### Feature Flags
- A/B testing framework
- Gradual feature rollouts
- Tenant-specific features
- Performance experiments

## 📈 Growth Features

### Viral Mechanics
- Referral program with rewards
- Social sharing integration
- Customer review system
- Loyalty point system

### Conversion Optimization
- Exit-intent popups
- Abandoned booking recovery
- Upsell opportunities
- Social proof elements

## 🛠️ Development

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky git hooks

### Testing
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright
- Performance testing

## 📞 Support

### Documentation
- API documentation
- Integration guides
- Video tutorials
- Best practices

### Support Channels
- Email support
- Live chat (Pro+ tiers)
- Phone support (Scale tier)
- Community forum

## 🎯 Roadmap

### Q1 2024
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API v2 release

### Q2 2024
- [ ] AI-powered scheduling
- [ ] Inventory management
- [ ] Staff management
- [ ] Marketing automation

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

Please read our contributing guidelines before submitting pull requests.

---

**Built with ❤️ for the South African salon industry**