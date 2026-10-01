import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          
          Waroji
        </Link>
        <div className="flex items-center gap-1">
          
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            
            Словарь
          </Link>
          <Link
            to="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            
            О проекте
          </Link>
          <Link
            to="/user"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            
            User
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
