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
