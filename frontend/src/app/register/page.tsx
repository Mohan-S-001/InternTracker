'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/store/authSlice';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bot, FileText, Target } from 'lucide-react';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            dispatch(setCredentials({ user: data.user, token: data.token }));
            router.push('/dashboard');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Left side info panel */}
            <div className="hidden md:flex flex-col justify-center w-5/12 bg-secondary/30 p-12 lg:p-20 border-r border-white/5 relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                <Link href="/" className="absolute top-10 left-12 text-2xl font-bold font-outfit z-10">
                    Intern<span className="text-gradient">Tracker</span>
                </Link>

                <div className="relative z-10 space-y-12">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 font-outfit">Accelerate your career.</h2>
                        <p className="text-muted-foreground text-lg">Join the most advanced platform for landing premium internships.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                                <Target className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">Live Aggregation</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Access opportunities from Google, Meta, and 500+ startups updated in real-time.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                                <FileText className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">ATS Resume Parsing</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Our AI analyzes your resume and matches you with roles you&apos;re highly likely to get.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-1">AI Career Agent</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">Chat with InternBot 24/7 to prepare for interviews and get roadmap advice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="text-center md:text-left mb-8">
                        <Link href="/" className="md:hidden inline-block mb-6 text-2xl font-bold font-outfit">
                            Intern<span className="text-gradient">Tracker</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">Create an account</h1>
                        <p className="text-muted-foreground">Start applying in minutes</p>
                    </div>

                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        ⚠️ {error}
                    </div>}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 flex justify-between">Full Name</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" placeholder="you@example.com" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" placeholder="••••••••" />
                            <p className="text-xs text-muted-foreground mt-2">Must be at least 6 characters.</p>
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-colors mt-4 text-lg">
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center md:text-left text-sm text-muted-foreground mt-8">
                        Already have an account? <Link href="/login" className="text-white hover:text-primary transition-colors font-medium">Log in instead</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
