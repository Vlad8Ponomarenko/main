"use strict";
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    const ums = new UniversityManagementSystem();
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
            alert("Grade added successfully!");
        }
        catch (error) {
            alert(error.message);
        }
    });
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
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
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
    Faculty["Computer_Science"] = "Computer_Science";
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
