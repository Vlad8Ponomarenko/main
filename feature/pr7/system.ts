// Enum типи для статусів студентів, типів курсів, семестрів, оцінок та факультетів
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

enum Semester {
    First = "First",
    Second = "Second"
}

enum Grade {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// Інтерфейси для студентів, курсів та оцінок
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

interface GradeRecord {
    studentId: number;
    courseId: number;
    grade: Grade;
    date: Date;
    semester: Semester;
}

// Клас для керування університетом
class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: GradeRecord[] = [];

    // Додавання нового студента
    enrollStudent(student: Omit<Student, "id">): Student {
        const newStudent = {
            ...student,
            id: this.students.length + 1,
            enrollmentDate: new Date()
        };
        this.students.push(newStudent);
        return newStudent;
    }

    // Реєстрація студента на курс
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (student && course && course.faculty === student.faculty && course.maxStudents > 0) {
            alert(`Student ${student.fullName} successfully registered for course ${course.name}`);
            course.maxStudents--;
        } else {
            alert('Registration failed. Ensure student and course are valid.');
        }
    }

    // Виставлення оцінки студенту
    setGrade(studentId: number, courseId: number, grade: Grade): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (student && course) {
            const gradeRecord: GradeRecord = {
                studentId: student.id,
                courseId: course.id,
                grade: grade,
                date: new Date(),
                semester: course.semester
            };
            this.grades.push(gradeRecord);
            alert(`Grade set for student ${student.fullName} in course ${course.name}`);
        } else {
            alert('Student or course not found!');
        }
    }

    // Оновлення статусу студента
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            if (newStatus === StudentStatus.Graduated && student.status !== StudentStatus.Active) {
                alert('Can only graduate an active student!');
                return;
            }
            student.status = newStatus;
            alert(`Student ${student.fullName} status updated to ${newStatus}`);
        } else {
            alert('Student not found!');
        }
    }

    // Отримання студентів за факультетом
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // Отримання оцінок студента
    getStudentGrades(studentId: number): GradeRecord[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // Отримання доступних курсів за факультетом та семестром
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }

    // Розрахунок середнього балу студента
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;
        const totalGrade = studentGrades.reduce((sum, record) => sum + record.grade, 0);
        return totalGrade / studentGrades.length;
    }

    // Додавання нового курсу
    addCourse(course: Omit<Course, "id">): Course {
        const newCourse = { ...course, id: this.courses.length + 1, maxStudents: 30 };
        this.courses.push(newCourse);
        return newCourse;
    }

    // Отримання відмінників по факультету
    getHonorStudentsByFaculty(faculty: Faculty): Student[] {
        return this.getStudentsByFaculty(faculty).filter(student => {
            const avgGrade = this.calculateAverageGrade(student.id);
            return avgGrade >= 4.5; // Визначаємо відмінників
        });
    }
}

// Тестування функціоналу
const universitySystem = new UniversityManagementSystem();

// Додавання студентів
const student1 = universitySystem.enrollStudent({
    fullName: "John Doe",
    faculty: Faculty.Computer_Science,
    year: 1,
    status: StudentStatus.Active,
    groupNumber: "CS101",
    enrollmentDate: new Date()  // Додаємо дату реєстрації
});

const student2 = universitySystem.enrollStudent({
    fullName: "Jane Smith",
    faculty: Faculty.Economics,
    year: 2,
    status: StudentStatus.Active,
    groupNumber: "ECO201",
    enrollmentDate: new Date()  // Додаємо дату реєстрації
});


// Додавання курсів
const course1 = universitySystem.addCourse({
    name: "Intro to Programming",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 30
});

const course2 = universitySystem.addCourse({
    name: "Microeconomics",
    type: CourseType.Mandatory,
    credits: 4,
    semester: Semester.First,
    faculty: Faculty.Economics,
    maxStudents: 30
});

// Реєстрація студентів на курси
universitySystem.registerForCourse(student1.id, course1.id);
universitySystem.registerForCourse(student2.id, course2.id);

// Виставлення оцінок
universitySystem.setGrade(student1.id, course1.id, Grade.Excellent);
universitySystem.setGrade(student2.id, course2.id, Grade.Good);

// Оновлення статусу студента
universitySystem.updateStudentStatus(student1.id, StudentStatus.Graduated);

// Перевірка відмінників
const honorStudents = universitySystem.getHonorStudentsByFaculty(Faculty.Computer_Science);
console.log(honorStudents);
