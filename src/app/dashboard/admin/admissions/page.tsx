"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, MoreHorizontal, Eye, CheckCircle, XCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Admission {
  id: string;
  applicationId: string;
  studentName: string;
  course: string;
  status: string;
  appliedDate: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

const mockAdmissions: Admission[] = [
  { id: "1", applicationId: "ADM-2025-0001", studentName: "Ryan Martinez", course: "Computer Science", status: "pending", appliedDate: "2025-01-15", email: "ryan@email.com", phone: "+1 555-0101" },
  { id: "2", applicationId: "ADM-2025-0002", studentName: "Sophia Lee", course: "Business Admin", status: "approved", appliedDate: "2025-01-14", email: "sophia@email.com", phone: "+1 555-0102" },
  { id: "3", applicationId: "ADM-2025-0003", studentName: "Ethan Clark", course: "Engineering", status: "pending", appliedDate: "2025-01-14", email: "ethan@email.com", phone: "+1 555-0103" },
  { id: "4", applicationId: "ADM-2025-0004", studentName: "Olivia Brown", course: "Arts & Humanities", status: "rejected", appliedDate: "2025-01-13", email: "olivia@email.com", phone: "+1 555-0104" },
  { id: "5", applicationId: "ADM-2025-0005", studentName: "James Wilson", course: "Medicine", status: "approved", appliedDate: "2025-01-12", email: "james@email.com", phone: "+1 555-0105" },
  { id: "6", applicationId: "ADM-2025-0006", studentName: "Mia Taylor", course: "Computer Science", status: "pending", appliedDate: "2025-01-12", email: "mia@email.com", phone: "+1 555-0106" },
  { id: "7", applicationId: "ADM-2025-0007", studentName: "Lucas Garcia", course: "Science", status: "pending", appliedDate: "2025-01-11", email: "lucas@email.com", phone: "+1 555-0107" },
  { id: "8", applicationId: "ADM-2025-0008", studentName: "Ava Thomas", course: "Business Admin", status: "approved", appliedDate: "2025-01-10", email: "ava@email.com", phone: "+1 555-0108" },
];

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  useEffect(() => {
    apiFetch<Admission[]>("/api/admissions")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAdmissions(data);
        else setAdmissions(mockAdmissions);
      })
      .catch(() => setAdmissions(mockAdmissions))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus === "all"
    ? admissions
    : admissions.filter((a) => a.status === filterStatus);

  const handleAction = () => {
    if (selectedAdmission) {
      const newStatus = actionType === "approve" ? "approved" : "rejected";
      setAdmissions((prev) =>
        prev.map((a) => (a.id === selectedAdmission.id ? { ...a, status: newStatus } : a))
      );
      toast.success(`Application ${newStatus} successfully`);
      setActionOpen(false);
      setDetailOpen(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "rejected": return "destructive";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const columns: Column<Admission>[] = [
    { key: "applicationId", header: "Application ID", render: (item) => (
      <span className="font-mono text-xs">{item.applicationId}</span>
    )},
    { key: "studentName", header: "Name", render: (item) => (
      <div>
        <p className="font-medium">{item.studentName}</p>
        <p className="text-xs text-muted-foreground">{item.email}</p>
      </div>
    )},
    { key: "course", header: "Course" },
    { key: "status", header: "Status", render: (item) => (
      <Badge variant={statusColor(item.status) as any}>{item.status}</Badge>
    )},
    { key: "appliedDate", header: "Applied Date", render: (item) => new Date(item.appliedDate).toLocaleDateString() },
    { key: "actions", header: "Actions", className: "w-[120px]", render: (item) => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedAdmission(item); setDetailOpen(true); }}>
          <Eye className="h-4 w-4" />
        </Button>
        {item.status === "pending" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSelectedAdmission(item); setActionType("approve"); setActionOpen(true); }}>
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSelectedAdmission(item); setActionType("reject"); setActionOpen(true); }} className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admissions"
        description="Review and manage admission applications"
        icon={ClipboardList}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        }
      />

      <Tabs value={filterStatus} onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">All ({admissions.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({admissions.filter(a => a.status === "pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({admissions.filter(a => a.status === "approved").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({admissions.filter(a => a.status === "rejected").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchKey="studentName"
        searchPlaceholder="Search applications..."
      />

      {/* Detail Dialog */}
      <FormDialog open={detailOpen} onOpenChange={setDetailOpen} title="Application Details" size="lg">
        {selectedAdmission && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm font-medium text-muted-foreground">Application ID</p><p className="font-mono">{selectedAdmission.applicationId}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Status</p><Badge variant={statusColor(selectedAdmission.status) as any}>{selectedAdmission.status}</Badge></div>
              <div><p className="text-sm font-medium text-muted-foreground">Student Name</p><p>{selectedAdmission.studentName}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Email</p><p>{selectedAdmission.email}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Phone</p><p>{selectedAdmission.phone}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Course</p><p>{selectedAdmission.course}</p></div>
              <div className="col-span-2"><p className="text-sm font-medium text-muted-foreground">Applied Date</p><p>{new Date(selectedAdmission.appliedDate).toLocaleDateString()}</p></div>
            </div>
            {selectedAdmission.status === "pending" && (
              <div className="flex gap-2 pt-4 border-t">
                <Button className="flex-1" onClick={() => { setActionType("approve"); setActionOpen(true); }}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => { setActionType("reject"); setActionOpen(true); }}>
                  <XCircle className="mr-2 h-4 w-4" /> Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </FormDialog>

      {/* Confirm Action Dialog */}
      <AlertDialog open={actionOpen} onOpenChange={setActionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Approve Application" : "Reject Application"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} the application from{" "}
              <strong>{selectedAdmission?.studentName}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
            >
              {actionType === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
