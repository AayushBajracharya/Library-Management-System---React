import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Student } from "../types/student";
import StudentForm from "../components/student/StudentForm";
import StudentTable from "../components/student/StudentTable";
import { toast, ToastContainer } from "react-toastify"; 
import { fetchStudents, createStudent, updateStudent, deleteStudent } from "../services/studentService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const StudentPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { tokens, logout } = useAuth();
  const navigate = useNavigate();

// Redirect to login if not authenticated
useEffect(() => {
  if (!tokens) {
    navigate("/login");
  } else {
    getStudents();
  }
}, [tokens, navigate]);

  const getStudents = async () => {
    try {
      setLoading(true);
      const studentData = await fetchStudents();
      setStudents(studentData);
    } catch (err) {
      setError("Failed to fetch students.");
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };


  // Handle Add or Update
  const handleAddOrUpdate = async (student: Student) => {
    try {
      if (isEdit && student.studentId) {
        await updateStudent(student);
        setStudents(students.map((s) => (s.studentId === student.studentId ? student : s)));
        toast.success("Student updated successfully!");
      } else {
        const newStudent = await createStudent(student);
        setStudents([...students, newStudent]);
        toast.success("Student added successfully!"); 
      }
      setSelectedStudent(null);
      setIsEdit(false);
    } catch (err) {
      setError(`Failed to ${isEdit ? "update" : "add"} student.`);
      toast.error(`Failed to ${isEdit ? "update" : "add"} student.`);
    }
  };

  // Handle Edit
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEdit(true);
  };

  // Handle Delete
  const handleDelete = async (studentId: number) => {
    try {
      await deleteStudent(studentId);
      setStudents(students.filter((s) => s.studentId !== studentId));
      toast.success("Student deleted successfully!"); 
    } catch (err) {
      toast.error("Failed to delete student.");
    }
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <div className="flex">
      <Navbar />
      <div className="ml-[222px] w-full">
        <div className="h-[65px] bg-white shadow-md flex items-center px-5">
          <h2 className="text-lg font-semibold">Student Info</h2>
        </div>
        <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <StudentForm student={selectedStudent} isEdit={isEdit} onSubmit={handleAddOrUpdate} />
              <StudentTable students={students} onEdit={handleEdit} onDelete={handleDelete} />
            </>
          )}
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
        theme="light" 
      />
    </div>
  );
};

export default StudentPage;
