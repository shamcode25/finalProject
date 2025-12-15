import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StudentView from './pages/StudentView';
import ProfessorView from './pages/ProfessorView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">
                  📊 Feedback Dashboard
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition"
                >
                  Student
                </Link>
                <Link
                  to="/professor"
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-md transition"
                >
                  Professor
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<StudentView />} />
          <Route path="/professor" element={<ProfessorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
