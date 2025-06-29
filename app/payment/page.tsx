import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import ExpireSessionButton from "./expire-session-button";
import { auth } from "@clerk/nextjs/server";

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string }>;
}) => {
  const sessionId = (await searchParams).session_id;
  let session: Stripe.Checkout.Session | null = null;
  const { userId } = await auth();
  if (!sessionId) {
    return redirect("/");
  }

  try {
    const response = await fetch("http://localhost:3000/api/fetch-session", {
      next: {
        tags: ["session"],
      },
      method: "POST",
      body: JSON.stringify({ session_id: sessionId }),
    });

    const data = await response.json();
    session = data.session;

    if (session?.metadata?.clerkId !== userId) {
      return redirect("/");
    }
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("No such checkout.session")
    ) {
      return redirect("/");
    } else {
      console.error(err);
    }
  }

  // Serialize the session object to a plain object to avoid client component serialization issues
  const serializedSession = session
    ? JSON.parse(JSON.stringify(session))
    : null;

  const formatDate = (date: number) => {
    return new Date(date * 1000).toLocaleString();
  };

  const getStatusColor = (status: string | null | undefined) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "open":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Determine if payment was successful
  const isPaymentSuccessful =
    serializedSession?.payment_status === "paid" &&
    serializedSession?.status === "complete";
  const isPaymentFailed =
    serializedSession?.payment_status &&
    serializedSession.payment_status !== "paid" &&
    serializedSession?.status === "expired";
  const isPaymentPending = serializedSession?.status === "open";

  // Get appropriate header content based on payment status
  const getHeaderContent = () => {
    if (isPaymentSuccessful) {
      return {
        title: "Payment Successful!",
        titleColor: "text-green-600",
        description:
          "Your payment has been processed successfully. Here are the session details:",
        icon: "✅",
      };
    } else if (isPaymentFailed) {
      return {
        title: "Payment Failed",
        titleColor: "text-red-600",
        description:
          "Your payment could not be processed. Here are the session details:",
        icon: "❌",
      };
    } else if (isPaymentPending) {
      return {
        title: "Payment Pending",
        titleColor: "text-blue-600",
        description:
          "Your payment is still being processed. Here are the session details:",
        icon: "⏳",
      };
    } else {
      return {
        title: "Payment Status",
        titleColor: "text-gray-600",
        description: "Here are the session details:",
        icon: "ℹ️",
      };
    }
  };

  const headerContent = getHeaderContent();

  console.log(serializedSession);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">
          {headerContent.icon}
        </div>
        <h1
          className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${headerContent.titleColor} mb-2 sm:mb-3`}
        >
          {headerContent.title}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          {headerContent.description}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Session Overview Card */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-xl">
              Session Overview
              <Badge
                className={`${getStatusColor(
                  serializedSession?.status
                )} text-xs sm:text-sm`}
              >
                {serializedSession?.status?.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Basic information about this checkout session
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Session ID:
                </span>
                <span className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded break-all">
                  {serializedSession?.id.slice(0, 8)}...
                  {serializedSession?.id.slice(-8)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Created:
                </span>
                <span className="text-xs sm:text-sm">
                  {serializedSession?.created
                    ? formatDate(serializedSession.created)
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Expires:
                </span>
                <span className="text-xs sm:text-sm">
                  {serializedSession?.expires_at
                    ? formatDate(serializedSession.expires_at)
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Mode:
                </span>
                <span className="text-xs sm:text-sm capitalize">
                  {serializedSession?.mode}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Currency:
                </span>
                <span className="text-xs sm:text-sm uppercase">
                  {serializedSession?.currency}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Customer:
                </span>
                <span className="text-xs sm:text-sm">
                  {typeof serializedSession?.customer === "string"
                    ? serializedSession?.customer
                    : "Guest"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Card */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Payment Details
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Information about the payment and line items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Amount Total:
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">
                    {serializedSession?.amount_total
                      ? formatCurrency(serializedSession.amount_total / 100)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Amount Subtotal:
                  </span>
                  <span className="text-xs sm:text-sm">
                    {serializedSession?.amount_subtotal
                      ? formatCurrency(serializedSession.amount_subtotal / 100)
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Amount Tax:
                  </span>
                  <span className="text-xs sm:text-sm">
                    {serializedSession?.total_details?.amount_tax
                      ? formatCurrency(
                          serializedSession.total_details.amount_tax / 100
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Payment Status:
                  </span>
                  <Badge
                    variant={
                      serializedSession?.payment_status === "paid"
                        ? "default"
                        : "secondary"
                    }
                    className={`text-xs sm:text-sm ${
                      serializedSession?.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : serializedSession?.payment_status === "unpaid"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {serializedSession?.payment_status?.toUpperCase() || "N/A"}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Payment Intent:
                  </span>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                    {typeof serializedSession?.payment_intent === "string"
                      ? serializedSession?.payment_intent
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            {serializedSession?.line_items && (
              <div className="mt-4 sm:mt-6">
                <h4 className="text-sm sm:text-base font-medium mb-3">
                  Line Items:
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {serializedSession?.line_items.data.map(
                    (
                      item: {
                        description?: string;
                        amount_total?: number;
                        quantity?: number;
                      },
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-muted/50 rounded-lg gap-2 sm:gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium break-words">
                            {item.description}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm font-semibold">
                            {item.amount_total
                              ? formatCurrency(item.amount_total / 100)
                              : "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details Card */}
        {serializedSession?.customer_details && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Customer Details
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Information about the customer who made this payment
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                {serializedSession.customer_details.name && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Name:
                    </span>
                    <span className="text-xs sm:text-sm break-words">
                      {serializedSession.customer_details.name}
                    </span>
                  </div>
                )}
                {serializedSession.customer_details.email && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Email:
                    </span>
                    <span className="text-xs sm:text-sm break-all">
                      {serializedSession.customer_details.email}
                    </span>
                  </div>
                )}
                {serializedSession.customer_details.phone && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Phone:
                    </span>
                    <span className="text-xs sm:text-sm">
                      {serializedSession.customer_details.phone}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-3 sm:space-y-4">
                {serializedSession.customer_details.address && (
                  <>
                    {serializedSession.customer_details.address.line1 && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Address:
                        </span>
                        <span className="text-xs sm:text-sm text-left sm:text-right break-words">
                          {serializedSession.customer_details.address.line1}
                          {serializedSession.customer_details.address.line2 && (
                            <br />
                          )}
                          {serializedSession.customer_details.address.line2}
                        </span>
                      </div>
                    )}
                    {(serializedSession.customer_details.address.city ||
                      serializedSession.customer_details.address.state ||
                      serializedSession.customer_details.address
                        .postal_code) && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          City/State/ZIP:
                        </span>
                        <span className="text-xs sm:text-sm text-left sm:text-right break-words">
                          {serializedSession.customer_details.address.city}
                          {serializedSession.customer_details.address.city &&
                            serializedSession.customer_details.address.state &&
                            ", "}
                          {serializedSession.customer_details.address.state}
                          {serializedSession.customer_details.address
                            .postal_code && (
                            <>
                              {serializedSession.customer_details.address
                                .city ||
                              serializedSession.customer_details.address.state
                                ? " "
                                : ""}
                              {
                                serializedSession.customer_details.address
                                  .postal_code
                              }
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {serializedSession.customer_details.address.country && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Country:
                        </span>
                        <span className="text-xs sm:text-sm">
                          {serializedSession.customer_details.address.country}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* URLs Card */}
        {serializedSession?.url && (
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Session URLs</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Success and cancel URLs for this session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Checkout URL:
                </span>
                <Link
                  className="hover:underline"
                  href={serializedSession?.url}
                  replace
                >
                  <p className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded mt-1 break-all">
                    {serializedSession?.url}
                  </p>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Card */}
        {serializedSession?.metadata &&
          Object.keys(serializedSession?.metadata).length > 0 && (
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Metadata</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Additional session metadata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries(serializedSession?.metadata).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2"
                      >
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                          {key}:
                        </span>
                        <span className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded break-all">
                          {value as string}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6">
          {isPaymentSuccessful ? (
            <>
              <Button
                asChild
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/">Go to Dashboard</Link>
              </Button>
              {/* <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href={serializedSession?.receipt_url || ""}>
                  Download Receipt
                </Link>
              </Button> */}
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/purchase">Make Another Purchase</Link>
              </Button>
            </>
          ) : isPaymentFailed ? (
            <>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/purchase">Go to Purchase</Link>
              </Button>
            </>
          ) : isPaymentPending ? (
            <>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href={serializedSession?.url || "/purchase"}>
                  Continue Payment
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/purchase">Go to Purchase</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/purchase">Go to Purchase</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
              >
                <Link href="/">Go Home</Link>
              </Button>
            </>
          )}
          {serializedSession?.status != "expired" &&
            serializedSession?.payment_status !== "paid" && (
              <ExpireSessionButton session_id={sessionId} />
            )}
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3"
          >
            <Link href="/transactions">All Transactions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
