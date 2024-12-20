document.addEventListener("DOMContentLoaded", () => {
    const ums = new UniversityManagementSystem();

    const updateStudentTable = () => {
        const studentTable = document.getElementById("studentsTableBody") as HTMLTableSectionElement;
        studentTable.innerHTML = ""; // Clear table

        ums.getStudentsByFaculty(Faculty.ComputerScience).forEach(student => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.fullName}</td>
                <td>${student.faculty}</td>
                <td>${student.year}</td>
                <td>${student.status}</td>
                <td>${student.groupNumber}</td>
            `;
            studentTable.appendChild(row);
        });
    };

    const updateCourseTable = () => {
        const courseTable = document.getElementById("coursesTableBody") as HTMLTableSectionElement;
        courseTable.innerHTML = ""; // Clear table

        ums.getAvailableCourses(Faculty.ComputerScience, Semester.Fall).forEach(course => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${course.id}</td>
                <td>${course.name}</td>
                <td>${course.type}</td>
                <td>${course.credits}</td>
                <td>${course.semester}</td>
                <td>${course.faculty}</td>
                <td>${course.maxStudents}</td>
            `;
            courseTable.appendChild(row);
        });
    };

    const updateGradesTable = () => {
        const gradesTable = document.getElementById("gradesTableBody") as HTMLTableSectionElement;
        gradesTable.innerHTML = ""; // Clear table

        ums.getStudentGrades(1).forEach(grade => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${grade.studentId}</td>
                <td>${grade.courseId}</td>
                <td>${grade.grade}</td>
                <td>${grade.date.toDateString()}</td>
                <td>${grade.semester}</td>
            `;
            gradesTable.appendChild(row);
        });
    };

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

        updateStudentTable(); // Update table
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

        updateCourseTable(); // Update table
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

            updateGradesTable(); // Update table
            alert("Grade added successfully!");
        } catch (error: any) {
            alert(error.message);
        }
    });


    // Initial Table Update
    updateStudentTable();
    updateCourseTable();
    updateGradesTable();
});



// Enums
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled",
}

enum CourseType {
    Lecture = "Lecture",
    Seminar = "Seminar",
    Workshop = "Workshop",
}

enum Semester {
    Fall = "Fall",
    Spring = "Spring",
    Summer = "Summer",
}

enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2,
}

enum Faculty {
    ComputerScience = "Computer Science",
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
const students: Student[] = [
    {
        id: 1,
        fullName: "John Doe",
        faculty: Faculty.ComputerScience,
        year: 2,
        status: StudentStatus.Active,
        enrollmentDate: new Date("2022-09-01"),
        groupNumber: "CS202",
    },
    {
        id: 2,
        fullName: "Jane Smith",
        faculty: Faculty.Economics,
        year: 3,
        status: StudentStatus.Active,
        enrollmentDate: new Date("2021-09-01"),
        groupNumber: "ECO301",
    },
];

const courses: Course[] = [
    {
        id: 101,
        name: "Algorithms",
        type: CourseType.Lecture,
        credits: 4,
        semester: Semester.Fall,
        faculty: Faculty.ComputerScience,
        maxStudents: 30,
    },
    {
        id: 102,
        name: "Macroeconomics",
        type: CourseType.Seminar,
        credits: 3,
        semester: Semester.Spring,
        faculty: Faculty.Economics,
        maxStudents: 25,
    },
];

const grades: Grade[] = [
    { studentId: 1, courseId: 101, grade: GradeValue.Excellent, date: new Date("2023-10-10"), semester: Semester.Fall },
    { studentId: 2, courseId: 102, grade: GradeValue.Good, date: new Date("2023-10-15"), semester: Semester.Spring },
];

// Функціональність

// Перевірка можливості реєстрації на курс
document.getElementById("checkRegistrationButton")?.addEventListener("click", () => {
    const studentId = parseInt((document.getElementById("checkStudentId") as HTMLInputElement).value);
    const courseId = parseInt((document.getElementById("checkCourseId") as HTMLInputElement).value);

    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);

    let result = "Invalid input.";
    if (course && student) {
        if (
            student.faculty === course.faculty &&
            course.maxStudents > grades.filter((g) => g.courseId === courseId).length
        ) {
            result = "Student is eligible to register for this course.";
        } else {
            result = "Student cannot register for this course.";
        }
    }
    const resultElement = document.getElementById("registrationCheckResult");
    if (resultElement) {
        resultElement.textContent = result;
    }
});

// Перевірка можливості виставлення оцінки
document.getElementById("checkGradeButton")?.addEventListener("click", () => {
    const studentId = parseInt((document.getElementById("gradeStudentId") as HTMLInputElement).value);
    const courseId = parseInt((document.getElementById("gradeCourseId") as HTMLInputElement).value);

    const gradeEligible = grades.some((g) => g.studentId === studentId && g.courseId === courseId);
    const resultElement = document.getElementById("gradeCheckResult");
    if (resultElement) {
        resultElement.textContent = gradeEligible
            ? "Student is registered for this course."
            : "Student is not registered for this course.";
    }
});

// Отримання списку відмінників
document.getElementById("getTopStudentsButton")?.addEventListener("click", () => {
    const faculty = (document.getElementById("topStudentsFaculty") as HTMLSelectElement).value as Faculty;
    const topStudents = students.filter(
        (s) =>
            s.faculty === faculty &&
            grades
                .filter((g) => g.studentId === s.id)
                .every((g) => g.grade === GradeValue.Excellent)
    );

    const topStudentsList = document.getElementById("topStudentsList");
    if (topStudentsList) {
        topStudentsList.innerHTML = "";
        topStudents.forEach((s) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${s.id}: ${s.fullName} (Group: ${s.groupNumber})`;
            topStudentsList.appendChild(listItem);
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Scroll to Students Table
    document.getElementById("viewStudentsButton")?.addEventListener("click", () => {
        const studentsTable = document.getElementById("studentsTable");
        if (studentsTable) {
            studentsTable.scrollIntoView({ behavior: "smooth" });
        }
    });

    // Scroll to Courses Table
    document.getElementById("viewCoursesButton")?.addEventListener("click", () => {
        const coursesTable = document.getElementById("coursesTable");
        if (coursesTable) {
            coursesTable.scrollIntoView({ behavior: "smooth" });
        }
    });

    // Scroll to Grades Table
    document.getElementById("viewGradesButton")?.addEventListener("click", () => {
        const gradesTable = document.getElementById("gradesTable");
        if (gradesTable) {
            gradesTable.scrollIntoView({ behavior: "smooth" });
        }
    });
});