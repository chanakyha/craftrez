"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREDIT_PACKAGES, CREDIT_CONVERSION_RATE } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { gsap } from "gsap";
import { GiTwoCoins } from "react-icons/gi";
import { getCredits } from "@/lib/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { loadStripe } from "@stripe/stripe-js";

import { useUser } from "@clerk/nextjs";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PurchaseForm = () => {
  const [credits, setCredits] = useState<number | null>(null);
  const [topUpAmount, setTopUpAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const creditCountRef = useRef<HTMLParagraphElement>(null);
  const packageCardsRef = useRef<HTMLDivElement[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const userCredits = await getCredits();
        setCredits(userCredits ?? 0);
      } catch (error) {
        console.error("Failed to fetch credits:", error);
        setCredits(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const animateCreditUpdate = () => {
    if (creditCountRef.current) {
      gsap.to(creditCountRef.current, {
        scale: 1.2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }
  };

  // const animatePackageCard = (index: number) => {
  //   if (packageCardsRef.current[index]) {
  //     gsap.to(packageCardsRef.current[index], {
  //       scale: 0.95,
  //       duration: 0.1,
  //       yoyo: true,
  //       repeat: 1,
  //       ease: "power2.out",
  //     });
  //   }
  // };

  const handleTopUp = () => {
    const amount = parseInt(topUpAmount);
    if (!isNaN(amount) && amount > 0) {
      const convertedCredits = Math.floor(amount * CREDIT_CONVERSION_RATE);
      setCredits((prev) => (prev ?? 0) + convertedCredits);
      setTopUpAmount("");
      animateCreditUpdate();
    }
  };

  const handleCheckout = async (price: number, credits: number) => {
    const stripe = await stripePromise;

    const response = await fetch("/api/checkout-sessions/create", {
      method: "POST",
      body: JSON.stringify({
        price,
        credits,
        email: user?.emailAddresses[0].emailAddress,
      }),
    });
    const session = await response.json();
    console.log(session);
    await stripe?.redirectToCheckout({ sessionId: session.id });
  };

  // const handlePackageSelect = (price: number, index: number) => {
  //   const convertedCredits = Math.floor(price * CREDIT_CONVERSION_RATE);
  //   setCredits((prev) => (prev ?? 0) + convertedCredits);
  //   animateCreditUpdate();
  //   animatePackageCard(index);
  // };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl">Your Credit Balance</CardTitle>
          <CardDescription className="text-base">
            Manage your credits and top up when needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-muted/50 rounded-xl border">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Available Credits
                </p>
                {isLoading ? (
                  <Skeleton className="h-9 w-24" />
                ) : (
                  <p
                    ref={creditCountRef}
                    className="text-3xl font-bold tracking-tight"
                  >
                    {credits}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">
                  <GiTwoCoins className="w-6 h-6 text-yellow-500" />
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="topup" className="text-sm font-medium">
                  Top Up Credits
                </label>
                <span className="text-xs text-muted-foreground">
                  Conversion rate: {CREDIT_CONVERSION_RATE * 100}%
                </span>
              </div>
              <div className="flex gap-3">
                <Input
                  id="topup"
                  type="number"
                  placeholder="Enter amount in INR"
                  value={topUpAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTopUpAmount(e.target.value)
                  }
                  min="1"
                  className="h-11 text-base"
                />
                <Button
                  onClick={handleTopUp}
                  className="h-11 px-6 whitespace-nowrap"
                >
                  Add{" "}
                  {parseFloat(topUpAmount) * CREDIT_CONVERSION_RATE
                    ? Math.floor(
                        parseFloat(topUpAmount) * CREDIT_CONVERSION_RATE
                      ) + " credits"
                    : null}
                </Button>
              </div>
              {topUpAmount && (
                <p className="text-sm text-muted-foreground">
                  You&apos;ll receive{" "}
                  {Math.floor(parseFloat(topUpAmount) * CREDIT_CONVERSION_RATE)}{" "}
                  credits for {formatCurrency(parseFloat(topUpAmount))}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Choose a Package
          </h2>
          <p className="text-muted-foreground">
            Select a package that best suits your needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <Card
              key={pkg.id}
              ref={(el) => {
                if (el) packageCardsRef.current[index] = el;
              }}
              className={`relative transition-all duration-200 hover:shadow-lg ${
                pkg.popular ? "border-primary" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 -right-2 bg-primary">
                  Popular
                </Badge>
              )}
              <CardHeader className="space-y-1.5">
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription className="text-sm">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {formatCurrency(pkg.price)}
                    </span>
                    {pkg.discount && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(pkg.price / (1 - pkg.discount / 100))}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(pkg.price * CREDIT_CONVERSION_RATE)} credits
                    </p>
                    {pkg.discount && (
                      <p className="text-sm font-medium text-green-600">
                        Save {pkg.discount}% with this package
                      </p>
                    )}
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full h-11"
                    // onClick={() => handlePackageSelect(pkg.price, index)}
                    onClick={() =>
                      handleCheckout(
                        pkg.price,
                        Math.floor(pkg.price * CREDIT_CONVERSION_RATE)
                      )
                    }
                  >
                    Purchase Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
