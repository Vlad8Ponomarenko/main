// Enum definitions
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

// Interface definitions
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

// Class implementation
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent = { ...student, id: this.studentIdCounter++ };
        this.students.push(newStudent);
        return newStudent;
    }

    registerForCourse(studentId: number, courseId: number): void {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) throw new Error("Course not found");
        
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");
        
        if (student.faculty !== course.faculty) {
            throw new Error("Student's faculty does not match the course's faculty");
        }

        const enrolledStudents = this.grades.filter(g => g.courseId === courseId).length;
        if (enrolledStudents >= course.maxStudents) {
            throw new Error("Course is full");
        }
    }

    setGrade(studentId: number, courseId: number, grade: GradeValue): void {
        const isRegistered = this.grades.some(g => g.studentId === studentId && g.courseId === courseId);
        if (!isRegistered) {
            throw new Error("Student is not registered for the course");
        }
        this.grades.push({
            studentId,
            courseId,
            grade,
            date: new Date(),
            semester: this.getCurrentSemester(),
        });
    }

    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");

        if (student.status === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
            throw new Error("Cannot change status of a graduated student");
        }
        student.status = newStatus;
    }

    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;

        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students
            .filter(s => s.faculty === faculty)
            .filter(s => {
                const avgGrade = this.calculateAverageGrade(s.id);
                return avgGrade >= 4.5;
            });
    }

    private getCurrentSemester(): Semester {
        const month = new Date().getMonth() + 1; // Months are zero-based
        return month >= 1 && month <= 6 ? Semester.First : Semester.Second;
    }
}
