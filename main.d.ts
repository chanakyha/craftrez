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
};
