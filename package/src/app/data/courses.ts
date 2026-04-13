export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  contentType: "video" | "text";
  textContent?: string;
  completed?: boolean;
}

export interface SubModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  subModules: SubModule[];
  comingSoon?: boolean;
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  image?: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  totalLessons: number;
  totalDuration: string;
  progress: number;
  modules: Module[];
  tags: string[];
}

// Helper functions
export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getModuleById(courseId: string, moduleId: string): Module | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  return course.modules.find((m) => m.id === moduleId);
}

export function getSubModuleById(courseId: string, moduleId: string, subModuleId: string): SubModule | undefined {
  const courseModule = getModuleById(courseId, moduleId);
  if (!courseModule) return undefined;
  return courseModule.subModules.find((sm) => sm.id === subModuleId);
}

export function getAllLessons(course: Course): Lesson[] {
  return course.modules.flatMap((module) => 
    module.subModules.flatMap((subModule) => subModule.lessons)
  );
}

export function getLessonById(courseId: string, lessonId: string): { course: Course; lesson: Lesson } | undefined {
  const course = getCourseById(courseId);
  if (!course) return undefined;
  const lesson = getAllLessons(course).find((l) => l.id === lessonId);
  if (!lesson) return undefined;
  return { course, lesson };
}

export function getNextLesson(course: Course, currentLessonId: string): Lesson | undefined {
  const allLessons = getAllLessons(course);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex < 0 || currentIndex >= allLessons.length - 1) return undefined;
  return allLessons[currentIndex + 1];
}

export function getPrevLesson(course: Course, currentLessonId: string): Lesson | undefined {
  const allLessons = getAllLessons(course);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex <= 0) return undefined;
  return allLessons[currentIndex - 1];
}

export const courses: Course[] = [
{
    id: "tikcash-program",
    title: "TikCash Program",
    subtitle: "9 modules - 129 lessons",
    description: "Complete guide to maximize your earnings with TikCash.",
    thumbnail: "/images/courses/tikcash-growth.jpg",
    image: "/images/modules/tikcash-main.jpg",
    instructor: "Profitok Team",
    instructorAvatar: "/images/users/1.jpg",
    category: "Digital Marketing",
    totalLessons: 129,
    totalDuration: "15h+",
    progress: 0,
    tags: ["TikCash", "Earnings", "Marketing", "Profits"],
    modules: [
      // MODULE 01 | Youtube Profits (44 lessons total)
      {
        id: "mod-1",
        title: "Module 01 | Youtube Profits",
        subtitle: "44 lessons",
        subModules: [
          {
            id: "sm-1-1",
            title: "First Steps And General Information",
            lessons: [
              {
                id: "m1-1-les-1",
                title: "Welcome - Start Here",
                duration: "5:00",
                videoUrl: "https://www.youtube.com/embed/0LrwOQZVSDw",
                description: "Welcome to the TikCash Program!",
                contentType: "video",
              },
              {
                id: "m1-1-les-2",
                title: "How to access this content easily",
                duration: "3:00",
                videoUrl: "https://www.youtube.com/embed/0LrwOQZVSDw",
                description: "Learn how to easily access all course content.",
                contentType: "video",
              },
              {
                id: "m1-1-les-3",
                title: "Problems with duplicate purchases or card rejections",
                duration: "2:00",
                videoUrl: "",
                description: "Having issues with payments?",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px;">Very few people might have problems with a duplicate purchase, or sometimes they have wanted to buy one of our additional products but received an error at checkout...</p>
<p style="margin-bottom: 16px;">If this is your case, please fill out the following form so that our team can solve it for you.</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSedMydNiJp1Ss5ZhhHtuzTxphQFTwgpKEsdqhIn5Ugka5uFtQ/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="color: #25f4ee; font-weight: 600; text-decoration: underline;">CLICK HERE TO FILL OUT THE FORM</a></p>`,
              },
              {
                id: "m1-1-les-4",
                title: "Request your refund",
                duration: "2:00",
                videoUrl: "",
                description: "Need a refund? Here's how.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Request Your Refund</p>
<p style="margin-bottom: 16px;">If you want to apply for the 15-day guarantee, you just need to fill out this small form by clicking on the following link:</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSedMydNiJp1Ss5ZhhHtuzTxphQFTwgpKEsdqhIn5Ugka5uFtQ/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">CLICK HERE</a></p>
<p style="color: rgba(255,255,255,0.7);">You just need to fill it out and the refund will be successfully processed, the money will be credited to your account on the next billing date of your credit card.</p>`,
              },
              {
                id: "m1-1-les-5",
                title: "Support Center",
                duration: "2:00",
                videoUrl: "",
                description: "Get help from our support team.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Dear Profitok Users,</p>
<p style="margin-bottom: 16px;">Welcome to the Profitok Support Center! We're dedicated to ensuring your experience with Profitok is seamless. Whether you have questions, encounter technical issues, or seek guidance on maximizing features, our team is here to assist you.</p>
<p style="margin-bottom: 16px;"><strong style="color: #25f4ee;">How to Reach Us:</strong> For inquiries, assistance, or feedback, please contact us via email at <a href="mailto:accesssupport.ai@gmail.com" style="color: #fe2c55; font-weight: 600;">accesssupport.ai@gmail.com</a></p>
<p style="margin-bottom: 16px;">Our support team operates <strong>Monday to Friday, from 9:00 AM to 6:00 PM</strong>, and we aim to respond promptly to all inquiries during these hours.</p>
<p style="margin-bottom: 16px;"><strong style="color: #25f4ee;">Feedback:</strong> Your input is invaluable to us as we strive to enhance Profitok continuously. Whether it's suggestions for new features or improvements to existing ones, we'd love to hear from you.</p>
<p style="margin-top: 24px; color: rgba(255,255,255,0.7);">Best Regards,<br/><strong style="color: #fff;">Profitok Support Team</strong></p>`,
              },
              {
                id: "m1-1-les-6",
                title: "Fill out the form and earn your first $35!",
                duration: "3:00",
                videoUrl: "",
                description: "Get your first earnings!",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to module 1.1!</p>
<p style="margin-bottom: 16px;">We invite you to fill out this short form. We recommend you fill out this form when you finish consuming the program, so you can give us your opinion of its content.</p>
<p style="margin-bottom: 16px; background: linear-gradient(135deg, rgba(37,244,238,0.1) 0%, rgba(254,44,85,0.1) 100%); padding: 20px; border-radius: 12px; border: 1px solid rgba(37,244,238,0.2);">After filling out the form we will personally send you <strong style="color: #25f4ee; font-size: 20px;">$20 dollars</strong> to your PayPal account...<br/><br/><span style="color: rgba(255,255,255,0.7);">but be patient, as the money will arrive in the next 4-6 days.</span></p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkx5C-MJOG1ONNzw8PrxKjmrH5Z5UzL5qG0VFt8N-Zkkky7A/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">FILL UP THE FORM HERE</a></p>`,
              },
            ],
          },
          {
            id: "sm-1-2",
            title: "Transforming your mindset",
            lessons: [
              { id: "m1-2-les-1", title: "Start Here", duration: "5:00", videoUrl: "https://www.youtube.com/embed/1Xk9TBsrfxQ", description: "Begin your mindset transformation.", contentType: "video" },
              { id: "m1-2-les-2", title: "Set Your Objectives", duration: "4:00", videoUrl: "https://www.youtube.com/embed/UyQvB6pxrKk", description: "Learn to set clear goals.", contentType: "video" },
              { id: "m1-2-les-3", title: "Start Immediately", duration: "3:00", videoUrl: "https://www.youtube.com/embed/7Fdhpmvlrjw", description: "Take action now.", contentType: "video" },
              { id: "m1-2-les-4", title: "Be Optimistic", duration: "4:00", videoUrl: "https://www.youtube.com/embed/FVo9mLFYD2Q", description: "Cultivate a positive mindset.", contentType: "video" },
              { id: "m1-2-les-5", title: "Be Resolute", duration: "4:00", videoUrl: "https://www.youtube.com/embed/V9hQTI-Qvmk", description: "Stay determined.", contentType: "video" },
              { id: "m1-2-les-6", title: "Attract it", duration: "5:00", videoUrl: "https://www.youtube.com/embed/J0u1Hxx_nX0", description: "Law of attraction principles.", contentType: "video" },
            ],
          },
          {
            id: "sm-1-3",
            title: "Video Profits",
            lessons: [
              { id: "m1-3-les-1", title: "Watch this First", duration: "4:00", videoUrl: "https://www.youtube.com/embed/0LrwOQZVSDw", description: "Important intro.", contentType: "video" },
              { id: "m1-3-les-2", title: "Step 1", duration: "5:00", videoUrl: "https://www.youtube.com/embed/KqJy4pUwsxE", description: "First step.", contentType: "video" },
              { id: "m1-3-les-3", title: "Step 2", duration: "5:00", videoUrl: "https://www.youtube.com/embed/j0YAyaOPvBo", description: "Second step.", contentType: "video" },
              { id: "m1-3-les-4", title: "Step 3", duration: "5:00", videoUrl: "https://www.youtube.com/embed/vdhquT6SQdY", description: "Third step.", contentType: "video" },
              { id: "m1-3-les-5", title: "Step 4", duration: "5:00", videoUrl: "https://www.youtube.com/embed/Zp1dXAiAiQQ", description: "Fourth step.", contentType: "video" },
              { id: "m1-3-les-6", title: "Tutorial # 1", duration: "6:00", videoUrl: "https://www.youtube.com/embed/DlNIV4gKNIo", description: "First tutorial.", contentType: "video" },
              { id: "m1-3-les-7", title: "Tutorial # 2", duration: "6:00", videoUrl: "https://www.youtube.com/embed/HqVlFm8K1-I", description: "Second tutorial.", contentType: "video" },
              { id: "m1-3-les-8", title: "Tutorial # 3", duration: "6:00", videoUrl: "https://www.youtube.com/embed/iojJnZ4GNiE", description: "Third tutorial.", contentType: "video" },
              { id: "m1-3-les-9", title: "Tutorial # 4", duration: "6:00", videoUrl: "https://www.youtube.com/embed/SSmIyBSbetY", description: "Fourth tutorial.", contentType: "video" },
              { id: "m1-3-les-10", title: "Tutorial # 5", duration: "6:00", videoUrl: "https://www.youtube.com/embed/X9nAFi_ZfHU", description: "Fifth tutorial.", contentType: "video" },
              {
                id: "m1-3-les-11",
                title: "Paid Surveys - Part 1",
                duration: "5:00",
                videoUrl: "",
                description: "Learn about paid surveys.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Paid Surveys - Part 1</p>
<p style="margin-bottom: 16px;">In the following link you can access one of our recommended platforms to earn money by completing surveys and simple tasks.</p>
<p style="margin-bottom: 24px;"><a href="https://freecash.com/r/67d7aa783c5ab49c5a3e5277" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">ACCESS PLATFORM HERE</a></p>`,
              },
              {
                id: "m1-3-les-12",
                title: "Paid Surveys - Part 2",
                duration: "5:00",
                videoUrl: "",
                description: "More paid survey platforms.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Paid Surveys - Part 2</p>
<p style="margin-bottom: 16px;">Here is another platform where you can earn money completing surveys and tasks.</p>
<p style="margin-bottom: 24px;"><a href="https://www.swagbucks.com/?cmp=695&cxid=swagbuttonref&rb=124693138&extRefCmp=1&extReferrer=https%253A%252F%252Fwww.google.com%252F" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">ACCESS PLATFORM HERE</a></p>`,
              },
              { id: "m1-3-les-13", title: "Tutorial # 6", duration: "6:00", videoUrl: "https://www.youtube.com/embed/c3c-Hzzl5zU", description: "Sixth tutorial.", contentType: "video" },
              { id: "m1-3-les-14", title: "Tutorial # 7", duration: "6:00", videoUrl: "https://www.youtube.com/embed/0nMZrJmNz5U", description: "Seventh tutorial.", contentType: "video" },
              { id: "m1-3-les-15", title: "Tutorial # 8", duration: "6:00", videoUrl: "https://www.youtube.com/embed/FCEiG3thJF0", description: "Eighth tutorial.", contentType: "video" },
              { id: "m1-3-les-16", title: "Tutorial # 9", duration: "6:00", videoUrl: "https://www.youtube.com/embed/mAXm9sMlMic", description: "Ninth tutorial.", contentType: "video" },
              { id: "m1-3-les-17", title: "Tutorial # 10", duration: "6:00", videoUrl: "https://www.youtube.com/embed/j4-1Kw_kuWk", description: "Tenth tutorial.", contentType: "video" },
              { id: "m1-3-les-18", title: "Class #11", duration: "7:00", videoUrl: "https://www.youtube.com/embed/vdhquT6SQdY", description: "Class 11.", contentType: "video" },
              { id: "m1-3-les-19", title: "Class #12", duration: "7:00", videoUrl: "https://www.youtube.com/embed/7Fdhpmvlrjw", description: "Class 12.", contentType: "video" },
              { id: "m1-3-les-20", title: "Class #13", duration: "7:00", videoUrl: "https://www.youtube.com/embed/UyQvB6pxrKk", description: "Class 13.", contentType: "video" },
              { id: "m1-3-les-21", title: "Class #14", duration: "7:00", videoUrl: "https://www.youtube.com/embed/1Xk9TBsrfxQ", description: "Class 14.", contentType: "video" },
              { id: "m1-3-les-22", title: "Class #15", duration: "7:00", videoUrl: "https://www.youtube.com/embed/FVo9mLFYD2Q", description: "Class 15.", contentType: "video" },
              { id: "m1-3-les-23", title: "Class #16", duration: "7:00", videoUrl: "https://www.youtube.com/embed/V9hQTI-Qvmk", description: "Class 16.", contentType: "video" },
              { id: "m1-3-les-24", title: "Class #17", duration: "7:00", videoUrl: "https://www.youtube.com/embed/J0u1Hxx_nX0", description: "Class 17.", contentType: "video" },
              { id: "m1-3-les-25", title: "Class #18", duration: "7:00", videoUrl: "https://www.youtube.com/embed/KqJy4pUwsxE", description: "Class 18.", contentType: "video" },
              { id: "m1-3-les-26", title: "Class #19", duration: "7:00", videoUrl: "https://www.youtube.com/embed/j0YAyaOPvBo", description: "Class 19.", contentType: "video" },
              { id: "m1-3-les-27", title: "Class #20", duration: "7:00", videoUrl: "https://www.youtube.com/embed/Zp1dXAiAiQQ", description: "Class 20.", contentType: "video" },
              { id: "m1-3-les-28", title: "Class #21", duration: "7:00", videoUrl: "https://www.youtube.com/embed/DlNIV4gKNIo", description: "Class 21.", contentType: "video" },
              { id: "m1-3-les-29", title: "Class #22", duration: "7:00", videoUrl: "https://www.youtube.com/embed/HqVlFm8K1-I", description: "Class 22.", contentType: "video" },
              { id: "m1-3-les-30", title: "Class #23", duration: "7:00", videoUrl: "https://www.youtube.com/embed/iojJnZ4GNiE", description: "Class 23.", contentType: "video" },
              { id: "m1-3-les-31", title: "Bonus - Daily Earnings Strategy", duration: "10:00", videoUrl: "https://www.youtube.com/embed/SSmIyBSbetY", description: "Bonus strategy for daily earnings.", contentType: "video" },
              { id: "m1-3-les-32", title: "Final Class - Next Steps", duration: "8:00", videoUrl: "https://www.youtube.com/embed/X9nAFi_ZfHU", description: "Your path forward.", contentType: "video" },
            ],
          },
        ],
      },
      // MODULE 02 | ProfiTok: Bonus Program (33 lessons total)
      {
        id: "mod-2",
        title: "Module 02 | ProfiTok: Bonus Program",
        subtitle: "33 lessons",
        subModules: [
          {
            id: "sm-2-1",
            title: "First Steps",
            lessons: [
              { id: "m2-1-les-1", title: "Welcome - Start Here", duration: "5:00", videoUrl: "https://www.youtube.com/embed/y4rZWUg2BBc", description: "Welcome to ProfiTok!", contentType: "video" },
              { id: "m2-1-les-2", title: "How to access this content easily", duration: "4:00", videoUrl: "https://www.youtube.com/embed/0LrwOQZVSDw", description: "Easy content access.", contentType: "video" },
              { id: "m2-1-les-3", title: "How to use this program - MANDATORY", duration: "6:00", videoUrl: "https://www.youtube.com/embed/uOl2WdZmXfY", description: "Essential program guide.", contentType: "video" },
              {
                id: "m2-1-les-4",
                title: "Problems with duplicate purchases or card rejections",
                duration: "2:00",
                videoUrl: "",
                description: "Payment issues help.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px;">Very few people might have problems with a duplicate purchase, or sometimes they have wanted to buy one of our additional products but received an error at checkout...</p>
<p style="margin-bottom: 16px;">If this is your case, please fill out the following form so that our team can solve it for you.</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSev-ZphXOmw-tf23GHKB6-R43j8p36wo70mdXW0nFteqAA26g/viewform" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">FILL OUT THE FORM</a></p>`,
              },
              {
                id: "m2-1-les-5",
                title: "Fill out this form and earn $35",
                duration: "3:00",
                videoUrl: "",
                description: "Earn $35 bonus.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to module 1.1!</p>
<p style="margin-bottom: 16px;">We invite you to fill out this short form. We recommend you fill out this form when you finish consuming the program, so you can give us your opinion of its content.</p>
<p style="margin-bottom: 16px; background: linear-gradient(135deg, rgba(37,244,238,0.1) 0%, rgba(254,44,85,0.1) 100%); padding: 20px; border-radius: 12px; border: 1px solid rgba(37,244,238,0.2);">After filling out the form we will personally send you <strong style="color: #25f4ee; font-size: 20px;">$20 dollars</strong> to your PayPal account...<br/><br/><span style="color: rgba(255,255,255,0.7);">but be patient, as the money will arrive in the next 4-6 days.</span></p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkx5C-MJOG1ONNzw8PrxKjmrH5Z5UzL5qG0VFt8N-Zkkky7A/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">FILL UP THE FORM HERE</a></p>`,
              },
            ],
          },
          {
            id: "sm-2-2",
            title: "Earn $35 right now",
            lessons: [
              {
                id: "m2-2-les-1",
                title: "Fill out this form and earn $35",
                duration: "3:00",
                videoUrl: "",
                description: "Get your $35 bonus now.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to module 1.1!</p>
<p style="margin-bottom: 16px;">We invite you to fill out this short form. We recommend you fill out this form when you finish consuming the program, so you can give us your opinion of its content.</p>
<p style="margin-bottom: 16px; background: linear-gradient(135deg, rgba(37,244,238,0.1) 0%, rgba(254,44,85,0.1) 100%); padding: 20px; border-radius: 12px; border: 1px solid rgba(37,244,238,0.2);">After filling out the form we will personally send you <strong style="color: #25f4ee; font-size: 20px;">$20 dollars</strong> to your PayPal account...<br/><br/><span style="color: rgba(255,255,255,0.7);">but be patient, as the money will arrive in the next 4-6 days.</span></p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkx5C-MJOG1ONNzw8PrxKjmrH5Z5UzL5qG0VFt8N-Zkkky7A/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">FILL UP THE FORM HERE</a></p>`,
              },
            ],
          },
          {
            id: "sm-2-3",
            title: "Download The Profitok App",
            lessons: [
              {
                id: "m2-3-les-1",
                title: "Instructions",
                duration: "3:00",
                videoUrl: "",
                description: "Important instructions.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px; color: #fe2c55;">IMPORTANT</p>
<p style="margin-bottom: 16px;">These two classes were introductory to some ways you too can profit. In the next module you will have access and be able to download the ''secret tool'' application, but it will be released after 7 days due to the updates and configurations that we will make to register all your data in the tool.</p>
<p style="margin-bottom: 16px;">After releasing the tool, just download it to your cell phone, put it into practice and conquer the dreamed financial freedom.</p>
<p style="margin-top: 20px; padding: 16px; background: rgba(254,44,85,0.1); border-radius: 12px; border: 1px solid rgba(254,44,85,0.2);"><strong style="color: #25f4ee;">Note:</strong> After releasing the tool, be sure to send us a testimonial about your experience with our application and your earnings.</p>`,
              },
              { id: "m2-3-les-2", title: "Profitok App", duration: "8:00", videoUrl: "https://www.youtube.com/embed/65XtsHL9KCM", description: "Download the Profitok app.", contentType: "video" },
            ],
          },
          {
            id: "sm-2-4",
            title: "Earn $200-$300 Daily Watching Videos",
            lessons: [
              { id: "m2-4-les-1", title: "Method 1 - Watch Videos and Earn $600", duration: "10:00", videoUrl: "https://www.youtube.com/embed/j4-1Kw_kuWk", description: "Earn $600 watching videos.", contentType: "video" },
              { id: "m2-4-les-2", title: "Method 2 - Earn $500 Per Day With Videos", duration: "12:00", videoUrl: "https://www.youtube.com/embed/sNkzTkH6JKc", description: "Make $500 daily.", contentType: "video" },
              { id: "m2-4-les-3", title: "Method 3 - $250 Every Day With Videos", duration: "10:00", videoUrl: "https://www.youtube.com/embed/QhxaSXzZSCk", description: "Earn $250 daily.", contentType: "video" },
              { id: "m2-4-les-4", title: "The 4 best ways to earn +$200 a day with videos", duration: "15:00", videoUrl: "https://www.youtube.com/embed/vdhquT6SQdY", description: "Top 4 methods.", contentType: "video" },
              { id: "m2-4-les-5", title: "How He Made $1,500,000 USD With Shop Affiliate", duration: "20:00", videoUrl: "https://www.youtube.com/embed/28IjJXTfXSA", description: "Million dollar success story.", contentType: "video" },
            ],
          },
          {
            id: "sm-2-5",
            title: "Earn $3,500 Each Month Watching YouTube",
            lessons: [
              { id: "m2-5-les-1", title: "Generator Method 1", duration: "12:00", videoUrl: "https://www.youtube.com/embed/JaOL7IxZPRA", description: "First generator method.", contentType: "video" },
              { id: "m2-5-les-2", title: "Generator Method 2", duration: "12:00", videoUrl: "https://www.youtube.com/embed/K1Lp_mwbTBI", description: "Second generator method.", contentType: "video" },
              { id: "m2-5-les-3", title: "Generator Method 3", duration: "12:00", videoUrl: "https://www.youtube.com/embed/3VDVXgQIG1Q", description: "Third generator method.", contentType: "video" },
              { id: "m2-5-les-4", title: "Generator Method 4", duration: "12:00", videoUrl: "https://www.youtube.com/embed/jXexJY0JS3k", description: "Fourth generator method.", contentType: "video" },
            ],
          },
          {
            id: "sm-2-6",
            title: "Multiply Your Results With These 3 Secret Methods",
            lessons: [
              { id: "m2-6-les-1", title: "Method 1", duration: "15:00", videoUrl: "https://www.youtube.com/embed/KlahnDqamxI", description: "First secret method.", contentType: "video" },
              { id: "m2-6-les-2", title: "Method 2", duration: "15:00", videoUrl: "https://www.youtube.com/embed/h0doY96U1OQ", description: "Second secret method.", contentType: "video" },
              { id: "m2-6-les-3", title: "Method 3", duration: "15:00", videoUrl: "https://www.youtube.com/embed/rkrTRUYiLWk", description: "Third secret method.", contentType: "video" },
            ],
          },
          {
            id: "sm-2-7",
            title: "Exclusive Bonus",
            lessons: [
              { id: "m2-7-les-1", title: "Classroom #8 - Earn US $100,000 In 6 Months", duration: "25:00", videoUrl: "https://www.youtube.com/embed/fFELeulDI4s", description: "Path to $100K.", contentType: "video" },
              { id: "m2-7-les-2", title: "Masterclass With the Millionaire Mentor Valued in $497", duration: "60:00", videoUrl: "https://www.youtube.com/embed/qZ9xUZKJnmQ", description: "$497 masterclass included.", contentType: "video" },
              { id: "m2-7-les-3", title: "Bonus 3 - Hidden Platform to Earn $10 for each Video Liked", duration: "12:00", videoUrl: "https://www.youtube.com/embed/5z4wOMDdTdU", description: "Earn per like.", contentType: "video" },
              { id: "m2-7-les-4", title: "Bonus 4 - How to Make $10k/Month Re-Uploading YouTube Videos", duration: "18:00", videoUrl: "https://www.youtube.com/embed/SnssN3rM4rk", description: "$10k/month method.", contentType: "video" },
            ],
          },
          {
            id: "sm-2-8",
            title: "How To Apply The Warranty",
            lessons: [
              {
                id: "m2-8-les-1",
                title: "Request your refund",
                duration: "2:00",
                videoUrl: "",
                description: "How to request refund.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Request Your Refund</p>
<p style="margin-bottom: 16px;">If you want to apply for the 15-day guarantee, you just need to fill out this small form by clicking on the following link:</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfPghwgDAdFY6WgIRA1mrx8pYOrYAIsE9LlmnfszYhaT4VuvA/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">CLICK HERE</a></p>
<p style="color: rgba(255,255,255,0.7);">You just need to fill it out and the refund will be successfully processed, the money will be credited to your account on the next billing date of your credit card.</p>`,
              },
              {
                id: "m2-8-les-2",
                title: "Support Center",
                duration: "2:00",
                videoUrl: "",
                description: "Contact support.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Dear Profitok Users,</p>
<p style="margin-bottom: 16px;">Welcome to the Profitok Support Center! We're dedicated to ensuring your experience with Profitok is seamless.</p>
<p style="margin-bottom: 16px;"><strong style="color: #25f4ee;">How to Reach Us:</strong> For inquiries, assistance, or feedback, please contact us via email at <a href="mailto:accesssupport.ai@gmail.com" style="color: #fe2c55; font-weight: 600;">accesssupport.ai@gmail.com</a></p>
<p style="margin-bottom: 16px;">Our support team operates <strong>Monday to Friday, from 9:00 AM to 6:00 PM</strong>.</p>
<p style="margin-top: 24px; color: rgba(255,255,255,0.7);">Best Regards,<br/><strong style="color: #fff;">Profitok Support Team</strong></p>`,
              },
            ],
          },
        ],
      },
      // MODULE 03 | Millionaire Mindset (12 lessons total)
      {
        id: "mod-3",
        title: "Module 03 | Millionaire Mindset",
        subtitle: "12 lessons",
        subModules: [
          {
            id: "sm-3-1",
            title: "Millionaire Mindset Training",
            lessons: [
              { id: "m3-1-les-1", title: "Foundations of Financial Mindset", duration: "15:00", videoUrl: "https://www.youtube.com/embed/RyGZ8H4N0t4", description: "Build your financial foundation.", contentType: "video" },
              { id: "m3-1-les-2", title: "How to Prepare to Earn More", duration: "12:00", videoUrl: "https://www.youtube.com/embed/o0I_J1vHlAU", description: "Prepare for wealth.", contentType: "video" },
              { id: "m3-1-les-3", title: "The Mistakes That Hold Back Your Financial Growth", duration: "14:00", videoUrl: "https://www.youtube.com/embed/tFJqac-zzuw", description: "Avoid common mistakes.", contentType: "video" },
              { id: "m3-1-les-4", title: "How to Use Money to Your Advantage", duration: "13:00", videoUrl: "https://www.youtube.com/embed/NfKMzS8v-Rg", description: "Money management.", contentType: "video" },
              { id: "m3-1-les-5", title: "Money Multiplication in Practice", duration: "16:00", videoUrl: "https://www.youtube.com/embed/0WtHJIez0V0", description: "Multiply your money.", contentType: "video" },
              { id: "m3-1-les-6", title: "University, Career, and Financial Independence", duration: "18:00", videoUrl: "https://www.youtube.com/embed/cV218GPI2ak", description: "Path to independence.", contentType: "video" },
              { id: "m3-1-les-7", title: "How to Set Goals and Take Control of Your Financial Life", duration: "14:00", videoUrl: "https://www.youtube.com/embed/w0w2rZDmXAQ", description: "Goal setting.", contentType: "video" },
              { id: "m3-1-les-8", title: "Mental Reprogramming for Success", duration: "20:00", videoUrl: "https://www.youtube.com/embed/kj4efPjk7T0", description: "Reprogram your mind.", contentType: "video" },
              { id: "m3-1-les-9", title: "How to Break Cycles and Create a New Financial Reality", duration: "15:00", videoUrl: "https://www.youtube.com/embed/BIQZqQIsPY4", description: "Break negative cycles.", contentType: "video" },
              { id: "m3-1-les-10", title: "The Secret That Changes Everything - How to Attract What You Want", duration: "22:00", videoUrl: "https://www.youtube.com/embed/2cSo99Rlz_Y", description: "Law of attraction.", contentType: "video" },
              { id: "m3-1-les-11", title: "Positive Affirmations and Creative Visualization", duration: "18:00", videoUrl: "https://www.youtube.com/embed/BJKc1zF-nac", description: "Visualization techniques.", contentType: "video" },
              { id: "m3-1-les-12", title: "Overcoming Blocks and Limiting Beliefs", duration: "16:00", videoUrl: "https://www.youtube.com/embed/zKA-9Ok1fWU", description: "Remove limiting beliefs.", contentType: "video" },
            ],
          },
        ],
      },
      // MODULE 04 | Recover Your Investment (8 lessons total)
      {
        id: "mod-4",
        title: "Module 04 | Recover Your Investment",
        subtitle: "8 lessons",
        subModules: [
          {
            id: "sm-4-1",
            title: "Introduction",
            lessons: [
              {
                id: "m4-1-les-1",
                title: "Introduction",
                duration: "5:00",
                videoUrl: "",
                description: "Course introduction.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Hello and welcome!</p>
<p style="margin-bottom: 16px;">Welcome to the first module of this wonderful course where you will learn to multiply your results X3. In order for you to see the expected results please follow the instructions below:</p>
<ol style="margin-bottom: 20px; padding-left: 24px; color: rgba(255,255,255,0.9);">
<li style="margin-bottom: 8px;">Don't see the course in disorder</li>
<li style="margin-bottom: 8px;">Start with module 2 where you will set the right mindset to earn more money</li>
<li style="margin-bottom: 8px;">Go to module 3 and fill out the google forms to receive a $20 Bonus</li>
<li style="margin-bottom: 8px;">Check module 4 and follow the steps to increase your results X3</li>
</ol>`,
              },
            ],
          },
          {
            id: "sm-4-2",
            title: "Support",
            lessons: [
              {
                id: "m4-2-les-1",
                title: "Support",
                duration: "2:00",
                videoUrl: "",
                description: "Contact support.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Dear Profitok Users,</p>
<p style="margin-bottom: 16px;">Welcome to the Profitok Support Center! We're dedicated to ensuring your experience with Profitok is seamless.</p>
<p style="margin-bottom: 16px;"><strong style="color: #25f4ee;">How to Reach Us:</strong> For inquiries, assistance, or feedback, please contact us via email at <a href="mailto:accesssupport.ai@gmail.com" style="color: #fe2c55; font-weight: 600;">accesssupport.ai@gmail.com</a></p>
<p style="margin-bottom: 16px;">Our support team operates <strong>Monday to Friday, from 9:00 AM to 6:00 PM</strong>.</p>
<p style="margin-top: 24px; color: rgba(255,255,255,0.7);">Best Regards,<br/><strong style="color: #fff;">Profitok Support Team</strong></p>`,
              },
            ],
          },
          {
            id: "sm-4-3",
            title: "The Real Secret of Millionaires",
            lessons: [
              {
                id: "m4-3-les-1",
                title: "The Real Secret of Millionaires",
                duration: "10:00",
                videoUrl: "",
                description: "PDF resource.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">The Real Secret of Millionaires</p>
<p style="margin-bottom: 16px;">Download the exclusive PDF to learn the real secrets of millionaires.</p>
<p style="margin-bottom: 24px;"><a href="#" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">DOWNLOAD PDF</a></p>`,
              },
              {
                id: "m4-3-les-2",
                title: "15 Best Sources Of Income",
                duration: "8:00",
                videoUrl: "",
                description: "Income sources PDF.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">15 Best Sources Of Income</p>
<p style="margin-bottom: 16px;">Download this PDF to discover the 15 best sources of income.</p>
<p style="margin-bottom: 24px;"><a href="https://cdn.areademembros.com/files/instancia_5829/editor/2kUyi4hhP1t5KZlKkhJIW0hNKcnWw6TM4781UKo3.pdf" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">DOWNLOAD PDF</a></p>`,
              },
            ],
          },
          {
            id: "sm-4-4",
            title: "Methods to Recover Your Investment",
            lessons: [
              { id: "m4-4-les-1", title: "Method 1 - Make $509 easily", duration: "15:00", videoUrl: "https://www.youtube.com/embed/p8B4meVI154", description: "Make $509.", contentType: "video" },
              { id: "m4-4-les-2", title: "Method 2 - Make $1,437 per week", duration: "18:00", videoUrl: "https://www.youtube.com/embed/okIz98bcBo0", description: "Earn $1,437 weekly.", contentType: "video" },
              { id: "m4-4-les-3", title: "Method 3 - $100 Every Day With UserTesting.com", duration: "12:00", videoUrl: "https://www.youtube.com/embed/434puZCzFwM", description: "Earn $100 daily.", contentType: "video" },
            ],
          },
        ],
      },
      // MODULE 05 | Millionaire System
      {
        id: "mod-5",
        title: "Module 05 | Millionaire System",
        subtitle: "6 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "sm-5-1",
            title: "Private Group",
            lessons: [
              {
                id: "m5-1-les-1",
                title: "Private Group",
                duration: "2:00",
                videoUrl: "",
                description: "Access our VIP group.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to our VIP group.</p>
<p style="margin-bottom: 16px;">This group can only be accessed by people who have obtained their access pass, this channel will provide valuable information for the process of both financial and personal growth of each participant, remember that perseverance is the best tool for success.</p>
<p style="margin-bottom: 16px; font-weight: 600;">See you on the other side:</p>
<p style="margin-bottom: 24px;"><a href="https://telegram.me/+DCjkRmAnYgAxZGRh" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">JOIN TELEGRAM GROUP</a></p>`,
              },
              { id: "m5-1-les-2", title: "The Secret Of Multimillionaires To Manage Their Money", duration: "12:00", videoUrl: "https://www.youtube.com/embed/GTkk7YbGQ8w", description: "Learn money management.", contentType: "video" },
              {
                id: "m5-1-les-3",
                title: "Money Management Template",
                duration: "5:00",
                videoUrl: "",
                description: "Download the template.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Money Management Template</p>
<p style="margin-bottom: 16px;">Download the file by clicking below:</p>
<p style="margin-bottom: 24px;"><a href="https://cdn.areademembros.com/file/download/a2Z5ay55Sk9RNkFKWEd5SUM4QUk3bkdLMjJmZzFuWkdrak9ieVlDYXVoM3d2L2ViZ3Zxci85Mjg1X252cGFuZ2Zhdi8%3D?test=1&ts=1774490814&uptkn=451d2511c4d9f80d0ebdac820d2ce3d5&name=MoneyManagementTemplate+%281%29" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">DOWNLOAD TEMPLATE</a></p>`,
              },
              {
                id: "m5-1-les-4",
                title: "The Art of Getting Rich: How to Multiply Your Money Effortlessly",
                duration: "10:00",
                videoUrl: "",
                description: "Download the guide.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">The Art of Getting Rich: How to Multiply Your Money Effortlessly</p>
<p style="margin-bottom: 16px;">Download the file by clicking below:</p>
<p style="margin-bottom: 24px;"><a href="https://cdn.areademembros.com/file/download/c3FjLmhoanM2NTAyVzdhcTl1eko3aDRGd243eVFHcTEwR1RQa0pyd1BNeTEvZWJndnFyLzkyODVfbnZwYW5nZmF2Lw%3D%3D?test=1&ts=1774490848&uptkn=451d2511c4d9f80d0ebdac820d2ce3d5&name=TheArtofGettingRich-HowtoMultiplyYourMoneyEffortlessly+%281%29" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">DOWNLOAD GUIDE</a></p>`,
              },
            ],
          },
        ],
      },
      // MODULE 06 | Increase Your Profits X3
      {
        id: "mod-6",
        title: "Module 06 | Increase Your Profits X3",
        subtitle: "7 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "sm-6-1",
            title: "Millionaire Mindset To Earn Money",
            lessons: [
              { id: "m6-1-les-1", title: "Don't Waste Your Time", duration: "10:00", videoUrl: "https://www.youtube.com/embed/Nkly4teYytU", description: "Time management.", contentType: "video" },
              { id: "m6-1-les-2", title: "THE MINDSET OF HIGH ACHIEVERS", duration: "15:00", videoUrl: "https://www.youtube.com/embed/rYwLtw3q9iw", description: "High achiever mindset.", contentType: "video" },
              { id: "m6-1-les-3", title: "24 Hours To Become Rich", duration: "12:00", videoUrl: "https://www.youtube.com/embed/kCgV-i7Brhg", description: "Get rich fast.", contentType: "video" },
            ],
          },
          {
            id: "sm-6-2",
            title: "Increase Your Profits",
            lessons: [
              { id: "m6-2-les-1", title: "$100 Every Day With Rev.com", duration: "14:00", videoUrl: "https://www.youtube.com/embed/m0knrEuyeVM", description: "Earn with Rev.com.", contentType: "video" },
              { id: "m6-2-les-2", title: "Earning Money With ClickWorker", duration: "11:00", videoUrl: "https://www.youtube.com/embed/1_NRwFi_2u4", description: "Earn with ClickWorker.", contentType: "video" },
              { id: "m6-2-les-3", title: "The New AI Side Hustle That's Making $1,579/day", duration: "16:00", videoUrl: "https://www.youtube.com/embed/rYwLtw3q9iw", description: "AI side hustle.", contentType: "video" },
            ],
          },
          {
            id: "sm-6-3",
            title: "Increase Your Results X3",
            lessons: [
              {
                id: "m6-3-les-1",
                title: "Increase your results X3",
                duration: "3:00",
                videoUrl: "",
                description: "Multiply your earnings.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Increase Your Results X3</p>
<p style="margin-bottom: 16px;">Request the activation of your account and receive earnings multiplied X3!</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfm7D49TswoA-8bVWaiKlldrGPfIgyOW8g7xbmLGMQLY23K1A/viewform?usp=header" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">ACTIVATE X3 EARNINGS</a></p>`,
              },
            ],
          },
        ],
      },
      // MODULE 07 | Lifetime Access
      {
        id: "mod-7",
        title: "Module 07 | Lifetime Access",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "sm-7-1",
            title: "Lifetime Access",
            lessons: [
              {
                id: "m7-1-les-1",
                title: "Lifetime Access",
                duration: "2:00",
                videoUrl: "",
                description: "Your lifetime access.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 20px; color: #25f4ee;">Congratulations!</p>
<p style="margin-bottom: 16px;">You now have your <strong style="color: #ffd700;">lifetime access</strong> to ProfitUp activated with the email you purchased.</p>
<p style="margin-bottom: 16px;">Enjoy a lifetime of services from our ProfitUp platform and make a lot of money.</p>
<div style="margin: 24px 0; text-align: center;"><img src="/images/lifetime-access.png" alt="Lifetime Access" style="max-width: 100%; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);"/></div>`,
              },
            ],
          },
          {
            id: "sm-7-2",
            title: "Support",
            lessons: [
              {
                id: "m7-2-les-1",
                title: "Support",
                duration: "2:00",
                videoUrl: "",
                description: "Contact support.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to the support area</p>
<p style="margin-bottom: 16px;">For us it is extremely important that each of you feel satisfied with the content presented, so if you have any concerns about any topic, please do not hesitate to communicate your request in this email.</p>
<p style="margin-bottom: 16px;">We will take 2-3 days to respond due to the high number of students, so we ask for a little patience.</p>
<p style="margin-bottom: 24px;"><a href="mailto:accesssupport.ai@gmail.com" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">EMAIL: accesssupport.ai@gmail.com</a></p>`,
              },
              {
                id: "m7-2-les-2",
                title: "Request Your Refund",
                duration: "2:00",
                videoUrl: "",
                description: "How to request refund.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Request Your Refund</p>
<p style="margin-bottom: 16px;">If you want to apply for the 15-day guarantee, you just need to fill out this small form by clicking on the following link:</p>
<p style="margin-bottom: 16px;">You just need to fill it out and the refund will be successfully processed, the money will be credited to your account on the next billing date of your credit card.</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfPghwgDAdFY6WgIRA1mrx8pYOrYAIsE9LlmnfszYhaT4VuvA/viewform" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">REQUEST REFUND</a></p>`,
              },
            ],
          },
        ],
      },
      // MODULE 08 | VIP Community
      {
        id: "mod-8",
        title: "Module 08 | VIP Community",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "sm-8-1",
            title: "VIP Community",
            lessons: [
              {
                id: "m8-1-les-1",
                title: "Private Group",
                duration: "2:00",
                videoUrl: "",
                description: "Join the VIP group.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to our VIP group.</p>
<p style="margin-bottom: 16px;">This group can only be accessed by people who have obtained their access pass, this channel will provide valuable information for the process of both financial and personal growth of each participant, remember that perseverance is the best tool for success.</p>
<p style="margin-bottom: 16px; font-weight: 600;">See you on the other side:</p>
<p style="margin-bottom: 24px;"><a href="https://telegram.me/+DCjkRmAnYgAxZGRh" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">CLICK HERE - JOIN TELEGRAM</a></p>`,
              },
              {
                id: "m8-1-les-2",
                title: "Support",
                duration: "2:00",
                videoUrl: "",
                description: "Contact support.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to the support area</p>
<p style="margin-bottom: 16px;">For us it is extremely important that each of you feel satisfied with the content presented, so if you have any concerns about any topic, please do not hesitate to communicate your request in this email.</p>
<p style="margin-bottom: 16px;">We will take 2-3 days to respond due to the high number of students, so we ask for a little patience.</p>
<p style="margin-bottom: 24px;"><a href="mailto:accesssupport.ai@gmail.com" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">EMAIL: accesssupport.ai@gmail.com</a></p>`,
              },
              {
                id: "m8-1-les-3",
                title: "Request Your Refund",
                duration: "2:00",
                videoUrl: "",
                description: "How to request refund.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Request Your Refund</p>
<p style="margin-bottom: 16px;">If you want to apply for the 15-day guarantee, you just need to fill out this small form by clicking on the following link:</p>
<p style="margin-bottom: 16px;">You just need to fill it out and the refund will be successfully processed, the money will be credited to your account on the next billing date of your credit card.</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfPghwgDAdFY6WgIRA1mrx8pYOrYAIsE9LlmnfszYhaT4VuvA/viewform" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">REQUEST REFUND</a></p>`,
              },
            ],
          },
        ],
      },
      // MODULE 09 | ProfiUp Bonus Program
      {
        id: "mod-9",
        title: "ProfiUp 09 | Bonus Program",
        subtitle: "10 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "sm-9-1",
            title: "Getting Started",
            lessons: [
              { id: "m9-1-les-1", title: "How to open your account within the Broker", duration: "8:00", videoUrl: "https://www.youtube.com/embed/ij0hfDimOwc", description: "Open broker account.", contentType: "video" },
              {
                id: "m9-1-les-2",
                title: "Support Center",
                duration: "2:00",
                videoUrl: "",
                description: "Support information.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Dear Profitok Users,</p>
<p style="margin-bottom: 16px;">Welcome to the Profitok Support Center! We're dedicated to ensuring your experience with Profitok is seamless. Whether you have questions, encounter technical issues, or seek guidance on maximizing features, our team is here to assist you.</p>
<p style="margin-bottom: 16px;"><strong style="color: #25f4ee;">How to Reach Us:</strong> For inquiries, assistance, or feedback, please contact us via email at <a href="mailto:accesssupport.ai@gmail.com" style="color: #fe2c55; font-weight: 600;">accesssupport.ai@gmail.com</a></p>
<p style="margin-bottom: 16px;">Our support team operates <strong>Monday to Friday, from 9:00 AM to 6:00 PM</strong>, and we aim to respond promptly to all inquiries during these hours.</p>
<p style="margin-bottom: 16px;"><strong style="color: #ffd700;">Feedback:</strong> Your input is invaluable to us as we strive to enhance Profitok continuously. Whether it's suggestions for new features or improvements to existing ones, we'd love to hear from you.</p>
<p style="margin-top: 24px; color: rgba(255,255,255,0.7);">Thank you for choosing Profitok.<br/>Best Regards,<br/><strong style="color: #fff;">Profitok Support Team</strong></p>`,
              },
            ],
          },
          {
            id: "sm-9-2",
            title: "Earn $20 right now...",
            lessons: [
              {
                id: "m9-2-les-1",
                title: "Fill out this form and earn $35",
                duration: "3:00",
                videoUrl: "",
                description: "Earn $35 by filling the form.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Welcome to module 1.1</p>
<p style="margin-bottom: 16px;">We invite you to fill out this short form. We recommend you fill out this form when you finish consuming the program, so you can give us your opinion of its content.</p>
<p style="margin-bottom: 16px; color: #ffd700; font-weight: 600;">After filling out the form we will personally send you $20 dollars to your PayPal account...</p>
<p style="margin-bottom: 16px;">But be patient, as the money will arrive in the next 4-6 days.</p>
<p style="margin-bottom: 24px;"><a href="https://docs.google.com/forms/d/e/1FAIpQLSfkx5C-MJOG1ONNzw8PrxKjmrH5Z5UzL5qG0VFt8N-Zkkky7A/viewform" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">FILL UP THE FORM HERE</a></p>`,
              },
            ],
          },
          {
            id: "sm-9-3",
            title: "Broker Setup",
            lessons: [
              { id: "m9-3-les-1", title: "How to Open Your Account with the Broker", duration: "10:00", videoUrl: "https://www.youtube.com/embed/e2rwFyC124k", description: "Open broker account.", contentType: "video" },
              { id: "m9-3-les-2", title: "How to deposit within the Broker", duration: "8:00", videoUrl: "https://www.youtube.com/embed/kDvcX8ktL8I", description: "Make deposits.", contentType: "video" },
              { id: "m9-3-les-3", title: "How to Set Up Your Account with the Broker", duration: "9:00", videoUrl: "https://www.youtube.com/embed/H7Bc1gmMGMU", description: "Account setup.", contentType: "video" },
              { id: "m9-3-les-4", title: "How to activate the Ganatic", duration: "7:00", videoUrl: "https://www.youtube.com/embed/Y_tpSuwdHR0", description: "Activate Ganatic.", contentType: "video" },
              { id: "m9-3-les-5", title: "How to make your deposit in Ganatic", duration: "6:00", videoUrl: "https://www.youtube.com/embed/5nPS4jbEVzo", description: "Deposit in Ganatic.", contentType: "video" },
              { id: "m9-3-les-6", title: "How to track your earnings in Ganatic", duration: "5:00", videoUrl: "https://www.youtube.com/embed/ATaM8P4TG2o", description: "Track earnings.", contentType: "video" },
              { id: "m9-3-les-7", title: "How to withdraw your money from Ganatic", duration: "8:00", videoUrl: "https://www.youtube.com/embed/WXZ39W0VNaE", description: "Withdraw money.", contentType: "video" },
            ],
          },
        ],
      },
    ],
  },
  // TIKCASH COMMUNITY COURSE
  {
id: "tikcash-community",
    title: "TikCash Community",
    subtitle: "4 modules",
    description: "Master online sales and build your online empire",
    thumbnail: "/images/modules/tikcash-community.jpg",
    image: "/images/modules/tikcash-community.jpg",
    instructor: "TikCash Team",
    instructorAvatar: "/images/users/1.jpg",
    category: "Sales",
    totalLessons: 45,
    totalDuration: "8h+",
    progress: 0,
    tags: ["TikCash", "Shop", "Community", "Sales"],
    modules: [
      // TC MODULE 1 - Online Shop Basics
      {
        id: "tc-mod-1",
        title: "Module 01 | Online Shop Basics",
        subtitle: "5 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "tc-sm-1-1",
            title: "Getting Started with Online Shop",
            lessons: [
              {
                id: "tc-1-les-1",
                title: "How to Use TikCash Tools to Make Money with Surveys",
                duration: "15:00",
                videoUrl: "",
                description: "Make money with surveys on Online Shop.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Yes, you read that right:</p>
<p style="margin-bottom: 16px;">You can make money with surveys and interactive content on Online Shop.</p>
<p style="margin-bottom: 16px;">But we're not talking about external surveys that pay pennies... we're talking about how to use interaction within TikCash to drive traffic and convert into real sales.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to do it strategically.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1mk_MH8PR7AO1f8sH8QoJcfPA2JvnubrJ/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-1-les-2",
                title: "How to Use TikCash Tools with Social Proof",
                duration: "15:00",
                videoUrl: "",
                description: "Use social proof to convert sales.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Yes, you read that right:</p>
<p style="margin-bottom: 16px;">You can make money with surveys and interactive content on Online Shop.</p>
<p style="margin-bottom: 16px;">But we're not talking about external surveys that pay pennies... we're talking about how to use interaction within TikCash to attract traffic and convert into real sales.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to do it strategically.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/u/0/d/1kQYDEQKUggu5-6in3Kl7U1yjr5d2Cczd/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-1-les-3",
                title: "How to Create More Videos in Less Time",
                duration: "12:00",
                videoUrl: "",
                description: "Create more content efficiently.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Create More Videos for Online Shop in Less Time</p>
<p style="margin-bottom: 16px;">Now that you understand it's possible to make money with Online Shop, the next step is this: create more content, in less time, and with better results.</p>
<p style="margin-bottom: 16px;">Because it's not just about uploading videos. It's about doing it strategically and sustainably.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, I'm going to show you how to achieve that.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/u/0/d/1QgSh4L7WKQ0-3g-YHHPas7ZNaL9Fbrj4/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-1-les-4",
                title: "The Best Time to Post on Online Shop",
                duration: "18:00",
                videoUrl: "",
                description: "Optimize your posting schedule.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">The Best Time to Post on Online Shop and Increase Sales</p>
<p style="margin-bottom: 16px;">In this class, you'll learn step by step what Online Shop is and why it has become one of the most powerful platforms for selling products online.</p>
<p style="margin-bottom: 16px;">I'll show you how to create your store, upload your products, the best strategies to leverage the algorithm, and how to make videos that truly sell.</p>
<p style="margin-bottom: 16px;">In addition, you'll discover current trends, real success stories, and tricks to boost your sales organically and quickly.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">If you want to tap into TikCash's potential to make money, this class is for you.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/12Qoic-msAY56dUDjTkgHYAIowql6l2ER/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-1-les-5",
                title: "Make Money Without Showing Your Face",
                duration: "14:00",
                videoUrl: "",
                description: "No face, no problem - make money anyway.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Make Money on Online Shop Without Showing Your Face</p>
<p style="margin-bottom: 16px;">Yes, it's possible. You can make money every day with Online Shop without showing your face, without speaking, without recording yourself directly.</p>
<p style="margin-bottom: 16px;">And no, it's not magic. <strong style="color: #25f4ee;">It's strategy.</strong></p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to do it step by step.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/u/0/d/13XaRF0NPJYqmFP-Oml7F0Q4w4de2riqs/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
            ],
          },
        ],
      },
      // TC MODULE 2 - Going Viral
      {
        id: "tc-mod-2",
        title: "Module 02 | Going Viral",
        subtitle: "5 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "tc-sm-2-1",
            title: "Viral Strategies",
            lessons: [
              {
                id: "tc-2-les-1",
                title: "Create a Sustainable Routine for Online Shop",
                duration: "12:00",
                videoUrl: "",
                description: "Build a consistent routine.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Create a Routine to Make Money with Online Shop</p>
<p style="margin-bottom: 16px;">This is one of the most common mistakes people make when starting on Online Shop: <strong>Not having a clear routine.</strong></p>
<p style="margin-bottom: 16px;">They post whenever they can. They edit in a rush. And they keep jumping from one idea to another without tracking results.</p>
<p style="margin-bottom: 16px; color: #fe2c55;">The problem? That doesn't generate consistent income.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, I'm going to show you how to create a simple and effective routine to sell every day in an organized way.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/u/0/d/11dEZYc74gb-yV8KVlIL2jjTj9YzlbFZ7/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-2-les-2",
                title: "Make $20 in 12 Minutes - Myth or Reality?",
                duration: "10:00",
                videoUrl: "",
                description: "The truth about quick money.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Make $20 in 12 Minutes with Online Shop? Myth or Reality</p>
<p style="margin-bottom: 16px;">You've probably seen promises like: "Make $20 in just 12 minutes with this app!"</p>
<p style="margin-bottom: 16px;">And yes... it sounds like hype. But on Online Shop, there's a hidden truth:</p>
<p style="margin-bottom: 16px; color: #ffd700; font-weight: 600;">You can make $20 or more with a single video.</p>
<p style="margin-bottom: 16px;">Not in exactly 12 minutes, but with quick, well-thought-out content and the right product.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, we're going to separate the myths from the real strategy.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/131RQVqTW_qEvN-VIwX9MHBFMGo1RGG97/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-2-les-3",
                title: "The Secret of 0 Followers, 1 Million Views",
                duration: "14:00",
                videoUrl: "",
                description: "Go viral without being known.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Go Viral Without Being Known</p>
<p style="margin-bottom: 16px;">Yes. It's possible. You upload a video on TikCash. You have no followers. No one knows you. Zero authority.</p>
<p style="margin-bottom: 16px;">And still... that video can blow up. <strong style="color: #ffd700;">100K. 500K. 1 million views.</strong></p>
<p style="margin-bottom: 16px;">That doesn't happen on Instagram. It doesn't happen on YouTube. But on TikCash... it does.</p>
<p style="margin-bottom: 16px; font-weight: 600;">And today you're going to understand why.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/15BYE_IDzYYYrjMTCQkDrISe4uBaK4UIl/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-2-les-4",
                title: "Anatomy of a Viral TikCash",
                duration: "15:00",
                videoUrl: "",
                description: "Structure videos that blow up.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Anatomy of a Viral TikCash: How to Structure Videos That Blow Up</p>
<p style="margin-bottom: 16px;">Viral isn't magic. <strong style="color: #25f4ee;">It's a formula.</strong></p>
<p style="margin-bottom: 16px;">And even though it might seem like some videos "just blew up," deep down all viral TikCashs share a similar structure.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to identify it, build it... and replicate it.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1GWefCv_a5QVtRGZ_p0guBp_TVdqWpsh4/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-2-les-5",
                title: "How to Make the Algorithm Love You",
                duration: "16:00",
                videoUrl: "",
                description: "7 signals TikCash detects.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">7 Signals TikCash Detects</p>
<p style="margin-bottom: 16px;">Yes, TikCash "sees" your videos. But more importantly: it interprets how people react to them.</p>
<p style="margin-bottom: 16px;">And based on that, it decides: "Do we show it to 100 more people? Or do we bury it?"</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #fe2c55;">Today, you're going to discover the 7 signals the algorithm loves — and how to activate them in every video.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/12JCPy1Jt2Dh_SSrgq3kiikOIHJ6K2fka/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
            ],
          },
        ],
      },
      // TC MODULE 3 - Content Creation Mastery
      {
        id: "tc-mod-3",
        title: "Module 03 | Content Creation Mastery",
        subtitle: "6 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "tc-sm-3-1",
            title: "Advanced Content Strategies",
            lessons: [
              {
                id: "tc-3-les-1",
                title: "Videos That Sell: Turn Views into Money",
                duration: "14:00",
                videoUrl: "",
                description: "Convert views into clicks and money.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Videos That Sell: How to Turn Views into Clicks, Messages, and Money</p>
<p style="margin-bottom: 16px;">Views don't pay the bills. <strong style="color: #ffd700;">What matters is turning attention into action.</strong></p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to use TikCash to sell without looking like a salesperson — in a natural, effective, and direct way.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/u/0/d/1iwloAxPoy3Khz-QCUHw3jASV8OMd-osf/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-3-les-2",
                title: "TikCash Without Showing Your Face",
                duration: "12:00",
                videoUrl: "",
                description: "Grow automatically with voice and text.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">TikCash Without Showing Your Face</p>
<p style="margin-bottom: 16px;">Don't like being on camera? Don't like talking? Don't want to show your face?</p>
<p style="margin-bottom: 16px; color: #25f4ee; font-weight: 600;">Good news: you don't have to.</p>
<p style="margin-bottom: 16px;">TikCash allows you to grow automatically if you use the right tools.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, I'll show you how to create viral content without ever showing up.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1A9ImOa8uK7Ye3jgqHDhBy8G_Bo_UtDJ0/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-3-les-3",
                title: "The 1-3-1 Method for Viral Videos",
                duration: "15:00",
                videoUrl: "",
                description: "Produce viral videos without burning out.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Creatives That Blow Up: The 1-3-1 Method</p>
<p style="margin-bottom: 16px;">Creating content every day can be exhausting. Most people quit TikCash not because they lack ideas, but because they lack a system.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">Today, I'll teach you the 1-3-1 method, a simple formula to create, organize, and publish viral content without burning out.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1EeYhz6ZNobT4Mgg6cetgS4GIzrkpvVCN/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-3-les-4",
                title: "The Power of Smart Consistency",
                duration: "13:00",
                videoUrl: "",
                description: "Posting every day isn't enough.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">The Power of Smart Consistency</p>
<p style="margin-bottom: 16px;">Everyone says: "Be consistent." But few explain how to be consistent <strong>strategically.</strong></p>
<p style="margin-bottom: 16px;">Posting every day won't help if your videos lack structure, fail to hold attention, or don't connect with the algorithm.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to apply smart consistency.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1zb7rGRvnT5MY8ji1Z2Qg8sk4x7YgSZMN/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-3-les-5",
                title: "Trends vs Authority",
                duration: "12:00",
                videoUrl: "",
                description: "Use trends without losing your essence.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Trends vs Authority</p>
<p style="margin-bottom: 16px;">TikCash loves trends. And yes, using them can give you a massive boost in views.</p>
<p style="margin-bottom: 16px; color: #fe2c55;">But here's the problem: Many creators get lost in the trends. They become just another face. They lose their voice. They lose their authority.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to use trends to your advantage without losing what makes you unique.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1plY1o732fxF646HXCpjWDO1PCLEKbj1I/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-3-les-6",
                title: "Invisible Script Content",
                duration: "14:00",
                videoUrl: "",
                description: "Seem spontaneous while being strategic.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Invisible Script Content</p>
<p style="margin-bottom: 16px;">"That creator seems so natural..." "They talk like they didn't plan anything..."</p>
<p style="margin-bottom: 16px; color: #25f4ee; font-weight: 600;">Wrong.</p>
<p style="margin-bottom: 16px;">The best "natural" videos are 100% planned.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to write a script that doesn't feel like a script, but keeps viewers hooked until the end.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1gzs0-sYhK_TOHdvhLifrpz1lgZDNv_5P/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
            ],
          },
        ],
      },
      // TC MODULE 4 - Building Your Empire
      {
        id: "tc-mod-4",
        title: "Module 04 | Building Your Empire",
        subtitle: "4 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "tc-sm-4-1",
            title: "Scale Your Success",
            lessons: [
              {
                id: "tc-4-les-1",
                title: "The Routine of High-Earning TikCashers",
                duration: "16:00",
                videoUrl: "",
                description: "How successful TikCashers organize their day.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">The Routine of High-Earning TikCashers</p>
<p style="margin-bottom: 16px;">You see them on screen. They grow, they sell, they go viral. Looks easy, right?</p>
<p style="margin-bottom: 16px;">But what you don't see... is the routine behind it.</p>
<p style="margin-bottom: 16px; color: #ffd700;">Because no one makes money on TikCash just by randomly posting videos. There's a method. There's discipline. There's focus.</p>
<p style="margin-bottom: 16px; font-weight: 600;">And in this lesson, I'm going to show you exactly that.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/15LsMnFl0oQsL_qshcccXaWjxSCvbc7KV/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-4-les-2",
                title: "How to Analyze Your Metrics",
                duration: "14:00",
                videoUrl: "",
                description: "Make smart decisions without going crazy.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Analyze Your Metrics Without Going Crazy</p>
<p style="margin-bottom: 16px;">TikCash gives you numbers. Lots of them.</p>
<p style="margin-bottom: 16px;">But if you don't know how to read them, they confuse you more than they help.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #25f4ee;">Today, you're going to learn how to look at your metrics like an expert. Fast. Clear. Impactful.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1UMga7bqDjbj6xd5SeNcM0QQOzjQSxINU/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #25f4ee 0%, #00c4b8 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-4-les-3",
                title: "Design Your Content Calendar",
                duration: "15:00",
                videoUrl: "",
                description: "Grow without burning out.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Design Your Content Calendar to Grow Without Burning Out</p>
<p style="margin-bottom: 16px;">Posting every day... sounds crazy, right? And if you do it without a strategy, it is crazy.</p>
<p style="margin-bottom: 16px;">But when you have a content calendar, everything changes.</p>
<p style="margin-bottom: 16px;">No more improvising. No more creative blocks. No more pressure of "What do I post today?"</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">Today, I'm going to teach you how to build the system used by those who truly grow.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1thDZh8tUtDfVwTLftqdWsN8zkU7v-ER_/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #ff9500 100%); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
              {
                id: "tc-4-les-4",
                title: "How to Build a Real Community",
                duration: "18:00",
                videoUrl: "",
                description: "Stop talking to yourself.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Build a Real Community</p>
<p style="margin-bottom: 16px;">Posting on TikCash isn't just about uploading videos. It's about building a relationship. A community.</p>
<p style="margin-bottom: 16px;">Because if no one comments... If no one responds... If no one waits for your next content...</p>
<p style="margin-bottom: 16px; color: #fe2c55;">Then you don't have an audience. You have a number.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Today, you're going to learn how to stop speaking into the void and start building a real base of people who follow you, respect you, and recommend you.</p>
<p style="margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1dbkFJw7zjonK93Kr5M3V1V7RgVQ-IRka/view" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #fe2c55 0%, #ff4070 100%); color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 16px;">WATCH LESSON</a></p>`,
              },
            ],
          },
        ],
      },
    ],
  },
  // MONEY ROBOT COURSE
  {
    id: "money-robot",
    title: "Money Robot",
    subtitle: "6 modules - 18 lessons",
    description: "Automated online income generation system",
    thumbnail: "/images/modules/money-robot.jpg",
    image: "/images/modules/money-robot.jpg",
    instructor: "Money Robot Team",
    instructorAvatar: "/images/avatar-default.png",
    category: "Automation",
    totalLessons: 18,
    totalDuration: "4h 45m",
    progress: 0,
    tags: ["Automation", "Income", "Money", "Passive"],
    modules: [
      // MR MODULE 1 - Welcome and Mindset
      {
        id: "mr-mod-1",
        title: "Module 01 | Welcome and Mindset",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-1-1",
            title: "Getting Started",
            lessons: [
              {
                id: "mr-1-les-1",
                title: "Introduction to the Course and The Method",
                duration: "10:00",
                videoUrl: "",
                description: "Welcome to Money Robot.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 20px; color: #ffd700;">WELCOME TO THE "MONEY ROBOT" COURSE</p>
<p style="margin-bottom: 16px;">Your gateway to a new era of automated online income generation.</p>
<p style="margin-bottom: 16px;">Here you will discover how to build a real system that works for you, even while you sleep. And the best part: <strong style="color: #25f4ee;">you don't need to be a tech expert.</strong></p>
<p style="margin-bottom: 16px;">In this course, you will not only learn how to make money, but how to do it in a smart, scalable, and, above all, sustainable way.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Our method is based on three pillars:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #fe2c55;">Focus</li>
<li style="margin-bottom: 8px; color: #25f4ee;">Automation</li>
<li style="margin-bottom: 8px; color: #ffd700;">Consistency</li>
</ul>
<p style="margin-bottom: 16px;">You will learn to use simple tools to automate repetitive tasks, find reliable sources of online income, and scale your results without depending on daily manual work.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">At the end of the course, you will have a profit machine working 24/7 on autopilot.</p>`,
              },
              {
                id: "mr-1-les-2",
                title: "How Automated Income Works in Practice",
                duration: "12:00",
                videoUrl: "",
                description: "Understanding automated income.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How Automated Income Works in Practice</p>
<p style="margin-bottom: 16px;">Automated income is nothing more than a digital system that generates profits without your constant presence. You set it up once and leave it running.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #25f4ee;">Practical Example:</p>
<p style="margin-bottom: 16px;">You share an affiliate link with the help of a bot that automatically posts it in groups. If someone buys, you earn — even without being connected. It's that simple.</p>
<p style="margin-bottom: 16px; font-weight: 600;">This applies to several areas:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px;">Automated microtasks</li>
<li style="margin-bottom: 8px;">Promotional bots</li>
<li style="margin-bottom: 8px;">Automation with Zapier or IFTTT</li>
<li style="margin-bottom: 8px;">Faceless channels</li>
<li style="margin-bottom: 8px;">Complete sales flows with traffic and pages</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">What do all these models have in common? You set up a structure once... and you reap the benefits for weeks, months, or even years.</p>`,
              },
              {
                id: "mr-1-les-3",
                title: "Growth Mindset and Discipline",
                duration: "15:00",
                videoUrl: "",
                description: "Mindset for consistent results.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Growth Mindset and Discipline for Consistent Results</p>
<p style="margin-bottom: 16px;">Here is the point that separates those who are successful from those who just watch videos on YouTube without making any progress: <strong style="color: #fe2c55;">mindset and discipline.</strong></p>
<p style="margin-bottom: 16px;">The Money Robot is not magic. It is a system. And systems require execution.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You must treat this as a serious project. That means:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px;">Creating a routine</li>
<li style="margin-bottom: 8px;">Dedicating at least one hour a day</li>
<li style="margin-bottom: 8px;">Following the modules step by step</li>
<li style="margin-bottom: 8px;">Implementing — even if it seems simple</li>
</ul>
<p style="margin-bottom: 16px; color: #ffd700;">Discipline is doing the basics well, every day. A growth mindset is understanding that maybe the first few days won't yield immediate results, but with consistency, the gains will accumulate.</p>
<p style="margin-bottom: 16px; font-weight: 600;">If you treat this like a business, even if it's digital, the rewards will come.</p>`,
              },
            ],
          },
        ],
      },
      // MR MODULE 2 - Fundamentals of Income Automation
      {
        id: "mr-mod-2",
        title: "Module 02 | Fundamentals of Automation",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-2-1",
            title: "Automation Basics",
            lessons: [
              {
                id: "mr-2-les-1",
                title: "What is Automation and Why Does It Multiply Results?",
                duration: "12:00",
                videoUrl: "",
                description: "Understanding automation power.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">What is Automation and Why Does It Multiply Your Results?</p>
<p style="margin-bottom: 16px;">Automation is the art of putting tasks on autopilot. It is doing something once, setting it up, and letting it run — without repeating it every day.</p>
<p style="margin-bottom: 16px;">In the digital world, that changes everything. Instead of spending hours posting, registering products, or monitoring platforms, you let a system or tool do it for you.</p>
<p style="margin-bottom: 16px; color: #25f4ee; font-weight: 600;">This means that while you sleep, work, or go to the supermarket, your system continues to operate.</p>
<p style="margin-bottom: 16px;">You gain time. And free time equals more results or a better quality of life.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">Automation doesn't replace you — it empowers you. And that's exactly what will allow you to grow, scale, and maintain a steady income without burning out.</p>`,
              },
              {
                id: "mr-2-les-2",
                title: "Common Mistakes That Sabotage Online Income",
                duration: "14:00",
                videoUrl: "",
                description: "Avoid these costly mistakes.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Common Mistakes That Sabotage Online Income (And How to Avoid Them)</p>
<p style="margin-bottom: 16px; color: #fe2c55; font-weight: 600;">One of the biggest enemies of those who want to make money online is anxiety.</p>
<p style="margin-bottom: 16px;">Changing your strategy every week, trying to do a thousand things at once, starting without studying anything — all of that destroys any project.</p>
<p style="margin-bottom: 16px;">Another mistake is wanting to do everything manually. That limits your income. You can't scale up because you only have 24 hours in a day.</p>
<p style="margin-bottom: 16px;">And finally, there is the mistake of trusting any platform or magical promise.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #25f4ee;">Here you will learn how to avoid these traps. With focus, study, and practical application, it is possible to live off online income — but with method. And that is what we are building together.</p>`,
              },
              {
                id: "mr-2-les-3",
                title: "Building Your Foundation",
                duration: "10:00",
                videoUrl: "",
                description: "Setting up for success.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Building Your Foundation for Success</p>
<p style="margin-bottom: 16px;">With focus, study, and practical application, it is possible to live off online income — but with method.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Key principles to remember:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #ffd700;">Focus on one strategy at a time</li>
<li style="margin-bottom: 8px; color: #25f4ee;">Automate repetitive tasks</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Trust verified platforms only</li>
<li style="margin-bottom: 8px;">Track your results consistently</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">And that is what we are building together.</p>`,
              },
            ],
          },
        ],
      },
      // MR MODULE 3 - Finding Opportunities
      {
        id: "mr-mod-3",
        title: "Module 03 | Finding Opportunities",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-3-1",
            title: "Income Opportunities",
            lessons: [
              {
                id: "mr-3-les-1",
                title: "Common Mistakes Continued",
                duration: "10:00",
                videoUrl: "",
                description: "More mistakes to avoid.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Common Mistakes That Sabotage Online Income</p>
<p style="margin-bottom: 16px; color: #fe2c55; font-weight: 600;">One of the biggest enemies of those who want to make money online is anxiety.</p>
<p style="margin-bottom: 16px;">Changing your strategy every week, trying to do a thousand things at once, starting without studying anything — all of that destroys any project.</p>
<p style="margin-bottom: 16px;">Another mistake is wanting to do everything manually. That limits your income. You can't scale up because you only have 24 hours in a day.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #25f4ee;">Here you will learn how to avoid these traps. With focus, study, and practical application, it is possible to live off online income — but with method.</p>`,
              },
              {
                id: "mr-3-les-2",
                title: "How to Identify the Best Opportunities",
                duration: "15:00",
                videoUrl: "",
                description: "Find opportunities for your profile.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Identify the Best Opportunities for Your Profile</p>
<p style="margin-bottom: 16px;">Not all platforms work the same for everyone. The trick is to understand your skills, your availability, and your motivation.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Here we teach you how to analyze:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #ffd700;">Your level of experience (beginner, intermediate, or advanced)</li>
<li style="margin-bottom: 8px; color: #25f4ee;">What type of tasks you enjoy most</li>
<li style="margin-bottom: 8px; color: #fe2c55;">What profile the platforms are looking for (age, country, occupation)</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This way you can choose the opportunities that will give you the fastest return — and that you can automate later.</p>`,
              },
              {
                id: "mr-3-les-3",
                title: "Matching Your Skills to Platforms",
                duration: "12:00",
                videoUrl: "",
                description: "Find your perfect match.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Matching Your Skills to Platforms</p>
<p style="margin-bottom: 16px;">Not all platforms work the same for everyone. The trick is to understand your skills, your availability, and your motivation.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Key factors to consider:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px;">Your level of experience</li>
<li style="margin-bottom: 8px;">What type of tasks you enjoy most</li>
<li style="margin-bottom: 8px;">What profile the platforms are looking for</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #25f4ee;">This way you can choose the opportunities that will give you the fastest return — and that you can automate later.</p>`,
              },
            ],
          },
        ],
      },
      // MR MODULE 4 - Automating Simple Tasks
      {
        id: "mr-mod-4",
        title: "Module 04 | Automating Tasks",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-4-1",
            title: "Task Automation",
            lessons: [
              {
                id: "mr-4-les-1",
                title: "Introduction to Automation Without Programming",
                duration: "15:00",
                videoUrl: "",
                description: "Zapier, IFTTT, and Extensions.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Introduction to Automation Without Programming</p>
<p style="margin-bottom: 16px; color: #25f4ee; font-weight: 600;">The good news is that today you can automate many things without knowing how to program.</p>
<p style="margin-bottom: 16px;"><strong>Zapier</strong> and <strong>IFTTT</strong> are two tools that allow you to connect apps and create automations.</p>
<p style="margin-bottom: 16px;">For example: When a new offer is published, you can receive an instant notification or publish it automatically on social media.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You can also use extensions such as:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #ffd700;">Auto Text Expander</li>
<li style="margin-bottom: 8px; color: #fe2c55;">TextBlaze</li>
</ul>
<p style="margin-bottom: 16px;">To complete forms and repetitive tasks with one click.</p>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This is your first step to letting the robot work for you.</p>`,
              },
              {
                id: "mr-4-les-2",
                title: "Automating Records and Monitoring",
                duration: "12:00",
                videoUrl: "",
                description: "Track opportunities automatically.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Automating Records and Monitoring Opportunities</p>
<p style="margin-bottom: 16px; font-weight: 600;">Here you will learn to:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Create automatic alerts for new opportunities on freelance platforms</li>
<li style="margin-bottom: 8px; color: #ffd700;">Use Google Forms + Spreadsheets to track your tasks and results</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Automate account registrations with simple extensions or scripts</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">All of this saves you hours of manual work and keeps your tasks organized.</p>`,
              },
              {
                id: "mr-4-les-3",
                title: "Automating Link and Content Dissemination",
                duration: "14:00",
                videoUrl: "",
                description: "Automate your content distribution.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Automating the Dissemination of Links and Content</p>
<p style="margin-bottom: 16px;">If you use affiliate marketing, content, or digital products, you will love this lesson.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You will learn how to automate:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Posting in groups or channels with bots (Telegram, Discord, Facebook)</li>
<li style="margin-bottom: 8px; color: #ffd700;">Sending automated emails with free tools such as Mailerlite</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Scheduling content on social media with platforms such as Buffer or Metricool</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">Once implemented, your content continues to work for you while you do other things.</p>`,
              },
            ],
          },
        ],
      },
      // MR MODULE 5 - Multiplying Profits
      {
        id: "mr-mod-5",
        title: "Module 05 | Multiplying Profits",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-5-1",
            title: "Advanced Strategies",
            lessons: [
              {
                id: "mr-5-les-1",
                title: "Automating Content Distribution",
                duration: "12:00",
                videoUrl: "",
                description: "Advanced content automation.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Automating the Dissemination of Links and Content</p>
<p style="margin-bottom: 16px;">If you use affiliate marketing, content, or digital products, you will love this lesson.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You will learn how to automate:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Posting in groups or channels with bots</li>
<li style="margin-bottom: 8px; color: #ffd700;">Sending automated emails</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Scheduling content on social media</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">Once implemented, your content continues to work for you while you do other things.</p>`,
              },
              {
                id: "mr-5-les-2",
                title: "Managing Multiple Income Sources",
                duration: "15:00",
                videoUrl: "",
                description: "Diversify with balance.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Managing Multiple Sources of Income</p>
<p style="margin-bottom: 16px; color: #fe2c55; font-weight: 600;">Don't put all your eggs in one basket.</p>
<p style="margin-bottom: 16px;">Here you will see how to diversify with balance.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You will learn to:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Monitor results from each source with simple dashboards</li>
<li style="margin-bottom: 8px; color: #ffd700;">Set alerts for downtime or blockages</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Create weekly routines to optimize each channel without overloading</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This keeps your operation sustainable and with less risk.</p>`,
              },
              {
                id: "mr-5-les-3",
                title: "Scaling Your Income",
                duration: "14:00",
                videoUrl: "",
                description: "Take it to the next level.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Scaling Your Income</p>
<p style="margin-bottom: 16px;">Don't put all your eggs in one basket. Here you will see how to diversify with balance.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Key strategies:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Monitor results from each source</li>
<li style="margin-bottom: 8px; color: #ffd700;">Set alerts for issues</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Create weekly optimization routines</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This keeps your operation sustainable and with less risk.</p>`,
              },
            ],
          },
        ],
      },
      // MR MODULE 6 - Optimizing Results
      {
        id: "mr-mod-6",
        title: "Module 06 | Optimizing Results",
        subtitle: "3 lessons",
        comingSoon: false,
        subModules: [
          {
            id: "mr-sm-6-1",
            title: "Optimization",
            lessons: [
              {
                id: "mr-6-les-1",
                title: "How to Measure and Track Your Profits",
                duration: "12:00",
                videoUrl: "",
                description: "Track your income effectively.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">How to Measure and Track Your Profits</p>
<p style="margin-bottom: 16px; color: #fe2c55; font-weight: 600;">You can't improve what you don't measure.</p>
<p style="margin-bottom: 16px;">This lesson is about how to track your daily, weekly, and monthly income with simple tools such as spreadsheets or free dashboards.</p>
<p style="margin-bottom: 16px; font-weight: 600;">You will learn:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #25f4ee;">Which source generates the most money</li>
<li style="margin-bottom: 8px; color: #ffd700;">How much you are actually earning (after commissions and expenses)</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Which activities have the best return on time invested</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">With this visibility, you can make smarter decisions about what to scale or adjust.</p>`,
              },
              {
                id: "mr-6-les-2",
                title: "Adjusting Strategies to Increase Earnings",
                duration: "14:00",
                videoUrl: "",
                description: "Optimize for maximum profit.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Adjusting Strategies to Increase Your Earnings</p>
<p style="margin-bottom: 16px;">Making money online is not static. Platforms, rules, and competition are constantly changing.</p>
<p style="margin-bottom: 16px; color: #25f4ee; font-weight: 600;">That is why it is vital to review your results weekly.</p>
<p style="margin-bottom: 16px; font-weight: 600;">In this lesson, you will learn how to:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #ffd700;">Detect which strategy is working best</li>
<li style="margin-bottom: 8px; color: #25f4ee;">Eliminate or pause what is not bringing returns</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Try small improvements (A/B testing on titles, images, descriptions)</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This way you stay up to date and maximize your profitability.</p>`,
              },
              {
                id: "mr-6-les-3",
                title: "Continuous Improvement and Scaling",
                duration: "15:00",
                videoUrl: "",
                description: "Keep growing your income.",
                contentType: "text",
                textContent: `<p style="margin-bottom: 16px; font-weight: 600; font-size: 18px;">Continuous Improvement and Scaling</p>
<p style="margin-bottom: 16px;">Making money online is not static. Platforms, rules, and competition are constantly changing.</p>
<p style="margin-bottom: 16px; color: #fe2c55; font-weight: 600;">That is why it is vital to review your results weekly.</p>
<p style="margin-bottom: 16px; font-weight: 600;">Final tips:</p>
<ul style="margin-bottom: 16px; padding-left: 20px;">
<li style="margin-bottom: 8px; color: #ffd700;">Detect which strategy is working best</li>
<li style="margin-bottom: 8px; color: #25f4ee;">Eliminate or pause what is not bringing returns</li>
<li style="margin-bottom: 8px; color: #fe2c55;">Try small improvements with A/B testing</li>
</ul>
<p style="margin-bottom: 16px; font-weight: 600; color: #ffd700;">This way you stay up to date and maximize your profitability. Congratulations on completing the Money Robot course!</p>`,
              },
            ],
          },
        ],
      },
    ],
  },
];
