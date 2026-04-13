import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import ViewRecords from './pages/ViewRecords';
import Families from './pages/Families';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <div className="flex-1 lg:ml-64 w-full">
          {/* Mobile Header */}
          <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black border-b border-gold-600/30 z-20 px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              कुटुंब सर्वे
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>

          {/* Main Content */}
          <main className="pt-14 lg:pt-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add" element={<AddRecord />} />
              <Route path="/records" element={<ViewRecords />} />
              <Route path="/families" element={<Families />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;