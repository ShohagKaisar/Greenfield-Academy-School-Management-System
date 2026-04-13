"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth, useAuth } from "@/lib/auth-context";
import { apiGet, apiPut } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Download,
  Camera,
  Pencil,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  studentProfile?: {
    studentId: string;
    class?: string;
    section?: string;
    batch?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelation?: string;
  };
}

const mockUser: UserProfile = {
  id: "u1",
  name: "John Doe",
  email: "john.doe@greenfield.edu",
  phone: "+1 234 567 8900",
  address: "123 Academic Lane, Education City",
  dateOfBirth: "2003-05-15",
  gender: "Male",
  bloodGroup: "O+",
  studentProfile: {
    studentId: "STU-2025-042",
    class: "BSc CS",
    section: "A",
    batch: "2025",
    guardianName: "Robert Doe",
    guardianPhone: "+1 234 567 8901",
    guardianRelation: "Father",
  },
};

export default function StudentProfile() {
  useRequireAuth("student");
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<UserProfile>("/api/auth/me");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setProfile(data);
          populateForm(data);
        } else {
          setProfile(mockUser);
          populateForm(mockUser);
        }
      } catch {
        setProfile(mockUser);
        populateForm(mockUser);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const populateForm = (p: UserProfile) => {
    setName(p.name);
    setPhone(p.phone || "");
    setAddress(p.address || "");
    setDateOfBirth(p.dateOfBirth || "");
    setGuardianName(p.studentProfile?.guardianName || "");
    setGuardianPhone(p.studentProfile?.guardianPhone || "");
  };

  const handleSave = async () => {
    setEditing(false);
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            name,
            phone,
            address,
            dateOfBirth,
            studentProfile: prev.studentProfile
              ? { ...prev.studentProfile, guardianName, guardianPhone }
              : prev.studentProfile,
          }
        : prev
    );
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information
        </p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {getInitials(profile?.name || "U")}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full"
              >
                <Camera className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{profile?.studentProfile?.studentId}</Badge>
                <Badge variant="outline">{profile?.studentProfile?.class} - {profile?.studentProfile?.section}</Badge>
                <Badge variant="outline">Batch {profile?.studentProfile?.batch}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                ID Card
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Personal Information
              </CardTitle>
              {!editing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-xs text-primary"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Full Name</Label>
                {editing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
                ) : (
                  <p className="text-sm font-medium">{profile?.name}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Email</Label>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium">{profile?.email}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Phone</Label>
                {editing ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{profile?.phone || "Not set"}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                {editing ? (
                  <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="h-9" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{profile?.dateOfBirth || "Not set"}</p>
                  </div>
                )}
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">Address</Label>
                {editing ? (
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-9" />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-sm font-medium">{profile?.address || "Not set"}</p>
                  </div>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Gender</Label>
                <p className="text-sm font-medium">{profile?.gender || "Not set"}</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Blood Group</Label>
                <p className="text-sm font-medium">{profile?.bloodGroup || "Not set"}</p>
              </div>
            </div>
            {editing && (
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-primary">
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guardian Info & Password */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Guardian Name</Label>
                  {editing ? (
                    <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} className="h-9" />
                  ) : (
                    <p className="text-sm font-medium">{profile?.studentProfile?.guardianName || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Guardian Phone</Label>
                  {editing ? (
                    <Input value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} className="h-9" />
                  ) : (
                    <p className="text-sm font-medium">{profile?.studentProfile?.guardianPhone || "Not set"}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Relation</Label>
                  <p className="text-sm font-medium">{profile?.studentProfile?.guardianRelation || "Not set"}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Student ID</Label>
                  <p className="text-sm font-medium">{profile?.studentProfile?.studentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4 text-primary" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Key className="h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showPwd"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="showPwd" className="text-xs text-muted-foreground">
                        Show passwords
                      </Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="bg-primary"
                        onClick={() => {
                          setShowChangePassword(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                      >
                        Update Password
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Key(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
