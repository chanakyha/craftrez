import { PurchaseForm } from "@/components/purchase/purchase-form";

export const metadata = {
  title: "Purchase Credits - CraftRez",
  description: "Purchase credits to generate professional resumes with AI",
};

export default function PurchasePage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Purchase Credits
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Choose a credit package that suits your needs or top up with a custom
          amount. Each credit can be used to generate a professional resume.
        </p>
      </div>
      <PurchaseForm />
    </div>
  );
}
