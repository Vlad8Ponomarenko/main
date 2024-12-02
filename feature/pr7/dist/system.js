"use strict";
var _a, _b, _c;
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    const ums = new UniversityManagementSystem();
    const updateStudentTable = () => {
        const studentTable = document.getElementById("studentsTableBody");
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
        const courseTable = document.getElementById("coursesTableBody");
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
        const gradesTable = document.getElementById("gradesTableBody");
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
    (_a = document.getElementById("addStudentForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
        e.preventDefault();
        const fullName = document.getElementById("fullName").value;
        const faculty = document.getElementById("faculty").value;
        const year = parseInt(document.getElementById("year").value);
        const status = document.getElementById("status").value;
        const groupNumber = document.getElementById("groupNumber").value;
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
    (_b = document.getElementById("addCourseForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("courseName").value;
        const type = document.getElementById("courseType").value;
        const credits = parseInt(document.getElementById("credits").value);
        const semester = document.getElementById("semester").value;
        const faculty = document.getElementById("courseFaculty").value;
        const maxStudents = parseInt(document.getElementById("maxStudents").value);
        ums.addCourse({ name, type, credits, semester, faculty, maxStudents });
        updateCourseTable(); // Update table
        alert("Course added successfully!");
    });
    // Handle Add Grade Form
    (_c = document.getElementById("addGradeForm")) === null || _c === void 0 ? void 0 : _c.addEventListener("submit", (e) => {
        e.preventDefault();
        const studentId = parseInt(document.getElementById("studentId").value);
        const courseId = parseInt(document.getElementById("courseId").value);
        const grade = parseInt(document.getElementById("grade").value);
        try {
            ums.setGrade(studentId, courseId, grade);
            updateGradesTable(); // Update table
            alert("Grade added successfully!");
        }
        catch (error) {
            alert(error.message);
        }
    });
    // Initial Table Update
    updateStudentTable();
    updateCourseTable();
    updateGradesTable();
});
// Enums
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType["Lecture"] = "Lecture";
    CourseType["Seminar"] = "Seminar";
    CourseType["Workshop"] = "Workshop";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["Fall"] = "Fall";
    Semester["Spring"] = "Spring";
    Semester["Summer"] = "Summer";
})(Semester || (Semester = {}));
var GradeValue;
(function (GradeValue) {
    GradeValue[GradeValue["Excellent"] = 5] = "Excellent";
    GradeValue[GradeValue["Good"] = 4] = "Good";
    GradeValue[GradeValue["Satisfactory"] = 3] = "Satisfactory";
    GradeValue[GradeValue["Unsatisfactory"] = 2] = "Unsatisfactory";
})(GradeValue || (GradeValue = {}));
var Faculty;
(function (Faculty) {
    Faculty["ComputerScience"] = "Computer Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// University Management System Class
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.currentStudentId = 1;
        this.currentCourseId = 1;
    }
    // Enroll a new student
    enrollStudent(student) {
        const newStudent = Object.assign({ id: this.currentStudentId++ }, student);
        this.students.push(newStudent);
        return newStudent;
    }
    // Register a student for a course
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student)
            throw new Error("Student not found");
        if (!course)
            throw new Error("Course not found");
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
    setGrade(studentId, courseId, grade) {
        const gradeEntry = this.grades.find(g => g.studentId === studentId && g.courseId === courseId);
        if (!gradeEntry)
            throw new Error("Student is not registered for this course");
        gradeEntry.grade = grade;
    }
    // Update student status
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student)
            throw new Error("Student not found");
        if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
            throw new Error("Only active students can graduate");
        }
        student.status = newStatus;
    }
    // Get students by faculty
    getStudentsByFaculty(faculty) {
        return this.students.filter(student => student.faculty === faculty);
    }
    // Get grades of a student
    getStudentGrades(studentId) {
        return this.grades.filter(grade => grade.studentId === studentId);
    }
    // Get available courses by faculty and semester
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(course => course.faculty === faculty && course.semester === semester);
    }
    // Calculate average grade of a student
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    // Get a list of top-performing students by faculty
    getTopStudentsByFaculty(faculty) {
        return this.students
            .filter(student => student.faculty === faculty)
            .filter(student => {
            const avgGrade = this.calculateAverageGrade(student.id);
            return avgGrade >= GradeValue.Excellent;
        });
    }
    // Add course (for simplicity)
    addCourse(course) {
        const newCourse = Object.assign({ id: this.currentCourseId++ }, course);
        this.courses.push(newCourse);
        return newCourse;
    }
}
// Example usage:
const ums = new UniversityManagementSystem();
const students = [
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
const courses = [
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
const grades = [
    { studentId: 1, courseId: 101, grade: GradeValue.Excellent, date: new Date("2023-10-10"), semester: Semester.Fall },
    { studentId: 2, courseId: 102, grade: GradeValue.Good, date: new Date("2023-10-15"), semester: Semester.Spring },
];
// Функціональність
// Перевірка можливості реєстрації на курс
(_a = document.getElementById("checkRegistrationButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const studentId = parseInt(document.getElementById("checkStudentId").value);
    const courseId = parseInt(document.getElementById("checkCourseId").value);
    const course = courses.find((c) => c.id === courseId);
    const student = students.find((s) => s.id === studentId);
    let result = "Invalid input.";
    if (course && student) {
        if (student.faculty === course.faculty &&
            course.maxStudents > grades.filter((g) => g.courseId === courseId).length) {
            result = "Student is eligible to register for this course.";
        }
        else {
            result = "Student cannot register for this course.";
        }
    }
    const resultElement = document.getElementById("registrationCheckResult");
    if (resultElement) {
        resultElement.textContent = result;
    }
});
// Перевірка можливості виставлення оцінки
(_b = document.getElementById("checkGradeButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const studentId = parseInt(document.getElementById("gradeStudentId").value);
    const courseId = parseInt(document.getElementById("gradeCourseId").value);
    const gradeEligible = grades.some((g) => g.studentId === studentId && g.courseId === courseId);
    const resultElement = document.getElementById("gradeCheckResult");
    if (resultElement) {
        resultElement.textContent = gradeEligible
            ? "Student is registered for this course."
            : "Student is not registered for this course.";
    }
});
// Отримання списку відмінників
(_c = document.getElementById("getTopStudentsButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const faculty = document.getElementById("topStudentsFaculty").value;
    const topStudents = students.filter((s) => s.faculty === faculty &&
        grades
            .filter((g) => g.studentId === s.id)
            .every((g) => g.grade === GradeValue.Excellent));
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
    var _a, _b, _c;
    // Scroll to Students Table
    (_a = document.getElementById("viewStudentsButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const studentsTable = document.getElementById("studentsTable");
        if (studentsTable) {
            studentsTable.scrollIntoView({ behavior: "smooth" });
        }
    });
    // Scroll to Courses Table
    (_b = document.getElementById("viewCoursesButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        const coursesTable = document.getElementById("coursesTable");
        if (coursesTable) {
            coursesTable.scrollIntoView({ behavior: "smooth" });
        }
    });
    // Scroll to Grades Table
    (_c = document.getElementById("viewGradesButton")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        const gradesTable = document.getElementById("gradesTable");
        if (gradesTable) {
            gradesTable.scrollIntoView({ behavior: "smooth" });
        }
    });
});
