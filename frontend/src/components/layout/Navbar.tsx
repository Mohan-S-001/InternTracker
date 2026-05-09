'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { logout } from '@/lib/store/authSlice';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Internships', path: '/internships' },
        { name: 'Companies', path: '/companies' },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent neon-glow group-hover:scale-105 transition-transform">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <span className="font-outfit font-bold text-2xl tracking-tight">
                        Intern<span className="text-gradient">Tracker</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={`text-sm font-medium transition-colors hover:text-accent relative ${pathname === link.path ? 'text-white' : 'text-muted-foreground'
                                }`}
                        >
                            {link.name}
                            {pathname === link.path && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent rounded-full"
                                    initial={false}
                                />
                            )}
                        </Link>
                    ))}

                    {isLoading ? (
                        <div className="w-20 h-8 rounded-full bg-white/10 animate-pulse" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                            >
                                Dashboard
                            </Link>
                            <button onClick={() => dispatch(logout())} className="text-sm font-medium text-destructive transition-colors hover:text-red-400">
                                Log Out
                            </button>
                            <Link href="/profile">
                            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center border border-white/10 hover:border-accent transition-colors overflow-hidden relative">
                                    {user?.avatar ? (
                                        <Image src={user.avatar} alt="Avatar" fill sizes="36px" className="object-cover" />
                                    ) : (
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 ml-4">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-white hover:text-accent transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-semibold bg-white text-black px-5 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass absolute top-full left-0 w-full border-t border-white/10"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-medium text-white/80 hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-white/10 my-2" />
                            {isAuthenticated ? (
                                <>
                                    <Link href="/dashboard" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                    <Link href="/profile" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                    <button onClick={() => { dispatch(logout()); setMobileMenuOpen(false); }} className="text-lg font-medium text-left text-destructive">Log Out</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-lg font-medium text-white/80" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link href="/register" className="text-lg font-semibold text-accent" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
