import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import ViewRecords from './pages/ViewRecords';
import Families from './pages/Families';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddRecord />} />
            <Route path="/records" element={<ViewRecords />} />
            <Route path="/families" element={<Families />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
