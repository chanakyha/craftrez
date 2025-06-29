export const routes: Route[] = [
  {
    name: "Home",
    href: "/",
    authenticated: false,
  },
  {
    name: "Resumes",
    href: "/resumes",
    authenticated: true,
  },
  {
    name: "About",
    href: "/about",
    authenticated: false,
  },
  {
    name: "Contact",
    href: "/contact",
    authenticated: false,
  },
];

export const templates: Template[] = [
  {
    id: 7999,
    name: "Rez ATS Resume Template 1",
    description: "This is a template for an ATS resume.",
    images: [
      "/images/templates/rez-template-1/page-1.jpg",
      "/images/templates/rez-template-1/page-2.jpg",
    ],
    downloadLink: "/images/templates/rez-template-1/pdf-out.pdf",
  },
];

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 1,
    name: "Starter",
    price: 299,
    popular: false,
    description: "Perfect for students and job seekers",
    billingCycle: "monthly",
    creditsPerMonth: 300,
    benefits: [
      "300 credits per month",
      "Basic resume templates",
      "Standard ATS optimization",
      "Email support",
    ],
    features: [
      "Unlimited resume downloads",
      "Basic customization options",
      "Standard formatting",
      "Mobile-friendly design",
    ],
  },
  {
    id: 2,
    name: "Professional",
    price: 799,
    popular: true,
    description: "Ideal for professionals and career changers",
    discount: 8.25,
    billingCycle: "monthly",
    creditsPerMonth: 600,
    benefits: [
      "600 credits per month",
      "Premium resume templates",
      "Advanced ATS optimization",
      "Priority email support",
      "Cover letter builder",
    ],
    features: [
      "All Starter features",
      "Premium template library",
      "Advanced customization",
      "Industry-specific optimization",
      "Multiple format exports",
      "Resume analytics",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 1499,
    popular: false,
    description: "For recruiters and HR professionals",
    discount: 35.37,
    billingCycle: "monthly",
    creditsPerMonth: 1600,
    benefits: [
      "1600 credits per month",
      "All premium templates",
      "AI-powered optimization",
      "24/7 priority support",
      "Team collaboration tools",
      "Bulk processing",
    ],
    features: [
      "All Professional features",
      "AI resume analysis",
      "Team management dashboard",
      "Custom branding options",
      "API access",
      "White-label solutions",
      "Advanced analytics",
    ],
  },
];

export const CREDIT_CONVERSION_RATE = 0.69; // 69% conversion rate
