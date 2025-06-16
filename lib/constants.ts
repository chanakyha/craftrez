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
    name: "Rez ATS Resume Template 1",
    description: "This is a template for an ATS resume.",
    images: [
      "/images/templates/rez-template-1/page-1.jpg",
      "/images/templates/rez-template-1/page-2.jpg",
    ],
    downloadLink: "/images/templates/rez-template-1/pdf-out.pdf",
  },
];

export type CreditPackage = {
  id: number;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  description: string;
  discount?: number;
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 1,
    name: "Starter",
    credits: 10,
    price: 499,
    popular: false,
    description: "Perfect for trying out our service",
    discount: 10, // 10% discount
  },
  {
    id: 2,
    name: "Popular",
    credits: 50,
    price: 1999,
    popular: true,
    description: "Most popular choice for regular users",
    discount: 20, // 20% discount
  },
  {
    id: 3,
    name: "Professional",
    credits: 100,
    price: 3499,
    popular: false,
    description: "Best value for professionals",
    discount: 30, // 30% discount
  },
];

export const CREDIT_CONVERSION_RATE = 0.69; // 69% conversion rate
