import {
  LayoutDashboard,
  GraduationCap,
  ClipboardList,
  BookOpen,
  Users,
  Bell,
  Calendar,
  Image,
  FileText,
  BarChart3,
  Clock,
  Timer,
  MessageSquare,
  Settings,
  FolderOpen,
  DollarSign,
  CheckSquare,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const adminNavigation: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Students", href: "/dashboard/admin/students", icon: GraduationCap },
      { title: "Admissions", href: "/dashboard/admin/admissions", icon: ClipboardList, badge: 12 },
      { title: "Courses", href: "/dashboard/admin/courses", icon: BookOpen },
      { title: "Teachers", href: "/dashboard/admin/teachers", icon: Users },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Notices", href: "/dashboard/admin/notices", icon: Bell },
      { title: "Events", href: "/dashboard/admin/events", icon: Calendar },
      { title: "Messages", href: "/dashboard/admin/messages", icon: MessageSquare, badge: 3 },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Gallery", href: "/dashboard/admin/gallery", icon: Image },
      { title: "Blog", href: "/dashboard/admin/blog", icon: FileText },
    ],
  },
  {
    label: "Academic",
    items: [
      { title: "Results", href: "/dashboard/admin/results", icon: BarChart3 },
      { title: "Attendance", href: "/dashboard/admin/attendance", icon: UserCheck },
      { title: "Routines", href: "/dashboard/admin/routines", icon: Timer },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
    ],
  },
];

export const teacherNavigation: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard },
      { title: "My Classes", href: "/dashboard/teacher/classes", icon: FolderOpen },
      { title: "Assignments", href: "/dashboard/teacher/assignments", icon: ClipboardList },
    ],
  },
  {
    label: "Academic",
    items: [
      { title: "Results", href: "/dashboard/teacher/results", icon: BarChart3 },
      { title: "Attendance", href: "/dashboard/teacher/attendance", icon: UserCheck },
      { title: "Routines", href: "/dashboard/teacher/routines", icon: Timer },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Messages", href: "/dashboard/teacher/messages", icon: MessageSquare },
      { title: "Notices", href: "/dashboard/teacher/notices", icon: Bell },
    ],
  },
];

export const studentNavigation: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
      { title: "My Courses", href: "/dashboard/student/courses", icon: BookOpen },
      { title: "Admission Status", href: "/dashboard/student/admission", icon: ClipboardList },
    ],
  },
  {
    label: "Academic",
    items: [
      { title: "Fees", href: "/dashboard/student/fees", icon: DollarSign },
      { title: "Routine", href: "/dashboard/student/routine", icon: Clock },
      { title: "Results", href: "/dashboard/student/results", icon: BarChart3 },
      { title: "Attendance", href: "/dashboard/student/attendance", icon: CheckSquare },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Messages", href: "/dashboard/student/messages", icon: MessageSquare },
      { title: "Notices", href: "/dashboard/student/notices", icon: Bell },
    ],
  },
];

export function getNavigation(role: string): NavGroup[] {
  switch (role) {
    case "admin":
      return adminNavigation;
    case "teacher":
      return teacherNavigation;
    case "student":
      return studentNavigation;
    default:
      return studentNavigation;
  }
}
