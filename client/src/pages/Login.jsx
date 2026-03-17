import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight, Sun, Moon } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await login(email, password);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
      toast.success('Successfully logged in');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex bg-white dark:bg-[#0a0a0a] overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-32 relative overflow-y-auto">
        {/* Brand Header */}
        <div className="absolute top-10 left-8 sm:left-12 lg:left-20 xl:left-32 flex items-center justify-between w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)] lg:w-[calc(100%-10rem)] xl:w-[calc(100%-16rem)]">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo />
            <span className="text-xl font-bold tracking-tight text-accent">Cloudlet</span>
          </Link>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder text-gray-500 hover:text-accent transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email address</label>
              <input 
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between py-0.5">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative w-4 h-4 flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-4 h-4 border border-lightBorder dark:border-darkBorder rounded bg-lightSurface dark:bg-darkSurface peer-checked:bg-accent peer-checked:border-accent transition-all"></div>
                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Remember for 30 days</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-accent hover:underline underline-offset-4">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-indigo-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 group cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  Sign in
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Don't have an account? <Link to="/signup" className="text-accent font-bold hover:underline underline-offset-4">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Side: Illustration */}
      <div className="hidden lg:flex flex-1 bg-accent p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-lg text-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl mb-8 transform hover:scale-[1.02] transition-transform duration-500">
                <img 
                    src="/auth_illustration.png" 
                    alt="Cloudlet UI Illustration" 
                    className="rounded-2xl w-full h-auto"
                />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">The future of secure file sharing</h2>
            <p className="text-white/80 text-lg leading-relaxed font-light">
                Join thousands of users who trust Cloudlet for their data management. Simple, fast, and encrypted.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
