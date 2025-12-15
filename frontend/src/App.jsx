import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentView from './pages/StudentView';
import ProfessorView from './pages/ProfessorView';
import './App.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Feedback Dashboard</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/student"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/student'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Student View
              </Link>
              <Link
                to="/professor"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/professor'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Professor View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Real-Time Student Feedback Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Engage with your students through anonymous, AI-powered feedback
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/student"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Submit Feedback
          </Link>
          <Link
            to="/professor"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            View Dashboard
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">Sentiment analysis and smart summaries</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Real-Time</h3>
            <p className="text-sm text-gray-600">Live updates via WebSocket</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Anonymous</h3>
            <p className="text-sm text-gray-600">Students can share freely</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student" element={<StudentView />} />
          <Route path="/professor" element={<ProfessorView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
