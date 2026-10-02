import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PublicCalendar } from './components/PublicCalendar';
import { DataInputGrid } from './components/DataInputGrid';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<PublicCalendar />} />
            <Route path="/login" element={<LoginForm />} />
            <Route 
              path="/grid" 
              element={
                <ProtectedRoute>
                  <DataInputGrid />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
