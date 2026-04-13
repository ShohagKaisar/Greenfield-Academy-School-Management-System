'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Search,
  UserPlus,
  CreditCard,
  PartyPopper,
  ClipboardList,
  Loader2,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

const processSteps = [
  {
    step: 1,
    icon: <UserPlus className="w-5 h-5" />,
    title: 'Register Account',
    desc: 'Create your account with basic information to get started with the application process.',
  },
  {
    step: 2,
    icon: <ClipboardList className="w-5 h-5" />,
    title: 'Fill Application Form',
    desc: 'Complete the online application with personal, guardian, and academic details.',
  },
  {
    step: 3,
    icon: <Upload className="w-5 h-5" />,
    title: 'Upload Documents',
    desc: 'Upload required documents including transcripts, certificates, and ID proof.',
  },
  {
    step: 4,
    icon: <CreditCard className="w-5 h-5" />,
    title: 'Pay Application Fee',
    desc: 'Submit the non-refundable application processing fee through available methods.',
  },
  {
    step: 5,
    icon: <PartyPopper className="w-5 h-5" />,
    title: 'Receive Confirmation',
    desc: 'Get your application ID and confirmation email. Track your status anytime.',
  },
];

const courseOptions = [
  { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { value: 'BBA', label: 'Business Administration (BBA)' },
  { value: 'EEE', label: 'Electrical & Electronic Engineering (EEE)' },
  { value: 'English', label: 'English Literature' },
  { value: 'MLT', label: 'Medical Laboratory Technology (MLT)' },
  { value: 'Multimedia', label: 'Multimedia & Creative Design' },
];

export default function AdmissionPage() {
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState<Record<string, unknown> | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    previousSchool: '',
    previousResult: '',
    courseId: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error('Please fill in all required fields (name, email, phone)');
      return;
    }
    if (!form.previousSchool.trim() || !form.previousResult.trim()) {
      toast.error('Please provide your previous school and last exam result');
      return;
    }
    if (!form.courseId) {
      toast.error('Please select a program/course');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.name,
          email: form.email,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth || undefined,
          gender: form.gender || undefined,
          address: form.address || undefined,
          guardianName: form.guardianName || undefined,
          guardianPhone: form.guardianPhone || undefined,
          previousSchool: form.previousSchool,
          previousResult: form.previousResult,
          courseId: form.courseId,
        }),
      });
      const data = await res.json();

      if (data.applicationId || data.success) {
        toast.success(
          `Application submitted successfully! Your ID: ${data.applicationId || 'Generated'}`
        );
        setForm({
          name: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          guardianName: '',
          guardianPhone: '',
          guardianRelation: '',
          previousSchool: '',
          previousResult: '',
          courseId: '',
        });
      } else {
        toast.error(data.error || data.message || 'Failed to submit application');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async () => {
    if (!trackingId.trim()) {
      toast.error('Please enter an application ID');
      return;
    }

    setTrackingLoading(true);
    setTrackingResult(null);
    try {
      const res = await fetch('/api/admissions');
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        const found = data.data.find(
          (app: Record<string, unknown>) =>
            app.applicationId === trackingId.trim()
        );
        if (found) {
          setTrackingResult(found as Record<string, unknown>);
        } else {
          toast.error('Application not found. Please check your ID.');
        }
      } else if (Array.isArray(data)) {
        // Fallback if response is direct array
        const found = data.find(
          (app: Record<string, unknown>) =>
            app.applicationId === trackingId.trim()
        );
        if (found) {
          setTrackingResult(found as Record<string, unknown>);
        } else {
          toast.error('Application not found. Please check your ID.');
        }
      } else {
        toast.error('Application not found. Please check your ID.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    waitlisted: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                Admissions Open 2025-26
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white"
            >
              Online Admission System
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Apply online for 2025-26 academic session. Complete your application in
              just a few simple steps.
            </motion.p>
          </div>
        </section>

        {/* Admission Process Timeline */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                How It Works
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Admission Process</span>
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground text-lg mx-auto">
                Follow these simple steps to complete your application
              </p>
            </div>

            <div className="relative">
              {/* Connecting line (hidden on mobile) */}
              <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {processSteps.map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="card-hover text-center h-full border-border/50 relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="relative mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                          {item.icon}
                          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                            {item.step}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider max-w-7xl mx-auto" />

        {/* Online Admission Form */}
        <section className="py-16 lg:py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Application Form
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Apply Now</span>
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground text-lg mx-auto">
                Fill in the details below to submit your application for 2025-26 academic
                session
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit}>
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8 space-y-8">
                    {/* Section 1: Personal Information */}
                    <div>
                      <h3 className="text-lg font-bold gradient-text mb-5 flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Section 1: Personal Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="student@example.com"
                            value={form.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            Phone Number <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+880 1XXX-XXXXXX"
                            value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={form.dateOfBirth}
                            onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={form.gender}
                            onValueChange={(v) => updateForm('gender', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Full address including city and postal code"
                            rows={3}
                            value={form.address}
                            onChange={(e) => updateForm('address', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Guardian Information */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-bold gradient-text mb-5 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Section 2: Guardian Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guardianName">Guardian Name</Label>
                          <Input
                            id="guardianName"
                            placeholder="Guardian's full name"
                            value={form.guardianName}
                            onChange={(e) =>
                              updateForm('guardianName', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianPhone">Guardian Phone</Label>
                          <Input
                            id="guardianPhone"
                            type="tel"
                            placeholder="+880 1XXX-XXXXXX"
                            value={form.guardianPhone}
                            onChange={(e) =>
                              updateForm('guardianPhone', e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guardianRelation">Relationship</Label>
                          <Select
                            value={form.guardianRelation}
                            onValueChange={(v) =>
                              updateForm('guardianRelation', v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select relation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Academic Information */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-bold gradient-text mb-5 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Section 3: Academic Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="previousSchool">
                            Previous School/College{' '}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="previousSchool"
                            placeholder="Name of last institution"
                            value={form.previousSchool}
                            onChange={(e) =>
                              updateForm('previousSchool', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="previousResult">
                            Last Exam Result (GPA){' '}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="previousResult"
                            placeholder="e.g., 4.50"
                            value={form.previousResult}
                            onChange={(e) =>
                              updateForm('previousResult', e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <Label htmlFor="courseId">
                            Program / Course Selection{' '}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={form.courseId}
                            onValueChange={(v) => updateForm('courseId', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                              {courseOptions.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Documents */}
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-bold gradient-text mb-5 flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Section 4: Documents
                      </h3>
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Upload className="w-6 h-6 text-primary" />
                          </div>
                          <p className="text-sm text-foreground font-medium">
                            Drag & drop files here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mt-1.5">
                            Accepts PDF, JPG, PNG files up to 5MB each
                          </p>
                        </div>
                        <div className="mt-5 space-y-2">
                          {[
                            'Academic Transcripts / Marksheet',
                            'National ID / Birth Certificate',
                            'Passport Size Photograph',
                            'Character Certificate',
                          ].map((doc) => (
                            <div
                              key={doc}
                              className="flex items-center justify-between text-sm p-2.5 rounded-lg bg-muted/50 border border-border/50"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {doc}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-xs border-primary/20 text-primary"
                              >
                                Required
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2 text-base"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        By submitting, you agree to our terms and conditions. Application
                        fee: $25 (non-refundable).
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Application Tracking */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Track Application
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="gradient-text">Track Your Application</span>
              </h2>
              <p className="mt-4 max-w-2xl text-muted-foreground text-lg mx-auto">
                Enter your application ID to check the current status of your
                application
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-border/50 max-w-lg mx-auto">
                <CardContent className="p-6">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="trackingId" className="sr-only">
                        Application ID
                      </Label>
                      <Input
                        id="trackingId"
                        placeholder="Enter Application ID (e.g., GA-2025-0001)"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                      />
                    </div>
                    <Button onClick={handleTrack} disabled={trackingLoading}>
                      {trackingLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Check Status</span>
                    </Button>
                  </div>

                  {trackingResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-5 rounded-xl bg-muted/50 border border-border/50 space-y-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-sm">
                            Application:{' '}
                            {trackingResult.applicationId as string}
                          </h4>
                        </div>
                        <Badge
                          className={
                            statusColors[
                              (trackingResult.status as string) || ''
                            ] || 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {((trackingResult.status as string) || '')
                            .charAt(0)
                            .toUpperCase() +
                            (trackingResult.status as string || '').slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Name
                          </span>
                          <p className="font-medium">
                            {trackingResult.studentName as string}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Email
                          </span>
                          <p className="font-medium text-xs">
                            {trackingResult.email as string}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Phone
                          </span>
                          <p className="font-medium">
                            {trackingResult.phone as string}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs">
                            Applied On
                          </span>
                          <p className="font-medium">
                            {trackingResult.createdAt
                              ? new Date(
                                  trackingResult.createdAt as string
                                ).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
