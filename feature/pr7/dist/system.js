"use strict";
// Enum definitions
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
// Class implementation
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.studentIdCounter = 1;
        this.courseIdCounter = 1;
    }
    enrollStudent(student) {
        const newStudent = Object.assign(Object.assign({}, student), { id: this.studentIdCounter++ });
        this.students.push(newStudent);
        return newStudent;
    }
    registerForCourse(studentId, courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course)
            throw new Error("Course not found");
        const student = this.students.find(s => s.id === studentId);
        if (!student)
            throw new Error("Student not found");
        if (student.faculty !== course.faculty) {
            throw new Error("Student's faculty does not match the course's faculty");
        }
        const enrolledStudents = this.grades.filter(g => g.courseId === courseId).length;
        if (enrolledStudents >= course.maxStudents) {
            throw new Error("Course is full");
        }
    }
    setGrade(studentId, courseId, grade) {
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
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student)
            throw new Error("Student not found");
        if (student.status === StudentStatus.Graduated && newStatus !== StudentStatus.Graduated) {
            throw new Error("Cannot change status of a graduated student");
        }
        student.status = newStatus;
    }
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    getTopStudentsByFaculty(faculty) {
        return this.students
            .filter(s => s.faculty === faculty)
            .filter(s => {
            const avgGrade = this.calculateAverageGrade(s.id);
            return avgGrade >= 4.5;
        });
    }
    getCurrentSemester() {
        const month = new Date().getMonth() + 1; // Months are zero-based
        return month >= 1 && month <= 6 ? Semester.First : Semester.Second;
    }
}
