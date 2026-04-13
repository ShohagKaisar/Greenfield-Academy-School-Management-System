"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save, Building2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    schoolName: "Greenfield Academy",
    tagline: "Excellence in Education Since 1965",
    address: "123 Education Lane, Academic City, AC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@greenfield.edu",
    website: "www.greenfield.edu",
    currentSession: "2024-2025",
    principalName: "Dr. Robert Anderson",
  });

  const [academicSettings, setAcademicSettings] = useState({
    currentSession: "2024-2025",
    semester: "Spring 2025",
    gradingScale: "4.0",
    attendanceRequired: "75",
    maxAbsence: "15",
  });

  const handleSaveSite = () => {
    toast.success("Site settings saved successfully!");
  };

  const handleSaveAcademic = () => {
    toast.success("Academic settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage system and school settings" icon={Settings} />

      <Tabs defaultValue="site">
        <TabsList>
          <TabsTrigger value="site">
            <Building2 className="mr-2 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="academic">
            <GraduationCap className="mr-2 h-4 w-4" /> Academic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Settings</CardTitle>
              <CardDescription>General school information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School Name</Label>
                  <Input value={siteSettings.schoolName} onChange={(e) => setSiteSettings({ ...siteSettings, schoolName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={siteSettings.tagline} onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Textarea value={siteSettings.address} onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={siteSettings.phone} onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={siteSettings.email} onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={siteSettings.website} onChange={(e) => setSiteSettings({ ...siteSettings, website: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Principal Name</Label>
                  <Input value={siteSettings.principalName} onChange={(e) => setSiteSettings({ ...siteSettings, principalName: e.target.value })} />
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <div className="space-y-0.5">
                  <Label>School Logo</Label>
                  <p className="text-xs text-muted-foreground">Recommended size: 512x512px</p>
                </div>
                <div className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground bg-muted/50">
                  Logo
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSite}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Settings</CardTitle>
              <CardDescription>Configure academic session and grading parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Academic Session</Label>
                  <Input value={academicSettings.currentSession} onChange={(e) => setAcademicSettings({ ...academicSettings, currentSession: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Current Semester</Label>
                  <Input value={academicSettings.semester} onChange={(e) => setAcademicSettings({ ...academicSettings, semester: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Grading Scale</Label>
                  <Input value={academicSettings.gradingScale} onChange={(e) => setAcademicSettings({ ...academicSettings, gradingScale: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Attendance Required (%)</Label>
                  <Input type="number" value={academicSettings.attendanceRequired} onChange={(e) => setAcademicSettings({ ...academicSettings, attendanceRequired: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Absence Allowed</Label>
                  <Input type="number" value={academicSettings.maxAbsence} onChange={(e) => setAcademicSettings({ ...academicSettings, maxAbsence: e.target.value })} />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveAcademic}><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
