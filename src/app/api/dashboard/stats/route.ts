import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { success, error } from '@/lib/api-helper';

export async function GET() {
  try {
    const [
      totalStudents,
      totalTeachers,
      totalCourses,
      totalAdmissions,
      pendingAdmissions,
      totalEvents,
      upcomingEvents,
      totalNotices,
      totalPayments,
      totalRevenue,
      totalBlogPosts,
      totalGalleryItems,
      totalTestimonials,
    ] = await Promise.all([
      db.user.count({ where: { role: 'student', isActive: true } }),
      db.user.count({ where: { role: 'teacher', isActive: true } }),
      db.course.count({ where: { status: 'active' } }),
      db.admission.count(),
      db.admission.count({ where: { status: 'pending' } }),
      db.event.count(),
      db.event.count({ where: { status: 'upcoming' } }),
      db.notice.count({ where: { status: 'published' } }),
      db.payment.count(),
      db.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
      db.blogPost.count({ where: { status: 'published' } }),
      db.galleryItem.count(),
      db.testimonial.count({ where: { isActive: true } }),
    ]);

    // Recent admissions
    const recentAdmissions = await db.admission.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, applicationId: true, studentName: true, status: true, createdAt: true },
    });

    // Recent payments
    const recentPayments = await db.payment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true } },
      },
    });

    // Course enrollments distribution
    const coursesWithEnrollments = await db.course.findMany({
      select: { title: true, enrolled: true, seats: true },
      orderBy: { enrolled: 'desc' },
      take: 6,
    });

    return success({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalAdmissions,
      pendingAdmissions,
      totalEvents,
      upcomingEvents,
      totalNotices,
      totalPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalBlogPosts,
      totalGalleryItems,
      totalTestimonials,
      recentAdmissions,
      recentPayments,
      coursesWithEnrollments,
    });
  } catch (err: any) {
    return error(err.message || 'Failed to fetch dashboard stats');
  }
}
