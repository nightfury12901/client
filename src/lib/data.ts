export type Tag = 'urgent' | 'high-budget' | 'good-fit' | 'remote' | 'long-term' | 'new-client';

export interface Lead {
  id: string;
  title: string;
  client: string;
  platform: 'Upwork' | 'LinkedIn' | 'Toptal' | 'Freelancer' | 'Direct';
  posted: string;
  budget: string;
  description: string;
  fullDescription: string;
  tags: Tag[];
  score: number;
  skills: string[];
  aiInsights: string[];
  saved?: boolean;
}

export const TAG_CONFIG: Record<Tag, { label: string; cls: string }> = {
  urgent:      { label: 'Urgent',      cls: 'tag-danger'   },
  'high-budget': { label: 'High Budget', cls: 'tag-success'  },
  'good-fit':  { label: 'Good Fit',    cls: 'tag-accent'   },
  remote:      { label: 'Remote',      cls: 'tag-muted'    },
  'long-term': { label: 'Long-term',   cls: 'tag-warning'  },
  'new-client':{ label: 'New Client',  cls: 'tag-muted'    },
};

export const LEADS: Lead[] = [
  {
    id: '1',
    title: 'Senior React + Next.js Developer for SaaS Dashboard',
    client: 'TechCorp Inc.',
    platform: 'Upwork',
    posted: '2h ago',
    budget: '$3,500–$5,000',
    description: 'Looking for an experienced React developer to build a data-heavy analytics dashboard that handles real-time data from multiple sources.',
    fullDescription: `We're building the next generation analytics platform for enterprise clients and need an expert React + Next.js developer to lead our frontend.

The project involves:
- Real-time dashboard with WebSocket integration
- Complex data visualization (Recharts / D3)
- Drag-and-drop widget system
- Role-based access control UI
- Performance optimization (target: < 200ms interactions)

Requirements:
- 4+ years React experience
- TypeScript proficiency
- Experience with real-time data (WebSockets / SSE)
- Portfolio of SaaS products preferred

Timeline: 6–8 weeks for MVP, potential ongoing engagement.
Budget: $3,500–$5,000 for MVP phase.`,
    tags: ['high-budget', 'good-fit', 'long-term'],
    score: 92,
    skills: ['React', 'Next.js', 'TypeScript', 'WebSocket', 'D3.js'],
    aiInsights: [
      'High conversion likelihood — matches your skill stack 95%',
      'Client has 4.9★ Upwork rating with 38 reviews',
      'Budget is above market rate — room to negotiate upward',
      'Long-term engagement likely from job description signals',
    ],
    saved: false,
  },
  {
    id: '2',
    title: 'Urgent: Figma-to-React conversion, mobile-first',
    client: 'StartupXY',
    platform: 'Upwork',
    posted: '45m ago',
    budget: '$800–$1,200',
    description: 'We have 12 complete Figma screens for our mobile app and need pixel-perfect React implementation. Must start today.',
    fullDescription: `Urgent project — we have a hard deadline this Friday and our original developer dropped out.

What we need:
- 12 Figma screens converted to React components
- Mobile-first, responsive to tablet
- TailwindCSS (all utilities already set up)
- State management with Zustand
- Mock API calls handled with React Query

Screens include: Onboarding (3), Dashboard (2), Profile (2), Feed (3), Chat (2)

We're a funded startup, this is our MVP. Fast, reliable communication is critical.

Start this week. Estimated 20–30 hours of work.`,
    tags: ['urgent', 'remote'],
    score: 78,
    skills: ['React', 'Tailwind', 'Figma', 'Zustand', 'React Query'],
    aiInsights: [
      'Urgency flag — client needs immediate start',
      'Risk: low budget for 12-screen scope, negotiate carefully',
      'Funded startup — potential for ongoing work post-MVP',
      '20–30h estimate may be low. Budget accordingly.',
    ],
    saved: true,
  },
  {
    id: '3',
    title: 'Full-Stack Node.js + PostgreSQL API Engineer',
    client: 'FinanceApp Co.',
    platform: 'LinkedIn',
    posted: '5h ago',
    budget: '$6,000–$8,500',
    description: 'Seeking a senior backend engineer to build a robust REST API for a fintech MVP. Must have experience with financial data and compliance.',
    fullDescription: `We're a fintech startup building a personal finance tracking app. Looking for a world-class backend engineer.

Scope:
- Node.js + Express REST API
- PostgreSQL with Prisma ORM
- Auth (JWT + refresh tokens + MFA)
- Plaid integration for bank connections
- Stripe for subscriptions
- GDPR-compliant data handling
- AWS deployment (ECS + RDS)

Must haves:
- Fintech or financial data experience
- Strong TypeScript skills
- Understanding of GDPR / data privacy
- Experience scaling to 100k+ users

This is a 3-month contract, renewable. We're well-funded (Series A).`,
    tags: ['high-budget', 'long-term', 'good-fit'],
    score: 85,
    skills: ['Node.js', 'PostgreSQL', 'Prisma', 'AWS', 'Stripe', 'Plaid'],
    aiInsights: [
      'Series A funding — budget confidence is high',
      'Fintech domain adds value — premium rate justified',
      'Plaid + Stripe are strong portfolio signals',
      '3-month initial + renewable = strong LTV potential',
    ],
    saved: false,
  },
  {
    id: '4',
    title: 'Python Data Pipeline & ETL Engineer (Remote)',
    client: 'DataWorks Ltd.',
    platform: 'Freelancer',
    posted: '1d ago',
    budget: '$2,000–$3,000',
    description: 'Build and deploy automated ETL pipelines for e-commerce data. Will integrate Shopify, WooCommerce, and multiple warehouse APIs.',
    fullDescription: `DataWorks is a B2B data analytics company. We're expanding our data engineering team.

Project details:
- Python-based ETL pipelines
- Source systems: Shopify, WooCommerce, Amazon Seller
- Target: BigQuery + Snowflake
- Scheduling via Airflow
- dbt for transformations
- Data quality checks and alerting

Nice to have:
- Experience with e-commerce data modeling
- Familiarity with Prefect or Dagster

Timeline: 4–6 weeks
Remote-first, async-friendly team.`,
    tags: ['remote', 'good-fit'],
    score: 71,
    skills: ['Python', 'Airflow', 'dbt', 'BigQuery', 'Snowflake'],
    aiInsights: [
      'Good technical match for data engineering skills',
      'Async-first culture — lower coordination overhead',
      'Budget slightly below market for ETL complexity',
      'Opportunity to upsell ongoing maintenance retainer',
    ],
    saved: false,
  },
  {
    id: '5',
    title: 'UX/UI Designer for B2B SaaS Redesign (Figma)',
    client: 'GrowthOS',
    platform: 'Toptal',
    posted: '3h ago',
    budget: '$4,000–$6,000',
    description: 'Complete redesign of our growth analytics platform. Currently using a dated UI, need modern, clean, conversion-focused design system.',
    fullDescription: `GrowthOS helps marketing teams track and optimize their funnels. Our product works great but looks 2018.

What we need:
- Full audit of existing UI/UX
- New design system (components, tokens, spacing)
- Redesign of 8 core screens
- Developer handoff in Figma with variables
- Dark mode support

Our users are marketing directors and growth PMs — they care about data clarity and focus.

Inspired by: Linear, Notion, Vercel dashboard.

We're on Toptal because we want quality. Budget reflects that.`,
    tags: ['high-budget', 'good-fit', 'remote'],
    score: 88,
    skills: ['Figma', 'Design Systems', 'UX Research', 'UI Design', 'Dark Mode'],
    aiInsights: [
      'Premium client — Toptal signals quality expectations',
      'Design system work is high leverage for portfolio',
      'Linear/Notion inspiration aligns with modern aesthetic',
      'High score: client is clear on requirements + budget',
    ],
    saved: false,
  },
  {
    id: '6',
    title: 'WordPress to Next.js Migration + SEO Preservation',
    client: 'BloomMedia',
    platform: 'Direct',
    posted: '2d ago',
    budget: '$1,500–$2,200',
    description: 'Migrate a content-heavy WordPress blog (340 posts) to Next.js. Critical: SEO rankings must be preserved through migration.',
    fullDescription: `BloomMedia runs a high-traffic lifestyle blog with 340 posts and 80k monthly visitors. We're moving to Next.js for better performance.

Requirements:
- WordPress export → Next.js (MDX or headless CMS)
- All existing URLs preserved (301 redirects)
- SEO metadata migration
- Sitemap regeneration
- Core Web Vitals: must pass all green
- Design: we provide Figma, dev implements

Timeline: 3 weeks.

We're a small team — you'll work directly with the founder.`,
    tags: ['new-client', 'remote'],
    score: 65,
    skills: ['Next.js', 'WordPress', 'SEO', 'MDX', 'CMS'],
    aiInsights: [
      'Direct client — no platform fees apply',
      'SEO migration is high-risk, price accordingly',
      '80k monthly visitors = measurable impact for portfolio',
      'Moderate fit score — scope vs budget warrants review',
    ],
    saved: false,
  },
];
