import React from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { Shield, Lock, Eye, CheckCircle, Server, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Security = () => {
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
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <PublicNavbar />
      
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold mb-6">
              <Shield size={16} />
              Security First
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Your data's <span className="text-accent">safety</span> is our priority.
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              We employ military-grade encryption and industry-standard protocols to ensure your files remain yours and yours alone.
            </p>
          </div>

          {/* Detailed Security Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: <Lock className="text-accent" />,
                title: "End-to-End Encryption",
                desc: "Data is encrypted before it leaves your device and only decrypted when you access it again. Even we can't see your files."
              },
              {
                icon: <Server className="text-accent" />,
                title: "Secure Infrastructure",
                desc: "Our servers are hosted in SOC 2 Type II compliant data centers with 24/7 physical security and monitoring."
              },
              {
                icon: <CheckCircle className="text-accent" />,
                title: "Multi-Factor Authentication",
                desc: "Add an extra layer of security to your account with TOTP based two-factor authentication."
              },
              {
                icon: <Eye className="text-accent" />,
                title: "Audit Logging",
                desc: "Track every access, modification, and share of your files with detailed security logs."
              },
              {
                icon: <Shield className="text-accent" />,
                title: "Regular Audits",
                desc: "We perform penetration testing and security audits regularly to identify and mitigate potential vulnerabilities."
              },
              {
                icon: <Globe className="text-accent" />,
                title: "Global Compliance",
                desc: "Cloudlet is built to comply with GDPR, HIPAA, and CCPA standards for data privacy and protection."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-3xl hover:border-accent/40 transition-all group">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Compliance Banner */}
          <div className="bg-accent rounded-[2.5rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Trusted by thousands of professionals</h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 font-medium">
                Our commitment to security is unwavering. We build our platform on the foundation of trust and transparency.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-white/60 font-bold uppercase tracking-widest text-xs">
                <span>GDPR Compliant</span>
                <span>HIPAA Ready</span>
                <span>AES-256 Bit</span>
                <span>TLS 1.3</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-lightBorder dark:border-darkBorder bg-gray-50/50 dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cloudlet Security Operations. 
          </p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Security;
