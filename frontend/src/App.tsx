import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PublicCalendar } from './components/PublicCalendar';
import { DataInputGrid } from './components/DataInputGrid';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="h-screen w-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden selection:bg-blue-500/30 relative">
        <div className="fixed inset-0 z-[0] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
        
        {/* Navbar is fixed at the top */}
        <div className="relative z-50 flex-none">
          <Navbar />
        </div>
        
        {/* Main Content Area filling remaining space exactly */}
        <main className="flex-1 relative z-10 overflow-hidden flex flex-col h-full">
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
