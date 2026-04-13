"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet, apiPost } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FeeSummary } from "@/components/student/fee-summary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Download,
  Plus,
  DollarSign,
  Receipt,
} from "lucide-react";

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed";
  type: string;
  description?: string;
  paidAt?: string;
  createdAt: string;
}

const mockPayments: Payment[] = [
  { id: "1", transactionId: "TXN-2025-001", amount: 2500, method: "Bank Transfer", status: "paid", type: "tuition", description: "Spring 2025 Tuition Fee", paidAt: "2025-01-10", createdAt: "2025-01-10" },
  { id: "2", transactionId: "TXN-2025-002", amount: 500, method: "Cash", status: "paid", type: "lab", description: "Lab Fee - Chemistry", paidAt: "2025-01-12", createdAt: "2025-01-12" },
  { id: "3", transactionId: "TXN-2025-003", amount: 1500, method: "Online", status: "pending", type: "tuition", description: "Spring 2025 Tuition Fee (Partial)", createdAt: "2025-01-15" },
  { id: "4", transactionId: "TXN-2025-004", amount: 200, method: "Bank Transfer", status: "paid", type: "library", description: "Library Fee", paidAt: "2025-01-08", createdAt: "2025-01-08" },
  { id: "5", transactionId: "TXN-2025-005", amount: 300, method: "Cash", status: "failed", type: "exam", description: "Exam Fee - Mid-Term", createdAt: "2025-01-14" },
];

export default function StudentFees() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const totalDue = 4500;
  const paid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0) + 3200;
  const pending = totalDue - paid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<Payment[]>("/api/payments");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setPayments(data);
        } else {
          setPayments(mockPayments);
        }
      } catch {
        setPayments(mockPayments);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePayment = () => {
    setDialogOpen(false);
    setFormAmount("");
    setFormMethod("");
    setFormDescription("");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fee Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fee payments and download receipts
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary">
              <Plus className="h-4 w-4" />
              Make Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Make a Payment</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select value={formMethod} onValueChange={setFormMethod} required>
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Payment description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary">
                  Submit Payment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fee Summary */}
      <FeeSummary totalDue={totalDue} paid={paid} pending={pending} />

      {/* Payment History */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b px-4 py-3">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Receipt className="h-4 w-4 text-primary" />
              Payment History
            </h2>
          </div>
          {loading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="text-sm">
                        {payment.paidAt || payment.createdAt}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {payment.description || payment.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.transactionId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {payment.method}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status === "paid" && (
                          <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary">
                            <Download className="h-3 w-3" />
                            Download
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
