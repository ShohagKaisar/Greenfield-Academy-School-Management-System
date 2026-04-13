"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardCheck,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface AdmissionData {
  id: string;
  applicationId: string;
  studentName: string;
  courseName?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  appliedDate: string;
  documents: { name: string; submitted: boolean }[];
  paymentStatus: "paid" | "unpaid" | "partial";
}

const mockAdmission: AdmissionData = {
  id: "1",
  applicationId: "ADM-2025-0847",
  studentName: "John Doe",
  courseName: "BSc Computer Science",
  status: "approved",
  appliedDate: "2025-01-05",
  documents: [
    { name: "Academic Transcript", submitted: true },
    { name: "Birth Certificate", submitted: true },
    { name: "Passport Photo", submitted: true },
    { name: "National ID", submitted: true },
    { name: "Recommendation Letter", submitted: false },
  ],
  paymentStatus: "paid",
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-700", icon: Clock },
  reviewing: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: ClipboardCheck },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

const timelineSteps = [
  { label: "Application Submitted", date: "Jan 5, 2025", completed: true },
  { label: "Documents Verified", date: "Jan 8, 2025", completed: true },
  { label: "Under Review", date: "Jan 10, 2025", completed: true },
  { label: "Payment Received", date: "Jan 12, 2025", completed: true },
  { label: "Admission Confirmed", date: "Jan 15, 2025", completed: true },
];

export default function StudentAdmission() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [admission, setAdmission] = useState<AdmissionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<AdmissionData>("/api/admissions/my");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setAdmission(data);
        } else {
          setAdmission(mockAdmission);
        }
      } catch {
        setAdmission(mockAdmission);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!admission) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admission Status</h1>
          <p className="text-sm text-muted-foreground">
            Track your admission application progress
          </p>
        </div>
        <Card className="flex flex-col items-center justify-center p-12">
          <ClipboardCheck className="h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold">No Application Found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            You haven&apos;t submitted an admission application yet.
          </p>
          <Link href="/admission">
            <Button className="mt-4 gap-2 bg-primary">
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const statusInfo = statusConfig[admission.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admission Status</h1>
        <p className="text-sm text-muted-foreground">
          Track your admission application progress
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Application Status Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Application ID</p>
                <p className="text-lg font-bold">{admission.applicationId}</p>
              </div>
              <Badge className={statusInfo.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusInfo.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Applied Date</p>
                <p className="text-sm font-medium">{admission.appliedDate}</p>
              </div>
              {admission.courseName && (
                <div>
                  <p className="text-xs text-muted-foreground">Program</p>
                  <p className="text-sm font-medium">{admission.courseName}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Applicant</p>
                <p className="text-sm font-medium">{admission.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <p className="text-sm font-medium">
                  <Badge
                    variant="secondary"
                    className={
                      admission.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }
                  >
                    {admission.paymentStatus === "paid" ? (
                      <>
                        <CreditCard className="mr-1 h-3 w-3" /> Paid
                      </>
                    ) : (
                      <>
                        <Clock className="mr-1 h-3 w-3" /> Unpaid
                      </>
                    )}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progress Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {timelineSteps.map((step, idx) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        step.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.completed ? "✓" : idx + 1}
                    </div>
                    {idx < timelineSteps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 ${
                          step.completed ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Submitted Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {admission.documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                {doc.submitted ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                )}
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.submitted ? "Submitted" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
