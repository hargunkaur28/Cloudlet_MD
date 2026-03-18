import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Shield, 
  Zap, 
  Cloud, 
  Share2, 
  Lock, 
  Folder, 
  ArrowRight,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import PublicNavbar from '../components/PublicNavbar';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();

  const handleToBeAdded = (e) => {
    e.preventDefault();
    toast('Feature to be added further...', {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-56 md:pb-32 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            New: Enhanced file encryption is here
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Your digital world,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-400">
              simplified & secured.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
            Cloudlet is the modern workspace where you can store, share, and manage your files with military-grade encryption and seamless collaboration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-accent/30 flex items-center justify-center gap-2 group"
            >
              Start for free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={handleToBeAdded}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder hover:border-accent text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Watch Demo
            </button>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-gray-50/50 dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for modern teams</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your personal files or collaborate with your team at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Cloud className="text-accent" />,
                title: "Cloud Storage",
                desc: "Access your files from any device, anywhere in the world with zero downtime."
              },
              {
                icon: <Lock className="text-accent" />,
                title: "Secure Encryption",
                desc: "Your data is encrypted both at rest and in transit using industry-leading protocols."
              },
              {
                icon: <Share2 className="text-accent" />,
                title: "Smart Sharing",
                desc: "Share files and folders with granular permissions and expiration dates."
              },
              {
                icon: <Shield className="text-accent" />,
                title: "Admin Control",
                desc: "Powerful dashboard for admins to manage users, roles, and storage quotas."
              },
              {
                icon: <Folder className="text-accent" />,
                title: "Better Organization",
                desc: "Use folders, tags, and powerful search to find exactly what you need in seconds."
              },
              {
                icon: <Zap className="text-accent" />,
                title: "Instant Preview",
                desc: "Preview documents, images, and videos directly in your browser without downloading."
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-8 bg-white dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-3xl hover:border-accent/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 border-y border-lightBorder dark:border-darkBorder overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Security first,<br />always.</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
              We understand that your data is your most valuable asset. That's why we built Cloudlet with a security-first mindset, ensuring your privacy is never compromised.
            </p>
            <ul className="space-y-4">
              {[
                "End-to-end data encryption",
                "Two-factor authentication support",
                "Regular security audits",
                "GDPR and HIPAA compliance"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="text-accent bg-accent/10 p-1 rounded-full">
                    <ChevronRight size={16} />
                  </div>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
             <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full -z-10"></div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                   <div className="bg-white dark:bg-darkSurface p-6 rounded-3xl border border-lightBorder dark:border-darkBorder shadow-xl rotate-3">
                      <Shield className="text-accent mb-4" size={32} />
                      <div className="font-bold text-2xl">99.9%</div>
                      <div className="text-sm text-gray-500">Uptime Reliability</div>
                   </div>
                   <div className="bg-accent p-6 rounded-3xl shadow-xl -rotate-2">
                      <Lock className="text-white mb-4" size={32} />
                      <div className="font-bold text-2xl text-white">TLS 1.3</div>
                      <div className="text-sm text-white/80">Premium Security</div>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="bg-white dark:bg-darkSurface p-6 rounded-3xl border border-lightBorder dark:border-darkBorder shadow-xl -rotate-3">
                      <Zap className="text-accent mb-4" size={32} />
                      <div className="font-bold text-2xl">256-bit</div>
                      <div className="text-sm text-gray-500">AES Encryption</div>
                   </div>
                   <div className="bg-white dark:bg-darkSurface p-6 rounded-3xl border border-lightBorder dark:border-darkBorder shadow-xl rotate-2">
                      <Cloud className="text-accent mb-4" size={32} />
                      <div className="font-bold text-2xl">Unlimited</div>
                      <div className="text-sm text-gray-500">Scalable Storage</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to secure your files?</h2>
          <p className="text-white/80 text-xl mb-12 font-medium">
            Join the Cloudlet community today and experience the next generation of file management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto px-10 py-5 bg-white text-accent hover:bg-gray-50 font-extrabold rounded-2xl transition-all shadow-2xl shadow-indigo-900/40 text-lg"
            >
              Create free account
            </Link>
            <Link 
              to="/login"
              className="text-white font-bold text-lg hover:underline underline-offset-8"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-lightBorder dark:border-darkBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-accent">Cloudlet</span>
          </div>

          <div className="flex gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Cookies</a>
          </div>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cloudlet Inc. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Home;
