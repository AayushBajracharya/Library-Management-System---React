import { useState, useEffect } from "react";
import BookForm from "../components/book/BookForm";
import BookTable from "../components/book/BookTable";
import Navbar from "../components/Navbar";
import { Book } from "../types/books";
import { fetchBooks, updateBook, createBook, deleteBook } from "../services/bookService";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BookPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { tokens, logout } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!tokens) {
        navigate("/login");
      } else {
        loadBooks();
      }
    }, [tokens, navigate]);


    const loadBooks = async () => {
      try {
        setLoading(true);
        const bookData = await fetchBooks();
        setBooks(bookData);
      } catch (err) {
        setError("Failed to fetch books.");
        toast.error("Failed to load books.");
      } finally {
        setLoading(false);
      }
    };
  
    // Handle Add or Update books
    const handleAddOrUpdate = async (book: Book) => {
      try {
        if (isEdit && book.bookId) {
          await updateBook(book);
          setBooks(books.map((b) => (b.bookId === book.bookId ? book : b)));
          toast.success("Book updated successfully!"); 
        } else {
          const newBook = await createBook(book);
          setBooks([...books, newBook]);
          toast.success("Book added successfully!"); 
          
        }
        setSelectedBook(null);
        setIsEdit(false);
      } catch (err) {
        setError(`Failed to ${isEdit ? "update" : "add"} book.`);
        toast.error(`Failed to ${isEdit ? "update" : "add"} book.`); 
        
      }
    };
  
    // Handle Edit
    const handleEdit = (book: Book) => {
      setSelectedBook(book);
      setIsEdit(true);
    };
  
    // Handle Delete
    const handleDelete = async (bookId: number) => {
      try {
        await deleteBook(bookId);
        toast.success("Book deleted successfully!"); 
        setBooks(books.filter((b) => b.bookId !== bookId));
      } catch (err) {
        toast.error("Failed to delete book.");
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
            <img src="" alt="Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-lg font-semibold">Book Info</h2>
          </div>
          <div className="bg-[#F2F2F2] p-5 h-[calc(100vh-65px)] overflow-y-auto">
            {error && <div className="bg-red-100 text-red-700 p-3 mb-4">{error}</div>}
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <>
                <BookForm book={selectedBook} isEdit={isEdit} onSubmit={handleAddOrUpdate} />
                <BookTable books={books} onEdit={handleEdit} onDelete={handleDelete} />
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
  
  export default BookPage;