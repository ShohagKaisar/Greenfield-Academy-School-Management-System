import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateApplicationId, generateStudentId, generateTeacherId } from '@/lib/auth';
import { success, error, unauthorized } from '@/lib/api-helper';
import { getUserFromRequest } from '@/lib/api-helper';

export async function POST(request: NextRequest) {
  try {
    // Allow seeding without auth for initial setup
    // const payload = getUserFromRequest(request);
    // if (!payload) return unauthorized();
    // if (payload.role !== 'admin') return unauthorized('Only admin can seed the database');

    // Check if data already seeded
    const existingAdmin = await db.user.findUnique({ where: { email: 'admin@greenfield.edu' } });
    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'Database already seeded' }, { status: 400 });
    }

    // ========== CREATE USERS ==========

    // 1. Admin User
    const adminPassword = await hashPassword('password123');
    const admin = await db.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@greenfield.edu',
        password: adminPassword,
        role: 'admin',
        phone: '+880-1-800000000',
        avatar: '/logo-icon.png',
      },
    });
    await db.adminProfile.create({
      data: { userId: admin.id, position: 'Super Admin' },
    });

    // 2. Teachers
    const teacherPassword = await hashPassword('password123');
    const teacher1 = await db.user.create({
      data: {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@greenfield.edu',
        password: teacherPassword,
        role: 'teacher',
        phone: '+880-1-700000001',
        gender: 'female',
        avatar: '/professor1.png',
      },
    });
    const teacher1Profile = await db.teacherProfile.create({
      data: {
        userId: teacher1.id,
        teacherId: generateTeacherId(),
        department: 'Computer Science',
        designation: 'Professor',
        qualification: 'PhD in Computer Science',
        specialization: 'Artificial Intelligence',
        salary: 120000,
        bio: 'Dr. Sarah Johnson is a leading researcher in AI with over 15 years of experience in academia and industry.',
        experience: '15+ years',
      },
    });

    const teacher2 = await db.user.create({
      data: {
        name: 'Prof. Michael Chen',
        email: 'michael.chen@greenfield.edu',
        password: teacherPassword,
        role: 'teacher',
        phone: '+880-1-700000002',
        gender: 'male',
        avatar: '/professor2.png',
      },
    });
    const teacher2Profile = await db.teacherProfile.create({
      data: {
        userId: teacher2.id,
        teacherId: generateTeacherId(),
        department: 'Mathematics',
        designation: 'Associate Professor',
        qualification: 'PhD in Applied Mathematics',
        specialization: 'Statistics & Data Science',
        salary: 100000,
        bio: 'Prof. Michael Chen specializes in mathematical modeling and statistical analysis with extensive research experience.',
        experience: '12+ years',
      },
    });

    // 3. Students
    const studentPassword = await hashPassword('password123');
    const studentsData = [
      { name: 'Ayesha Rahman', email: 'ayesha.r@student.greenfield.edu', gender: 'female', phone: '+880-1-600000001' },
      { name: 'Karim Hossain', email: 'karim.h@student.greenfield.edu', gender: 'male', phone: '+880-1-600000002' },
      { name: 'Fatima Ali', email: 'fatima.a@student.greenfield.edu', gender: 'female', phone: '+880-1-600000003' },
      { name: 'Rafiq Islam', email: 'rafiq.i@student.greenfield.edu', gender: 'male', phone: '+880-1-600000004' },
      { name: 'Nusrat Jahan', email: 'nusrat.j@student.greenfield.edu', gender: 'female', phone: '+880-1-600000005' },
    ];

    const studentProfiles = [];
    for (const s of studentsData) {
      const user = await db.user.create({
        data: {
          name: s.name,
          email: s.email,
          password: studentPassword,
          role: 'student',
          phone: s.phone,
          gender: s.gender,
          avatar: '/students-celebrating.png',
        },
      });
      const profile = await db.studentProfile.create({
        data: {
          userId: user.id,
          studentId: generateStudentId(),
          guardianName: `${s.name.split(' ')[0]}'s Parent`,
          guardianPhone: '+880-1-900000001',
          class: 'Section A',
          batch: '2025',
        },
      });
      studentProfiles.push({ user, profile });
    }

    // ========== CREATE COURSES ==========
    const coursesData = [
      {
        title: 'Introduction to Computer Science',
        code: 'CS101',
        description: 'Learn the fundamentals of computer science including algorithms, data structures, and computational thinking.',
        category: 'computer-science',
        level: 'undergraduate',
        duration: '4 months',
        fees: 25000,
        seats: 40,
        featured: true,
        image: '/classroom.png',
        teacherId: teacher1Profile.id,
      },
      {
        title: 'Advanced Mathematics',
        code: 'MATH201',
        description: 'Dive deep into calculus, linear algebra, and differential equations with practical applications.',
        category: 'mathematics',
        level: 'undergraduate',
        duration: '4 months',
        fees: 20000,
        seats: 35,
        featured: true,
        image: '/library.png',
        teacherId: teacher2Profile.id,
      },
      {
        title: 'Data Structures & Algorithms',
        code: 'CS201',
        description: 'Master essential data structures and algorithms for efficient problem solving.',
        category: 'computer-science',
        level: 'undergraduate',
        duration: '4 months',
        fees: 25000,
        seats: 35,
        featured: false,
        image: '/science-lab.png',
        teacherId: teacher1Profile.id,
      },
      {
        title: 'Statistics & Probability',
        code: 'MATH301',
        description: 'Comprehensive course on statistical methods, probability theory, and data analysis techniques.',
        category: 'mathematics',
        level: 'undergraduate',
        duration: '4 months',
        fees: 20000,
        seats: 30,
        featured: false,
        image: '/classroom.png',
        teacherId: teacher2Profile.id,
      },
      {
        title: 'Machine Learning Fundamentals',
        code: 'CS301',
        description: 'Explore the foundations of machine learning including supervised and unsupervised learning techniques.',
        category: 'computer-science',
        level: 'graduate',
        duration: '6 months',
        fees: 35000,
        seats: 25,
        featured: true,
        image: '/science-lab.png',
        teacherId: teacher1Profile.id,
      },
      {
        title: 'Business Administration',
        code: 'BA101',
        description: 'Learn principles of management, marketing, finance, and entrepreneurship.',
        category: 'business',
        level: 'undergraduate',
        duration: '4 months',
        fees: 22000,
        seats: 45,
        featured: false,
        image: '/campus-hero.png',
        teacherId: null,
      },
    ];

    const courses = [];
    for (const c of coursesData) {
      const course = await db.course.create({
        data: {
          ...c,
          slug: c.code!.toLowerCase() + '-' + Math.random().toString(36).substr(2, 6),
          startDate: new Date('2025-01-15'),
          endDate: new Date('2025-05-15'),
        },
      });
      courses.push(course);
    }

    // Enroll students in courses
    for (let i = 0; i < Math.min(3, studentProfiles.length); i++) {
      for (let j = 0; j < Math.min(3, courses.length); j++) {
        await db.enrollment.create({
          data: {
            studentId: studentProfiles[i].profile.id,
            courseId: courses[j].id,
          },
        });
      }
      await db.course.update({
        where: { id: courses[i].id },
        data: { enrolled: { increment: 3 } },
      });
    }

    // ========== CREATE ADMISSIONS ==========
    const admissionsData = [
      { studentName: 'Tanvir Ahmed', email: 'tanvir.a@email.com', phone: '+880-1-500000001', gender: 'male', courseId: courses[0].id },
      { studentName: 'Mim Akter', email: 'mim.a@email.com', phone: '+880-1-500000002', gender: 'female', courseId: courses[1].id, status: 'approved' },
      { studentName: 'Shakib Hasan', email: 'shakib.h@email.com', phone: '+880-1-500000003', gender: 'male', courseId: courses[0].id, status: 'rejected' },
    ];
    for (const a of admissionsData) {
      await db.admission.create({
        data: {
          applicationId: generateApplicationId(),
          studentName: a.studentName,
          email: a.email,
          phone: a.phone,
          gender: a.gender,
          courseId: a.courseId,
          status: a.status || 'pending',
        },
      });
    }

    // ========== CREATE NOTICES ==========
    const noticesData = [
      { title: 'Spring 2025 Semester Registration Open', content: 'Registration for Spring 2025 semester is now open. Please visit the admission office for details. Last date: January 10, 2025.', category: 'academic', priority: 'high', target: 'all' },
      { title: 'Campus Holiday Notice', content: 'The campus will remain closed on January 26, 2025 (Sunday) for maintenance. All classes and offices will resume on January 27, 2025.', category: 'general', priority: 'normal', target: 'all' },
      { title: 'Annual Sports Festival', content: 'Greenfield Annual Sports Festival will be held on February 15-16, 2025. All students are encouraged to participate. Registration forms available at the student affairs office.', category: 'event', priority: 'high', target: 'students' },
      { title: 'Faculty Development Workshop', content: 'A workshop on modern teaching methodologies will be held on January 20, 2025. All faculty members are requested to attend.', category: 'academic', priority: 'normal', target: 'teachers' },
    ];
    for (const n of noticesData) {
      await db.notice.create({ data: n });
    }

    // ========== CREATE EVENTS ==========
    const eventsData = [
      { title: 'Annual Sports Festival 2025', description: 'Two-day inter-department sports competition featuring cricket, football, badminton, and athletics.', date: '2025-02-15', endDate: '2025-02-16', location: 'Main Sports Ground', image: '/students-celebrating.png', status: 'upcoming' },
      { title: 'Science Fair 2025', description: 'Annual science fair showcasing student projects and innovations across all departments.', date: '2025-03-20', location: 'Science Building Auditorium', image: '/science-lab.png', status: 'upcoming' },
      { title: 'Cultural Night', description: 'An evening of music, drama, and cultural performances by students and faculty.', date: '2025-04-10', location: 'Central Auditorium', image: '/campus-hero.png', status: 'upcoming' },
    ];
    for (const e of eventsData) {
      await db.event.create({
        data: {
          ...e,
          date: new Date(e.date),
          endDate: e.endDate ? new Date(e.endDate) : null,
        },
      });
    }

    // ========== CREATE GALLERY ITEMS ==========
    const galleryData = [
      { title: 'Campus Main Building', caption: 'The iconic main building of Greenfield College', type: 'photo', url: '/campus-hero.png', category: 'campus', order: 1 },
      { title: 'Modern Classrooms', caption: 'State-of-the-art classrooms equipped with smart boards', type: 'photo', url: '/classroom.png', category: 'infrastructure', order: 2 },
      { title: 'Library', caption: 'Our well-stocked library with over 50,000 books', type: 'photo', url: '/library.png', category: 'infrastructure', order: 3 },
      { title: 'Science Laboratory', caption: 'Advanced science labs for hands-on learning', type: 'photo', url: '/science-lab.png', category: 'infrastructure', order: 4 },
      { title: 'Student Activities', caption: 'Students participating in co-curricular activities', type: 'photo', url: '/students-celebrating.png', category: 'activities', order: 5 },
    ];
    for (const g of galleryData) {
      await db.galleryItem.create({ data: g });
    }

    // ========== CREATE TESTIMONIALS ==========
    const testimonialsData = [
      { name: 'Ayesha Rahman', role: 'CS Student, Batch 2024', content: 'Greenfield College has been instrumental in shaping my career. The faculty here is incredibly supportive, and the hands-on learning approach helped me land my dream internship.', rating: 5, avatar: '/students-celebrating.png' },
      { name: 'Karim Hossain', role: 'Alumni, Class of 2023', content: 'The education I received at Greenfield prepared me exceptionally well for my graduate studies. The mathematics department, in particular, challenged me to think critically and solve complex problems.', rating: 5 },
      { name: 'Dr. Sarah Johnson', role: 'Professor of Computer Science', content: 'Teaching at Greenfield is a rewarding experience. The students are eager to learn, and the institution provides excellent resources for both teaching and research.', rating: 5, avatar: '/professor1.png' },
    ];
    for (const t of testimonialsData) {
      await db.testimonial.create({ data: t });
    }

    // ========== CREATE BLOG POSTS ==========
    const blogData = [
      {
        title: 'Greenfield College Launches New AI Research Center',
        slug: 'greenfield-launches-ai-research-center',
        content: 'We are thrilled to announce the opening of our new Artificial Intelligence Research Center, equipped with state-of-the-art computing resources and led by Dr. Sarah Johnson. The center will focus on cutting-edge research in machine learning, natural language processing, and computer vision. Students and faculty from all departments are welcome to collaborate on research projects.',
        excerpt: 'A new era of innovation begins with our dedicated AI research facility.',
        image: '/science-lab.png',
        category: 'news',
        tags: 'ai,research,technology',
      },
      {
        title: 'Spring 2025 Course Registration Guide',
        slug: 'spring-2025-course-registration-guide',
        content: 'Registration for the Spring 2025 semester begins January 5th. This guide covers everything you need to know about the registration process, including important deadlines, available courses, and tips for choosing the right classes. Visit the student portal or contact the academic office for assistance.',
        excerpt: 'Everything you need to know about registering for Spring 2025 courses.',
        image: '/classroom.png',
        category: 'academic',
        tags: 'registration,spring,guide',
      },
      {
        title: 'Annual Sports Festival: A Celebration of Excellence',
        slug: 'annual-sports-festival-2025',
        content: 'The Greenfield Annual Sports Festival is one of the most anticipated events of the year. This year\'s festival promises exciting competitions in cricket, football, badminton, and track & field. All students are encouraged to register and represent their departments. The event will also feature cultural performances and a grand closing ceremony.',
        excerpt: 'Get ready for two days of thrilling sports competition and camaraderie.',
        image: '/students-celebrating.png',
        category: 'events',
        tags: 'sports,festival,competition',
      },
    ];
    for (const b of blogData) {
      await db.blogPost.create({
        data: { ...b, authorId: admin.id },
      });
    }

    // ========== CREATE CLASS ROUTINES ==========
    const routineData = [
      { courseId: courses[0].id, day: 'Saturday', startTime: '09:00', endTime: '10:30', room: 'Room 101', teacherId: teacher1Profile.id },
      { courseId: courses[0].id, day: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Room 101', teacherId: teacher1Profile.id },
      { courseId: courses[1].id, day: 'Saturday', startTime: '11:00', endTime: '12:30', room: 'Room 201', teacherId: teacher2Profile.id },
      { courseId: courses[1].id, day: 'Thursday', startTime: '11:00', endTime: '12:30', room: 'Room 201', teacherId: teacher2Profile.id },
      { courseId: courses[2].id, day: 'Sunday', startTime: '09:00', endTime: '10:30', room: 'Room 102', teacherId: teacher1Profile.id },
      { courseId: courses[3].id, day: 'Sunday', startTime: '11:00', endTime: '12:30', room: 'Room 202', teacherId: teacher2Profile.id },
      { courseId: courses[4].id, day: 'Monday', startTime: '14:00', endTime: '16:00', room: 'Lab 301', teacherId: teacher1Profile.id },
      { courseId: courses[5].id, day: 'Wednesday', startTime: '09:00', endTime: '10:30', room: 'Room 301', teacherId: teacher2Profile.id },
    ];
    for (const r of routineData) {
      await db.classRoutine.create({ data: r });
    }

    // ========== CREATE ASSIGNMENTS ==========
    const assignmentsData = [
      { title: 'Binary Search Implementation', description: 'Implement binary search algorithm in your preferred language. Submit code with test cases.', courseId: courses[0].id, teacherId: teacher1Profile.id, dueDate: '2025-02-01', totalMarks: 50 },
      { title: 'Calculus Problem Set 1', description: 'Complete problems 1-20 from Chapter 3 of the textbook. Show all work clearly.', courseId: courses[1].id, teacherId: teacher2Profile.id, dueDate: '2025-02-05', totalMarks: 100 },
      { title: 'Machine Learning Project Proposal', description: 'Submit a 2-page project proposal for your final ML project. Include problem statement, dataset, and methodology.', courseId: courses[4].id, teacherId: teacher1Profile.id, dueDate: '2025-02-15', totalMarks: 30 },
    ];
    for (const a of assignmentsData) {
      await db.assignment.create({
        data: {
          ...a,
          dueDate: new Date(a.dueDate),
        },
      });
    }

    // ========== CREATE EXAMS ==========
    const exams = [];
    const examsData = [
      { name: 'CS101 Midterm Exam', courseId: courses[0].id, type: 'midterm', totalMarks: 100, date: '2025-03-01' },
      { name: 'MATH201 Midterm Exam', courseId: courses[1].id, type: 'midterm', totalMarks: 100, date: '2025-03-05' },
    ];
    for (const e of examsData) {
      const exam = await db.exam.create({
        data: {
          ...e,
          date: new Date(e.date),
          status: 'upcoming',
        },
      });
      exams.push(exam);
    }

    // ========== CREATE SOME EXAM RESULTS ==========
    for (const exam of exams) {
      for (let i = 0; i < Math.min(3, studentProfiles.length); i++) {
        const marks = 60 + Math.floor(Math.random() * 35);
        let grade = 'F';
        if (marks >= 90) grade = 'A+';
        else if (marks >= 85) grade = 'A';
        else if (marks >= 80) grade = 'A-';
        else if (marks >= 75) grade = 'B+';
        else if (marks >= 70) grade = 'B';
        else if (marks >= 65) grade = 'B-';
        else if (marks >= 60) grade = 'C+';
        else if (marks >= 55) grade = 'C';
        else if (marks >= 50) grade = 'D';

        await db.examResult.create({
          data: {
            examId: exam.id,
            courseId: exam.courseId!,
            studentId: studentProfiles[i].user.id,
            marks,
            grade,
          },
        });
      }
    }

    // ========== CREATE ATTENDANCE ==========
    const today = new Date().toISOString().split('T')[0];
    for (const course of courses.slice(0, 3)) {
      for (let i = 0; i < Math.min(3, studentProfiles.length); i++) {
        try {
          await db.attendance.create({
            data: {
              studentId: studentProfiles[i].user.id,
              courseId: course.id,
              date: today,
              status: i === 0 ? 'present' : (i === 1 ? 'present' : 'absent'),
            },
          });
        } catch {
          // Skip duplicates
        }
      }
    }

    // ========== CREATE PAYMENTS ==========
    for (let i = 0; i < 2; i++) {
      const txId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      await db.payment.create({
        data: {
          transactionId: txId,
          studentId: studentProfiles[i].user.id,
          amount: courses[i].fees!,
          method: 'manual',
          type: 'tuition',
          description: `Tuition fee for ${courses[i].title}`,
          status: 'completed',
          paidAt: new Date(),
        },
      });
    }

    // ========== CREATE SITE SETTINGS ==========
    const settingsData = [
      { key: 'siteName', value: 'Greenfield College' },
      { key: 'siteDescription', value: 'A premier institution for higher education and research' },
      { key: 'siteEmail', value: 'info@greenfield.edu' },
      { key: 'sitePhone', value: '+880-1-800000000' },
      { key: 'siteAddress', value: '123 Education Lane, Dhaka, Bangladesh' },
      { key: 'facebookUrl', value: 'https://facebook.com/greenfield' },
      { key: 'twitterUrl', value: 'https://twitter.com/greenfield' },
      { key: 'youtubeUrl', value: 'https://youtube.com/greenfield' },
      { key: 'linkedinUrl', value: 'https://linkedin.com/greenfield' },
      { key: 'currentSemester', value: 'Spring 2025' },
      { key: 'academicYear', value: '2024-2025' },
    ];
    for (const s of settingsData) {
      await db.siteSetting.create({ data: s });
    }

    return success({
      message: 'Database seeded successfully',
      stats: {
        users: 8,
        courses: 6,
        notices: 4,
        events: 3,
        galleryItems: 5,
        testimonials: 3,
        blogPosts: 3,
        routines: 8,
        assignments: 3,
        exams: 2,
        settings: 11,
      },
    });
  } catch (err: any) {
    return error(err.message || 'Failed to seed database');
  }
}
