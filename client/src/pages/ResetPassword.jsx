import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setIsSubmitting(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen flex bg-white dark:bg-[#0a0a0a] overflow-hidden">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-32 relative">
                <div className="max-w-md w-full mx-auto lg:mx-0">
                    <div className="mb-8 text-center lg:text-left">
                        <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 mx-auto lg:mx-0">
                            <ShieldCheck size={24} />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Set new password</h1>
                        <p className="text-gray-500 text-sm">Your new password must be different from previously used passwords.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 rounded-xl border border-lightBorder dark:border-darkBorder bg-transparent focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-2">
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
                        </div>
                    </form>
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
                    <h2 className="text-3xl font-bold text-white mb-4">Secure Access Restored</h2>
                    <p className="text-white/80 text-lg leading-relaxed font-light">
                        Once you reset your password, you'll be redirected to login securely.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
