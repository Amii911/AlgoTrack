import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import Problems from './pages/Problems';
import NotFound from './pages/NotFound';
import ClerkSignIn from './pages/ClerkSignIn';
import ClerkSignUp from './pages/ClerkSignUp';
import ClerkSignOut from './pages/ClerkSignOut';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/clerk-sign-in/*" element={<ClerkSignIn />} />
            <Route path="/clerk-sign-up/*" element={<ClerkSignUp />} />
            <Route path="/clerk-sign-out" element={<ClerkSignOut />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
