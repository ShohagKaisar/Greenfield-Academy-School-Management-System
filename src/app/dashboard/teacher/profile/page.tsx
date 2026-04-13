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
  Briefcase,
  GraduationCap,
  Pencil,
  Lock,
  Calendar,
} from "lucide-react";

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  dateOfBirth?: string;
  teacherProfile?: {
    teacherId: string;
    department?: string;
    designation?: string;
    qualification?: string;
    specialization?: string;
    experience?: string;
    bio?: string;
    joinDate?: string;
  };
}

const mockUser: TeacherProfile = {
  id: "t1",
  name: "Dr. Sarah Smith",
  email: "sarah.smith@greenfield.edu",
  phone: "+1 234 567 8900",
  address: "456 Faculty Road, Education City",
  dateOfBirth: "1985-03-22",
  teacherProfile: {
    teacherId: "TCH-042",
    department: "Mathematics",
    designation: "Associate Professor",
    qualification: "Ph.D. in Applied Mathematics",
    specialization: "Calculus & Linear Algebra",
    experience: "12 years",
    bio: "Passionate about making mathematics accessible and engaging for all students.",
    joinDate: "2018-08-15",
  },
};

export default function TeacherProfile() {
  useRequireAuth("teacher");
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<TeacherProfile>("/api/auth/me");
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

  const populateForm = (p: TeacherProfile) => {
    setName(p.name);
    setPhone(p.phone || "");
    setAddress(p.address || "");
    setQualification(p.teacherProfile?.qualification || "");
    setSpecialization(p.teacherProfile?.specialization || "");
    setBio(p.teacherProfile?.bio || "");
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
            teacherProfile: prev.teacherProfile
              ? { ...prev.teacherProfile, qualification, specialization, bio }
              : prev.teacherProfile,
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
          Manage your personal and professional information
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
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{profile?.teacherProfile?.teacherId}</Badge>
                <Badge variant="outline">{profile?.teacherProfile?.department}</Badge>
                <Badge variant="outline">{profile?.teacherProfile?.designation}</Badge>
              </div>
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
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-sm font-medium">{profile?.dateOfBirth || "Not set"}</p>
                </div>
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

        {/* Professional Info & Password */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-primary" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm font-medium">{profile?.teacherProfile?.department}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Designation</Label>
                  <p className="text-sm font-medium">{profile?.teacherProfile?.designation}</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Qualification</Label>
                  {editing ? (
                    <Input value={qualification} onChange={(e) => setQualification(e.target.value)} className="h-9" />
                  ) : (
                    <p className="text-sm font-medium">{profile?.teacherProfile?.qualification}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Experience</Label>
                  <p className="text-sm font-medium">{profile?.teacherProfile?.experience}</p>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Specialization</Label>
                  {editing ? (
                    <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="h-9" />
                  ) : (
                    <p className="text-sm font-medium">{profile?.teacherProfile?.specialization}</p>
                  )}
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Bio</Label>
                  {editing ? (
                    <Input value={bio} onChange={(e) => setBio(e.target.value)} className="h-9" />
                  ) : (
                    <p className="text-sm font-medium">{profile?.teacherProfile?.bio}</p>
                  )}
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
                    <Lock className="h-4 w-4" />
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
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
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
