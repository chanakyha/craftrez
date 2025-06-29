type Route = {
  name: string;
  href: string;
  authenticated: boolean;
};

type Template = {
  id: number;
  name: string;
  description: string;
  images: string[];
  downloadLink: string;
};

type SubscriptionPackage = {
  id: number;
  name: string;
  price: number;
  popular: boolean;
  description: string;
  discount?: number;
  billingCycle: "monthly" | "yearly";
  creditsPerMonth: number;
  benefits: string[];
  features: string[];
};

type Session = {
  id: string;
  amount_total: number;
  currency: string;
  status: string;
  created: number;
  payment_status: string;
  customer_details?: {
    email: string;
    name?: string;
  };
  line_items?: {
    data: Array<{
      description: string;
      amount_total: number;
      quantity: number;
    }>;
  };
  metadata?: {
    credits: string;
    clerkId: string;
  };
};

// Profile Types
type Education = {
  id: number;
  school_name: string;
  degree: string;
  place: string;
  start_date: Date;
  end_date: Date;
  marks?: number;
  marksOutof?: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Experience = {
  id: number;
  company_name: string;
  position: string;
  start_date: Date;
  end_date: Date;
  description?: string;
  place: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Project = {
  id: number;
  name: string;
  built_for: string;
  start_date: Date;
  end_date: Date;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Certification = {
  id: number;
  name: string;
  issuer: string;
  issue_date: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Publication = {
  id: number;
  title: string;
  author: string;
  publisher: string;
  description?: string;
  year: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Achievement = {
  id: number;
  name: string;
  position: string;
  place: string;
  issuer: string;
  date: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Responsibility = {
  id: number;
  name: string;
  position: string;
  type: string;
  date: Date;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Interest = {
  id: number;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Language = {
  id: number;
  name: string;
  proficiency: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Skills = {
  id: number;
  category: string;
  skills: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  resumeId: number;
};

type Resume = {
  id: number;
  template: {
    id: number;
    name: string;
    description: string;
    images: string[];
    downloadLink: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  templateId: number;
  ownerId: string;
};

type User = {
  clerkId: string;
  email: Array<{ email: string }> | null;
  avatar?: string | null;
  FullName?: string | null;
  username?: string | null;
  credits: number;
  educations: Education[];
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  publications: Publication[];
  achievements: Achievement[];
  responsibilities: Responsibility[];
  interests: Interest[];
  languages: Language[];
  skills: Skills[];
  resumes: Resume[];
};
