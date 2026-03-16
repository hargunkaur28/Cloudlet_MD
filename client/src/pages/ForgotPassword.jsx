import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setIsSent(true);
            toast.success('Reset link sent! Check your email.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send reset link');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex bg-white dark:bg-[#0a0a0a] overflow-hidden">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-32 relative">
                <div className="absolute top-10 left-8 sm:left-12 lg:left-20 xl:left-32">
                    <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to login</span>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto lg:mx-0">
                    {!isSent ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-extrabold tracking-tight mb-2">Forgot password?</h1>
                                <p className="text-gray-500 text-sm">No worries, we'll send you reset instructions.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2.5 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-accent hover:bg-indigo-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-70 group cursor-pointer"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                        <>
                                            Reset password
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center lg:text-left">
                            <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                                <ArrowRight size={32} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mb-2">Check your email</h1>
                            <p className="text-gray-500 text-sm mb-8">
                                We've sent a password reset link to <span className="font-semibold text-darkBg dark:text-lightBg">{email}</span>.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-accent font-bold hover:underline underline-offset-4 cursor-pointer"
                            >
                                Didn't receive the email? Click to try again
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side: Illustration */}
            <div className="hidden lg:flex flex-1 bg-accent p-12 items-center justify-center relative overflow-hidden">
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
                    <h2 className="text-3xl font-bold text-white mb-4">Secure Password Recovery</h2>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                        We use industry-standard encryption to ensure your account recovery is safe and private.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
