type Route = {
  name: string;
  href: string;
  authenticated: boolean;
};

type Template = {
  name: string;
  description: string;
  images: string[];
  downloadLink: string;
};

type CreditPackage = {
  id: number;
  name: string;
  price: number;
  popular: boolean;
  description: string;
  discount?: number;
};
