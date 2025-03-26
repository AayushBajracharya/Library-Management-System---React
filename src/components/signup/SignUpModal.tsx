import { useState, useRef, useEffect } from "react";
import { User } from "../../types/model";
import { signup } from "../../services/authService";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUpModel: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<User>({
    userId: 0,
    username: '',
    password: '',
    email: '',
    role: '',
  });
  const [error, setError] = useState<string | null>(null);

  // Refs for dragging
  const modalRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    setDragging(true);
    setOffset({
      x: e.clientX - modalRef.current.offsetLeft,
      y: e.clientY - modalRef.current.offsetTop
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(user);
      onClose();
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup failed', err);
    }
  };

  if (!isOpen) return null;
  // shadow-lg border border-black-100
  return (
    <div className="fixed inset-0 bg-opacity-100 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md mx-4 absolute" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      >
        {/* Modal Header (Drag Handle) */}
        <div
          ref={headerRef}
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-4 border-b border-gray-200 cursor-move bg-gray-100"
        >
          <h5 className="text-lg font-semibold">Register Now</h5>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Enter your username"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex flex-wrap -mx-2 mb-3">
              <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="••••••"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  value={user.role}
                  onChange={(e) => setUser({ ...user, role: e.target.value })}
                  placeholder="Role"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#255d81] text-white p-3 rounded-md hover:bg-[#13364c] transition-colors"
            >
              Register
            </button>

            {error && <p className="text-red-500 mt-2 text-center text-sm">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModel;