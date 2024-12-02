document.addEventListener("DOMContentLoaded", () => {
    const ums = new UniversityManagementSystem();

    // Handle Add Student Form
    document.getElementById("addStudentForm")?.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const fullName = (document.getElementById("fullName") as HTMLInputElement).value;
        const faculty = (document.getElementById("faculty") as HTMLSelectElement).value as Faculty;
        const year = parseInt((document.getElementById("year") as HTMLInputElement).value);
        const status = (document.getElementById("status") as HTMLSelectElement).value as StudentStatus;
        const groupNumber = (document.getElementById("groupNumber") as HTMLInputElement).value;

        ums.enrollStudent({
            fullName,
            faculty,
            year,
            status,
            enrollmentDate: new Date(),
            groupNumber,
        });
        alert("Student added successfully!");
    });

    // Handle Add Course Form
    document.getElementById("addCourseForm")?.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const name = (document.getElementById("courseName") as HTMLInputElement).value;
        const type = (document.getElementById("courseType") as HTMLSelectElement).value as CourseType;
        const credits = parseInt((document.getElementById("credits") as HTMLInputElement).value);
        const semester = (document.getElementById("semester") as HTMLSelectElement).value as Semester;
        const faculty = (document.getElementById("courseFaculty") as HTMLSelectElement).value as Faculty;
        const maxStudents = parseInt((document.getElementById("maxStudents") as HTMLInputElement).value);

        ums.addCourse({ name, type, credits, semester, faculty, maxStudents });
        alert("Course added successfully!");
    });

    // Handle Add Grade Form
    document.getElementById("addGradeForm")?.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const studentId = parseInt((document.getElementById("studentId") as HTMLInputElement).value);
        const courseId = parseInt((document.getElementById("courseId") as HTMLInputElement).value);
        const grade = parseInt((document.getElementById("grade") as HTMLSelectElement).value) as GradeValue;

        try {
            ums.setGrade(studentId, courseId, grade);
            alert("Grade added successfully!");
        } catch (error: any) {
            alert(error.message);
        }
    });
});


// Enums
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special",
}

enum Semester {
    First = "First",
    Second = "Second",
}

enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering",
}

// Interfaces
interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}

// University Management System Class
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private currentStudentId = 1;
    private currentCourseId = 1;

    // Enroll a new student
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent: Student = { id: this.currentStudentId++, ...student };
        this.students.push(newStudent);
        return newStudent;
    }

    // Register a student for a course
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student) throw new Error("Student not found");
        if (!course) throw new Error("Course not found");
        if (student.faculty !== course.faculty) {
            throw new Error("Student cannot register for a course from a different faculty");
        }

        const courseRegistrations = this.grades.filter(g => g.courseId === courseId);
        if (courseRegistrations.length >= course.maxStudents) {
            throw new Error("Course is full");
        }

        this.grades.push({
            studentId,
            courseId,
            grade: GradeValue.Unsatisfactory, // Default grade
            date: new Date(),
            semester: course.semester,
        });
    }

    // Set grade for a student in a course
    setGrade(studentId: number, courseId: number, grade: GradeValue): void {
        const gradeEntry = this.grades.find(
            g => g.studentId === studentId && g.courseId === courseId
        );
        if (!gradeEntry) throw new Error("Student is not registered for this course");
        gradeEntry.grade = grade;
    }

    // Update student status
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");
        if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
            throw new Error("Only active students can graduate");
        }
        student.status = newStatus;
    }

    // Get students by faculty
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(student => student.faculty === faculty);
    }

    // Get grades of a student
    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(grade => grade.studentId === studentId);
    }

    // Get available courses by faculty and semester
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(course => course.faculty === faculty && course.semester === semester);
    }

    // Calculate average grade of a student
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    // Get a list of top-performing students by faculty
    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students
            .filter(student => student.faculty === faculty)
            .filter(student => {
                const avgGrade = this.calculateAverageGrade(student.id);
                return avgGrade >= GradeValue.Excellent;
            });
    }

    // Add course (for simplicity)
    addCourse(course: Omit<Course, "id">): Course {
        const newCourse: Course = { id: this.currentCourseId++, ...course };
        this.courses.push(newCourse);
        return newCourse;
    }
}

// Example usage:
const ums = new UniversityManagementSystem();
const student = ums.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    enrollmentDate: new Date(),
    groupNumber: "CS-101",
});

const course = ums.addCourse({
    name: "Introduction to Programming",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30,
});

ums.registerForCourse(student.id, course.id);
ums.setGrade(student.id, course.id, GradeValue.Excellent);

console.log("Average Grade:", ums.calculateAverageGrade(student.id));
console.log("Top Students:", ums.getTopStudentsByFaculty(Faculty.Computer_Science));
