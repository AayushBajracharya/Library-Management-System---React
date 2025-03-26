import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; 
import AuthorForm from "../components/author/AuthorForm";
import AuthorTable from "../components/author/AuthorTable";
import Navbar from "../components/Navbar";
import { getAuthors, updateAuthor, addAuthor, deleteAuthor } from "../services/AuthorService";
import { Author } from "../types/authors";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthorPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { tokens, logout } = useAuth();
  const navigate = useNavigate();
  
// Redirect to login if not authenticated
useEffect(() => {
  if (!tokens) {
    navigate("/login");
  } else {
    fetchAuthors();
  }
}, [tokens, navigate]);

  const fetchAuthors = async () => {
    try {
      const data = await getAuthors();
      setAuthors(data);
    } catch (err) {
      console.error("Failed to fetch authors.");
      toast.error("Failed to load authors."); 
    }
  };

  // Add or update an author based on the form
  const handleAddOrUpdate = async (author: Author) => {
    try {
      if (isEdit && author.authorID) {
        await updateAuthor(author);
        toast.success("Author updated successfully!"); 
      } else {
        await addAuthor(author);
        toast.success("Author added successfully!"); 
      }
      fetchAuthors(); 
      setSelectedAuthor(null);
      setIsEdit(false); 
    } catch (err) {
      console.error(`Failed to ${isEdit ? "update" : "add"} author.`);
      toast.error(`Failed to ${isEdit ? "update" : "add"} author.`); 
    }
  };

  // Set the author for editing
  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setIsEdit(true); 
  };

  // Handle author deletion
  const handleDelete = async (authorId: number) => {
    try {
      await deleteAuthor(authorId);
      toast.success("Author deleted successfully!"); 
      fetchAuthors(); 
    } catch (err) {
      toast.error("Failed to delete author.");
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
        <div className="h-[65px] bg-blue shadow-md flex items-center px-5">
          <h2 className="text-lg font-semibold">Author Info</h2>
        </div>
        <div className="bg-gray-200 p-5 h-[calc(100vh-65px)] overflow-y-auto">
          <AuthorForm
            author={selectedAuthor}
            isEdit={isEdit}
            onSubmit={handleAddOrUpdate}
          />
          <AuthorTable
            authors={authors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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

export default AuthorPage;