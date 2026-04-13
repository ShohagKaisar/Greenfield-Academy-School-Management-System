import { db } from '../src/lib/db';

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await db.admission.deleteMany();
  await db.enrollment.deleteMany();
  await db.examResult.deleteMany();
  await db.attendance.deleteMany();
  await db.classRoutine.deleteMany();
  await db.assignment.deleteMany();
  await db.exam.deleteMany();
  await db.payment.deleteMany();
  await db.message.deleteMany();
  await db.notification.deleteMany();
  await db.blogPost.deleteMany();
  await db.contactMessage.deleteMany();
  await db.galleryItem.deleteMany();
  await db.testimonial.deleteMany();
  await db.event.deleteMany();
  await db.notice.deleteMany();
  await db.course.deleteMany();
  await db.adminProfile.deleteMany();
  await db.teacherProfile.deleteMany();
  await db.studentProfile.deleteMany();
  await db.user.deleteMany();
  await db.siteSetting.deleteMany();

  // Create teachers
  const teachersData = [
    {
      email: 'dr.johnson@greenfield.edu', password: 'placeholder', name: 'Dr. Robert Johnson',
      phone: '+1-555-0101', role: 'teacher',
      profile: { teacherId: 'TCH001', department: 'Science', designation: 'Professor & HOD',
        qualification: 'Ph.D. in Physics, MIT', specialization: 'Quantum Mechanics, Astrophysics',
        bio: 'Dr. Johnson has over 20 years of teaching experience and has published more than 50 research papers in top-tier journals. He leads the Science department and mentors students in advanced physics research.',
        experience: '20 years' },
    },
    {
      email: 'dr.smith@greenfield.edu', password: 'placeholder', name: 'Dr. Sarah Smith',
      phone: '+1-555-0102', role: 'teacher',
      profile: { teacherId: 'TCH002', department: 'Mathematics', designation: 'Associate Professor',
        qualification: 'Ph.D. in Applied Mathematics, Stanford', specialization: 'Statistics, Data Science, Machine Learning',
        bio: 'Dr. Smith is a renowned mathematician with expertise in data science. She has received multiple teaching awards and actively contributes to curriculum development.',
        experience: '15 years' },
    },
    {
      email: 'prof.williams@greenfield.edu', password: 'placeholder', name: 'Prof. Emily Williams',
      phone: '+1-555-0103', role: 'teacher',
      profile: { teacherId: 'TCH003', department: 'Arts', designation: 'Associate Professor',
        qualification: 'MFA in Creative Writing, Yale', specialization: 'Literature, Creative Writing, Drama',
        bio: 'Prof. Williams is an accomplished author and playwright. Her novels have won multiple literary awards. She brings passion for storytelling to her teaching.',
        experience: '12 years' },
    },
    {
      email: 'dr.brown@greenfield.edu', password: 'placeholder', name: 'Dr. Michael Brown',
      phone: '+1-555-0104', role: 'teacher',
      profile: { teacherId: 'TCH004', department: 'Commerce', designation: 'Professor',
        qualification: 'Ph.D. in Economics, Harvard', specialization: 'Macroeconomics, Financial Markets, Business Strategy',
        bio: 'Dr. Brown previously worked as a senior economist at the World Bank before transitioning to academia. His real-world experience enriches the commerce curriculum.',
        experience: '18 years' },
    },
    {
      email: 'prof.davis@greenfield.edu', password: 'placeholder', name: 'Prof. Lisa Davis',
      phone: '+1-555-0105', role: 'teacher',
      profile: { teacherId: 'TCH005', department: 'Science', designation: 'Assistant Professor',
        qualification: 'M.S. in Computer Science, Carnegie Mellon', specialization: 'Artificial Intelligence, Web Development, Cybersecurity',
        bio: 'Prof. Davis is a tech industry veteran who has worked at Google and Microsoft. She teaches cutting-edge computer science courses and leads the coding club.',
        experience: '10 years' },
    },
    {
      email: 'prof.martinez@greenfield.edu', password: 'placeholder', name: 'Prof. Carlos Martinez',
      phone: '+1-555-0106', role: 'teacher',
      profile: { teacherId: 'TCH006', department: 'Vocational', designation: 'Senior Lecturer',
        qualification: 'MBA, Industry Certified PMP', specialization: 'Project Management, Entrepreneurship, Digital Marketing',
        bio: 'Prof. Martinez brings 15 years of corporate experience to the classroom. He has founded two successful startups and mentors aspiring entrepreneurs.',
        experience: '15 years' },
    },
  ];

  const teacherProfiles: { id: string; department: string }[] = [];

  for (const t of teachersData) {
    const user = await db.user.create({
      data: {
        email: t.email, password: t.password, name: t.name, phone: t.phone, role: t.role,
        teacherProfile: { create: t.profile },
      },
      include: { teacherProfile: true },
    });
    if (user.teacherProfile) {
      teacherProfiles.push({ id: user.teacherProfile.id, department: t.profile.department });
    }
  }

  // Create courses
  const courses = [
    { title: 'B.Sc. Physics (Hons)', slug: 'bsc-physics-honors', code: 'PHY-101',
      description: 'A comprehensive undergraduate program in Physics covering classical mechanics, quantum physics, thermodynamics, electromagnetism, and modern physics. Students gain hands-on experience through advanced laboratory work and research projects.',
      category: 'science', level: 'undergraduate', duration: '4 Years', fees: 25000, seats: 60, enrolled: 42, featured: true,
      syllabus: 'Year 1: Classical Mechanics, Mathematical Physics, Optics\nYear 2: Thermodynamics, Electromagnetism, Quantum Mechanics\nYear 3: Nuclear Physics, Solid State Physics, Electronics\nYear 4: Astrophysics, Research Project, Advanced Labs',
      requirements: 'Minimum 60% in 10+2 with Physics and Mathematics. Entrance exam required.',
      image: '/science-lab.png', teacherId: teacherProfiles[0].id },
    { title: 'B.Sc. Computer Science', slug: 'bsc-computer-science', code: 'CS-101',
      description: 'A cutting-edge program covering programming, data structures, algorithms, artificial intelligence, machine learning, and software engineering. Prepares students for careers in technology and innovation.',
      category: 'science', level: 'undergraduate', duration: '4 Years', fees: 30000, seats: 80, enrolled: 65, featured: true,
      syllabus: 'Year 1: Programming Fundamentals, Mathematics, Digital Logic\nYear 2: Data Structures, Algorithms, Database Systems\nYear 3: Web Development, AI/ML, Computer Networks\nYear 4: Software Engineering, Capstone Project, Internship',
      requirements: 'Minimum 60% in 10+2 with Mathematics. Aptitude test required.',
      image: '/classroom.png', teacherId: teacherProfiles[4].id },
    { title: 'B.A. English Literature', slug: 'ba-english-literature', code: 'ENG-101',
      description: 'Explore the rich world of English literature from Shakespeare to contemporary works. Develop critical thinking, analytical writing, and communication skills essential for diverse career paths.',
      category: 'arts', level: 'undergraduate', duration: '3 Years', fees: 18000, seats: 50, enrolled: 35, featured: true,
      syllabus: 'Year 1: Introduction to Literature, Poetry, Drama\nYear 2: Novel Studies, Literary Criticism, American Literature\nYear 3: Postcolonial Literature, Creative Writing, Thesis',
      requirements: 'Minimum 50% in 10+2 with English. Personal interview required.',
      image: '/library.png', teacherId: teacherProfiles[2].id },
    { title: 'B.Com (Hons) Accounting & Finance', slug: 'bcom-accounting-finance', code: 'COM-101',
      description: 'A rigorous program in accounting, financial management, taxation, and business law. Prepares students for professional certifications like CA, CMA, and ACCA.',
      category: 'commerce', level: 'undergraduate', duration: '3 Years', fees: 22000, seats: 70, enrolled: 58, featured: true,
      syllabus: 'Year 1: Financial Accounting, Business Economics, Business Law\nYear 2: Cost Accounting, Taxation, Auditing\nYear 3: Management Accounting, Financial Management, Corporate Finance',
      requirements: 'Minimum 55% in 10+2 with Commerce or Science. Math background preferred.',
      image: '/classroom.png', teacherId: teacherProfiles[3].id },
    { title: 'B.Sc. Mathematics', slug: 'bsc-mathematics', code: 'MTH-101',
      description: 'A program designed for students passionate about mathematical reasoning, problem-solving, and analytical thinking. Covers pure and applied mathematics with research opportunities.',
      category: 'science', level: 'undergraduate', duration: '3 Years', fees: 20000, seats: 45, enrolled: 30, featured: false,
      syllabus: 'Year 1: Calculus, Linear Algebra, Real Analysis\nYear 2: Abstract Algebra, Differential Equations, Probability\nYear 3: Complex Analysis, Topology, Numerical Methods',
      requirements: 'Minimum 65% in 10+2 with Mathematics. Entrance exam required.',
      image: '/science-lab.png', teacherId: teacherProfiles[1].id },
    { title: 'Diploma in Digital Marketing', slug: 'diploma-digital-marketing', code: 'DM-101',
      description: 'A practical program covering SEO, SEM, social media marketing, content strategy, email marketing, and analytics. Ideal for aspiring digital marketers and entrepreneurs.',
      category: 'vocational', level: 'diploma', duration: '1 Year', fees: 15000, seats: 40, enrolled: 28, featured: true,
      syllabus: 'Semester 1: Marketing Fundamentals, SEO/SEM, Social Media Marketing\nSemester 2: Content Strategy, Email Marketing, Google Analytics, Capstone Project',
      requirements: 'Minimum 10+2 pass. No specific stream required.',
      image: '/students-celebrating.png', teacherId: teacherProfiles[5].id },
    { title: 'B.A. History & Political Science', slug: 'ba-history-political-science', code: 'HPS-101',
      description: 'A dual-discipline program exploring historical events, political systems, governance, and international relations. Develops analytical and research skills for careers in civil services, law, and academia.',
      category: 'arts', level: 'undergraduate', duration: '3 Years', fees: 16000, seats: 50, enrolled: 38, featured: false,
      syllabus: 'Year 1: World History, Indian History, Political Theory\nYear 2: Modern History, Comparative Politics, International Relations\nYear 3: Public Administration, Research Methodology, Thesis',
      requirements: 'Minimum 50% in 10+2. Personal interview may be required.',
      image: '/library.png', teacherId: teacherProfiles[2].id },
    { title: 'Diploma in Business Management', slug: 'diploma-business-management', code: 'DBM-101',
      description: 'A comprehensive program covering business fundamentals, management principles, marketing, HR, and entrepreneurship. Provides practical skills for immediate employment or starting a business.',
      category: 'vocational', level: 'diploma', duration: '2 Years', fees: 20000, seats: 50, enrolled: 40, featured: false,
      syllabus: 'Year 1: Business Fundamentals, Marketing, Accounting, Communication\nYear 2: HR Management, Operations, Entrepreneurship, Internship',
      requirements: 'Minimum 10+2 pass from any stream.',
      image: '/classroom.png', teacherId: teacherProfiles[5].id },
    { title: 'B.Sc. Chemistry (Hons)', slug: 'bsc-chemistry-honors', code: 'CHM-101',
      description: 'An in-depth study of organic, inorganic, physical, and analytical chemistry with extensive laboratory training. Prepares students for careers in research, pharmaceuticals, and chemical industries.',
      category: 'science', level: 'undergraduate', duration: '4 Years', fees: 25000, seats: 50, enrolled: 36, featured: false,
      syllabus: 'Year 1: General Chemistry, Organic Chemistry, Inorganic Chemistry\nYear 2: Physical Chemistry, Analytical Chemistry, Biochemistry\nYear 3: Advanced Organic, Spectroscopy, Industrial Chemistry\nYear 4: Research Project, Advanced Labs, Electives',
      requirements: 'Minimum 60% in 10+2 with Chemistry. Entrance exam required.',
      image: '/science-lab.png', teacherId: teacherProfiles[0].id },
  ];

  for (const course of courses) {
    await db.course.create({ data: course });
  }

  // Create events
  const events = [
    { title: 'Annual Science Exhibition 2025', description: 'Showcasing innovative projects and experiments by our science students. Features robotics demonstrations, chemistry experiments, and physics models. Open to all students and parents.', date: new Date('2025-08-15T10:00:00'), endDate: new Date('2025-08-15T16:00:00'), location: 'Main Auditorium & Science Block', image: '/science-lab.png', status: 'upcoming' },
    { title: 'Inter-College Cultural Festival - "Prism 2025"', description: 'A three-day cultural extravaganza featuring music, dance, drama, art exhibitions, and literary competitions. Participants from over 20 colleges compete for the championship trophy.', date: new Date('2025-09-20T09:00:00'), endDate: new Date('2025-09-22T21:00:00'), location: 'Campus Grounds & Auditorium', image: '/students-celebrating.png', status: 'upcoming' },
    { title: 'Guest Lecture: Future of AI in Education', description: 'An exclusive talk by Dr. James Chen, AI Research Director at Google DeepMind, discussing how artificial intelligence is transforming education.', date: new Date('2025-07-28T14:00:00'), endDate: new Date('2025-07-28T16:00:00'), location: 'Seminar Hall A', image: '/classroom.png', status: 'upcoming' },
    { title: 'Sports Week 2025', description: 'Annual sports week featuring cricket, football, basketball, athletics, badminton, and table tennis competitions. House teams compete for the Sports Championship Trophy.', date: new Date('2025-10-05T08:00:00'), endDate: new Date('2025-10-10T18:00:00'), location: 'Sports Complex & Grounds', image: '/students-celebrating.png', status: 'upcoming' },
    { title: 'Career Fair 2025', description: 'Over 50 top companies visit campus for recruitment. Students can participate in on-the-spot interviews, networking sessions, and career counseling workshops.', date: new Date('2025-11-15T09:00:00'), endDate: new Date('2025-11-15T17:00:00'), location: 'Convention Center', image: '/students-celebrating.png', status: 'upcoming' },
    { title: 'Annual Convocation Ceremony 2025', description: 'Graduating ceremony for the Class of 2025. Chief Guest: Honorable Governor. Awards for academic excellence, sports, and extracurricular achievements.', date: new Date('2025-03-20T10:00:00'), endDate: new Date('2025-03-20T15:00:00'), location: 'Main Auditorium', image: '/hero-campus.png', status: 'past' },
    { title: 'National Mathematics Olympiad - Regional Round', description: 'Greenfield Academy hosted the regional round of the National Mathematics Olympiad with participation from 200+ students across the region.', date: new Date('2025-02-10T09:00:00'), endDate: new Date('2025-02-10T14:00:00'), location: 'Mathematics Block', image: '/classroom.png', status: 'past' },
    { title: 'Workshop: Web Development Bootcamp', description: 'A 3-day intensive bootcamp covering HTML, CSS, JavaScript, React, and Node.js. Students built and deployed their own web applications by the end of the workshop.', date: new Date('2025-01-15T09:00:00'), endDate: new Date('2025-01-17T17:00:00'), location: 'Computer Lab 1 & 2', image: '/classroom.png', status: 'past' },
  ];

  for (const event of events) {
    await db.event.create({ data: event });
  }

  // Create blog posts
  const blogPosts = [
    { title: 'Why STEM Education is the Key to Future Innovation', slug: 'why-stem-education-key-future-innovation',
      content: 'STEM education has become more critical than ever in preparing students for the challenges of the 21st century. At Greenfield Academy, we believe that a strong foundation in Science, Technology, Engineering, and Mathematics is essential for fostering innovation and problem-solving skills.\n\nOur approach to STEM education goes beyond textbook learning. Students engage in hands-on experiments, collaborative projects, and real-world problem solving that prepares them for careers in cutting-edge fields.\n\n## The Greenfield Difference\n\nWhat sets our STEM program apart is the integration of interdisciplinary learning. Our physics students work with computer science majors to build simulation software, while chemistry students collaborate with engineering teams on sustainable materials research.\n\n## Industry Partnerships\n\nWe have established partnerships with leading technology companies and research institutions, providing students with internship opportunities, guest lectures from industry experts, and access to state-of-the-art laboratory equipment.\n\n## Results That Speak\n\nOur STEM graduates have achieved a 95% placement rate, with many going on to pursue advanced degrees at top universities worldwide.',
      excerpt: 'Discover how Greenfield Academy\'s innovative STEM programs prepare students for careers in science, technology, engineering, and mathematics.',
      image: '/science-lab.png', category: 'Academics', status: 'published' },
    { title: 'Campus Life: Beyond the Classroom', slug: 'campus-life-beyond-classroom',
      content: 'Life at Greenfield Academy extends far beyond academics. Our vibrant campus offers a rich tapestry of extracurricular activities, clubs, and events that contribute to holistic student development.\n\n## Student Clubs & Organizations\n\nWith over 30 active student clubs, there\'s something for everyone. From the Robotics Club to the Debate Society, from the Photography Club to the Entrepreneurship Cell, students have countless opportunities to explore their passions.\n\n## Sports & Fitness\n\nOur state-of-the-art sports complex includes facilities for cricket, football, basketball, swimming, and athletics.\n\n## Cultural Activities\n\nThe annual cultural festival "Prism" is a highlight of campus life, featuring music performances, dance competitions, art exhibitions, and theatrical productions.\n\n## Community Service\n\nWe encourage all students to participate in community service through our outreach programs.',
      excerpt: 'Explore the vibrant extracurricular life at Greenfield Academy with 30+ clubs, sports facilities, cultural events, and community service opportunities.',
      image: '/students-celebrating.png', category: 'Campus Life', status: 'published' },
    { title: 'Admissions Open for 2025-26: Everything You Need to Know', slug: 'admissions-open-2025-26-guide',
      content: 'Greenfield Academy is now accepting applications for the 2025-26 academic year. Here is a comprehensive guide to help you navigate the admission process.\n\n## Programs Available\n\nWe offer a wide range of undergraduate and diploma programs across Science, Arts, Commerce, and Vocational streams.\n\n## Admission Process\n\n1. Online Registration\n2. Document Submission\n3. Entrance Exam\n4. Personal Interview\n5. Offer Letter\n\n## Important Dates\n\n- Application Deadline: July 31, 2025\n- Entrance Exam: August 10, 2025\n- Interview Dates: August 15-20, 2025\n- Final Results: August 25, 2025\n\n## Scholarships\n\nMerit-based and need-based scholarships are available for deserving candidates.',
      excerpt: 'Complete guide to Greenfield Academy admissions for 2025-26: programs, process, important dates, and scholarship information.',
      image: '/hero-campus.png', category: 'Admissions', status: 'published' },
    { title: 'Research Excellence: Greenfield Faculty Publications', slug: 'research-excellence-faculty-publications',
      content: 'Greenfield Academy takes pride in its research culture. Our faculty members regularly publish in top-tier international journals.\n\n## Recent Achievements\n\nDr. Robert Johnson\'s paper on quantum entanglement was published in Nature Physics, while Dr. Sarah Smith\'s research on statistical modeling received the Best Paper Award at the International Conference on Data Science.\n\n## Student Research Opportunities\n\nUndergraduate students are encouraged to participate in research projects. Last year, 15 student-authored papers were published.\n\n## Research Facilities\n\nOur research labs are equipped with the latest instruments. The newly established Center for AI provides computational resources for advanced research.',
      excerpt: 'Celebrating the research achievements of Greenfield Academy faculty and students with international publications and cutting-edge facilities.',
      image: '/library.png', category: 'Research', status: 'published' },
    { title: 'Top 10 Study Tips from Our Toppers', slug: 'top-10-study-tips-toppers',
      content: 'Every year, Greenfield Academy produces top-performing students. Here are their proven study strategies.\n\n1. Create a Study Schedule\n2. Active Learning\n3. Utilize Library Resources\n4. Join Study Groups\n5. Take Regular Breaks\n6. Practice Past Papers\n7. Stay Healthy\n8. Seek Help Early\n9. Use Technology Wisely\n10. Stay Motivated',
      excerpt: 'Proven study strategies from Greenfield Academy\'s top-performing students to help you excel in your academic journey.',
      image: '/library.png', category: 'Academics', status: 'published' },
    { title: 'Greenfield Academy Ranked Among Top 10 Colleges', slug: 'greenfield-ranked-top-10-colleges',
      content: 'We are proud to announce that Greenfield Academy has been ranked among the Top 10 colleges in the National Institutional Ranking Framework for the third consecutive year.\n\n## Key Achievements\n\n- #7 in Overall Rankings\n- #3 in Research Output\n- #5 in Placement Records\n- #2 in Faculty Quality\n\n## What Contributed to Our Ranking\n\nOur consistent focus on academic excellence, research output, industry partnerships, and student satisfaction.\n\nThe average package for our graduates increased by 25% this year.',
      excerpt: 'Greenfield Academy achieves Top 10 ranking in NIRF for the third consecutive year, excelling in research, placements, and faculty quality.',
      image: '/hero-campus.png', category: 'News', status: 'published' },
  ];

  for (const post of blogPosts) {
    await db.blogPost.create({ data: post });
  }

  // Create testimonials
  const testimonials = [
    { name: 'Arun Patel', role: 'B.Sc. Computer Science, Batch 2023', content: 'Greenfield Academy transformed my career trajectory. The hands-on approach to learning and excellent faculty mentorship helped me land a job at a top tech company right after graduation.', rating: 5, avatar: '/professor1.png', isActive: true },
    { name: 'Priya Sharma', role: 'B.A. English Literature, Batch 2022', content: 'The Literature program at Greenfield is truly world-class. Prof. Williams nurtured my love for writing and helped me publish my first novel. The small class sizes meant personalized attention.', rating: 5, avatar: '/professor2.png', isActive: true },
    { name: 'Rahul Verma', role: 'B.Com (Hons), Batch 2024', content: 'The Commerce department prepared me exceptionally well for the corporate world. The practical case studies and industry visits gave me a real-world perspective that textbooks alone could never provide.', rating: 5, avatar: '/professor1.png', isActive: true },
    { name: 'Sneha Reddy', role: 'B.Sc. Physics (Hons), Batch 2023', content: 'Dr. Johnson and the Physics faculty are incredibly passionate about teaching. I got to co-author a research paper in my third year, which helped me get into a top PhD program.', rating: 5, avatar: '/professor2.png', isActive: true },
    { name: 'Karthik Nair', role: 'Diploma in Digital Marketing, Batch 2024', content: 'The vocational program was exactly what I needed to kickstart my career. The curriculum is industry-relevant and the hands-on projects helped me build an impressive portfolio.', rating: 4, avatar: '/professor1.png', isActive: true },
  ];

  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // Create gallery items
  const galleryItems = [
    { title: 'Main Campus Building', caption: 'The iconic main building of Greenfield Academy', url: '/hero-campus.png', category: 'Campus', order: 1 },
    { title: 'Modern Classrooms', caption: 'Smart classrooms equipped with latest technology', url: '/classroom.png', category: 'Academic', order: 2 },
    { title: 'State-of-the-Art Library', caption: 'Our library houses over 50,000 books', url: '/library.png', category: 'Academic', order: 3 },
    { title: 'Advanced Science Labs', caption: 'Cutting-edge laboratories for all sciences', url: '/science-lab.png', category: 'Academic', order: 4 },
    { title: 'Cultural Festival - Prism 2024', caption: 'Students performing at the annual cultural festival', url: '/students-celebrating.png', category: 'Cultural', order: 5 },
    { title: 'Sports Day Celebrations', caption: 'Annual sports day with inter-house competitions', url: '/students-celebrating.png', category: 'Sports', order: 6 },
    { title: 'Campus Aerial View', caption: 'Beautiful 50-acre campus surrounded by greenery', url: '/hero-campus.png', category: 'Campus', order: 7 },
    { title: 'Science Exhibition', caption: 'Students showcasing innovative projects', url: '/science-lab.png', category: 'Events', order: 8 },
    { title: 'Graduation Ceremony', caption: 'Class of 2024 at the annual convocation', url: '/hero-campus.png', category: 'Events', order: 9 },
    { title: 'Workshop Session', caption: 'Industry experts conducting workshops', url: '/classroom.png', category: 'Academic', order: 10 },
    { title: 'Library Reading Room', caption: 'Peaceful reading room for focused studying', url: '/library.png', category: 'Academic', order: 11 },
    { title: 'Student Life', caption: 'Friends and memories that last a lifetime', url: '/students-celebrating.png', category: 'Campus', order: 12 },
  ];

  for (const item of galleryItems) {
    await db.galleryItem.create({ data: item });
  }

  // Create site settings
  const settings = [
    { key: 'school_name', value: 'Greenfield Academy' },
    { key: 'address', value: '123 Academy Drive, Greenfield, CA 94301' },
    { key: 'phone', value: '+1 (555) 123-4567' },
    { key: 'email', value: 'info@greenfieldacademy.edu' },
    { key: 'office_hours', value: 'Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM' },
  ];

  for (const setting of settings) {
    await db.siteSetting.create({ data: setting });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
