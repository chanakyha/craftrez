"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  Filter,
} from "lucide-react";
import { refreshAllSessions } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TransactionsClientProps {
  initialSessions: Session[];
}

const TransactionsClient = ({ initialSessions }: TransactionsClientProps) => {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filteredSessions, setFilteredSessions] =
    useState<Session[]>(initialSessions);
  const [statusFilters, setStatusFilters] = useState<string[]>([
    "complete",
    "open",
  ]);

  useEffect(() => {
    setSessions(initialSessions);
  }, [initialSessions]);

  useEffect(() => {
    // Ensure sessions is always an array before filtering
    const safeSessions = Array.isArray(sessions) ? sessions : [];

    if (statusFilters.length === 0) {
      setFilteredSessions(safeSessions);
    } else {
      setFilteredSessions(
        safeSessions.filter((session) => statusFilters.includes(session.status))
      );
    }
  }, [statusFilters, sessions]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "complete":
        return "default";
      case "open":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4" />;
      case "expired":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const statusOptions = [
    { value: "complete", label: "Complete" },
    { value: "open", label: "Open" },
    { value: "expired", label: "Expired" },
  ];

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters((prev) => [...prev, status]);
    } else {
      setStatusFilters((prev) => prev.filter((filter) => filter !== status));
    }
  };

  const handleSelectAll = () => {
    setStatusFilters(statusOptions.map((option) => option.value));
  };

  const handleClearAll = () => {
    setStatusFilters([]);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshAllSessions();
    } catch (error) {
      console.error("Error refreshing sessions:", error);
    } finally {
      toast.success("Sessions refreshed successfully");
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage your payment history
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Total:{" "}
              {Array.isArray(filteredSessions) ? filteredSessions.length : 0}{" "}
              transaction
              {Array.isArray(filteredSessions) && filteredSessions.length !== 1
                ? "s"
                : ""}
            </div>

            <Button size={"icon"} variant="outline" onClick={handleRefresh}>
              <RefreshCcw
                className={cn("w-4 h-4", isRefreshing && "animate-spin")}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger className="relative">
                {statusFilters.length > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center"
                    variant="outline"
                  >
                    {statusFilters.length}
                  </Badge>
                )}
                <Button
                  size={"icon"}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={statusFilters.length === statusOptions.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleSelectAll();
                    } else {
                      handleClearAll();
                    }
                  }}
                >
                  Select All
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {statusOptions.map((option) => (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={statusFilters.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleStatusFilterChange(option.value, checked)
                    }
                  >
                    {option.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {!Array.isArray(filteredSessions) || filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No transactions found
                </h3>
                <p className="text-muted-foreground text-center">
                  {statusFilters.length === 0
                    ? "You haven't made any transactions yet."
                    : `No transactions found for the selected statuses.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session) => (
              <Link
                key={session.id}
                href={`/payment?session_id=${session.id}`}
                className="hover:shadow-md dark:hover:inset-shadow-xl dark:hover:inset-shadow-stone-900 transition-shadow flex flex-col gap-4"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {session.line_items?.data?.[0]?.description ||
                                "Payment"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {session.id.slice(0, 6)}...
                              {session.id.slice(-4)}
                            </p>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(session.status)}
                            className="flex items-center gap-1"
                          >
                            {getStatusIcon(session.status)}
                            {session.status.charAt(0).toUpperCase() +
                              session.status.slice(1)}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(session.created)}
                          </div>

                          {session.customer_details?.name && (
                            <div className="flex items-center gap-1">
                              <span>
                                Customer: {session.customer_details.name}
                              </span>
                            </div>
                          )}

                          {session.line_items?.data?.[0]?.quantity && (
                            <div className="flex items-center gap-1">
                              <span>
                                Quantity: {session.line_items.data[0].quantity}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1 text-lg font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {formatAmount(session.amount_total, session.currency)}
                        </div>

                        {session.payment_status && (
                          <Badge variant="outline" className="text-xs">
                            Payment: {session.payment_status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsClient;
