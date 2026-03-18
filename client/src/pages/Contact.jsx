import React, { useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import { Mail, MessageSquare, MapPin, ArrowRight, Github, Twitter, Linkedin, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/contact', formData);
      if (data.success) {
        toast.success('Message sent! We will get back to you soon.');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="text-center mb-16 px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Get in <span className="text-accent">touch</span> with us.
            </h1>
            <p className="max-w-xl mx-auto text-lg text-gray-500 dark:text-gray-400">
              Have questions? We're here to help. Reach out to our team for support or business inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Contact Form */}
            <div className="p-8 md:p-10 bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-3xl shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4" 
                    className="w-full px-4 py-3 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none text-sm transition-all resize-none" 
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (
                    <>
                      Send Message
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Details */}
            <div className="space-y-10 py-4 lg:py-10 lg:pl-10">
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email us</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Our friendly team is here to help.</p>
                    <a href="mailto:support@cloudlet.io" className="text-accent font-bold hover:underline">support@cloudlet.io</a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MessageSquare className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Live Chat</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Available 24/7 for premium users.</p>
                    <button onClick={handleToBeAdded} className="text-accent font-bold hover:underline">Start a conversation</button>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Office</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Come say hello at our headquarters.</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">123 Cloud St, Silicon Valley, CA 94025</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-lightBorder dark:border-darkBorder">
                <h3 className="text-lg font-bold mb-6">Follow us</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Twitter size={20} />, label: "Twitter" },
                    { icon: <Github size={20} />, label: "Github" },
                    { icon: <Linkedin size={20} />, label: "Linkedin" }
                  ].map((social, idx) => (
                    <button 
                      key={idx} 
                      onClick={handleToBeAdded}
                      className="p-3 bg-lightSurface dark:bg-darkSurface border border-lightBorder dark:border-darkBorder rounded-xl text-gray-500 hover:text-accent hover:border-accent transition-all cursor-pointer"
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-lightBorder dark:border-darkBorder bg-gray-50/50 dark:bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Cloudlet Support Team. 
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
