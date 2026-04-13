"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CheckCircle, AlertCircle } from "lucide-react";

interface FeeSummaryProps {
  totalDue: number;
  paid: number;
  pending: number;
}

export function FeeSummary({ totalDue, paid, pending }: FeeSummaryProps) {
  const paidPercentage = totalDue > 0 ? Math.round((paid / totalDue) * 100) : 0;

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
          <DollarSign className="h-5 w-5" />
          Fee Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-white/15 p-3 backdrop-blur-sm">
            <p className="text-xs text-white/70">Total Due</p>
            <p className="text-xl font-bold">${totalDue.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-green-500/20 p-3 backdrop-blur-sm">
            <p className="flex items-center gap-1 text-xs text-green-100">
              <CheckCircle className="h-3 w-3" />
              Paid
            </p>
            <p className="text-xl font-bold">${paid.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-amber-500/20 p-3 backdrop-blur-sm">
            <p className="flex items-center gap-1 text-xs text-amber-100">
              <AlertCircle className="h-3 w-3" />
              Pending
            </p>
            <p className="text-xl font-bold">${pending.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Payment Progress</span>
            <span className="font-semibold">{paidPercentage}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-500"
              style={{ width: `${paidPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
