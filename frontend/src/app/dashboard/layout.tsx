'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, Briefcase, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/lib/store/authSlice';
import { Navbar } from '@/components/layout/Navbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading } = useSelector((state: RootState) => state.auth);
    const pathname = usePathname();
    const dispatch = useDispatch();

    if (!isLoading && !isAuthenticated) {
        redirect('/login');
    }

    const navItems = [
        { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { name: 'AI Resume Analyzer', path: '/dashboard/resume', icon: FileText },
        { name: 'InternBot (AI)', path: '/dashboard/chatbot', icon: MessageSquare },
        { name: 'My Applications', path: '/dashboard/applications', icon: Briefcase },
    ];

    return (
        <div className="min-h-screen bg-background pt-20 flex">
            <Navbar />

            {/* Sidebar */}
            <aside className="w-64 fixed h-[calc(100vh-80px)] border-r border-white/5 bg-secondary/30 hidden lg:flex flex-col p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary">{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="truncate">
                        <p className="font-bold text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${active ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" /> {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5" /> Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-10 pb-24 lg:pb-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto h-full">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4 flex items-center justify-around z-40">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`flex flex-col items-center gap-1 p-2 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.name.replace('AI ', '')}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
