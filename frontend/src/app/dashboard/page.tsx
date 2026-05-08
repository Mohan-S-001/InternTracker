'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Briefcase, ArrowRight, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Application {
    _id: string;
    internshipTitle: string;
    companyName: string;
    createdAt: string;
    status: string;
}

export default function DashboardOverview() {
    const { user } = useSelector((state: RootState) => state.auth);

    const { data: appsRes } = useQuery<Application[]>({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data } = await api.get('/applications/me');
            return data.applications;
        },
    });

    const { data: recommendations } = useQuery({
        queryKey: ['recommendations'],
        queryFn: async () => {
            const { data } = await api.post('/ai/recommendations', { skills: user?.profile?.skills || ['JavaScript'] });
            return data.recommendations;
        },
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="glass-card p-8 bg-gradient-to-r from-primary/10 to-transparent">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your internship search today.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-card p-6 border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{appsRes?.length || 0}</h3>
                    <p className="text-sm text-muted-foreground">Active Applications</p>
                </div>

                <div className="glass-card p-6 border-white/5 md:col-span-2">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-accent" /> AI Recommended Roles
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {recommendations?.map((role: string) => (
                            <span key={role} className="px-3 py-1.5 glass rounded-lg text-sm text-white/90">
                                {role}
                            </span>
                        ))}
                    </div>
                    <Link href="/internships" className="inline-block mt-4 text-sm text-primary hover:underline">
                        View matching internships →
                    </Link>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Applications</h2>
                    <Link href="/dashboard/applications" className="text-sm text-primary hover:underline">View all</Link>
                </div>

                <div className="space-y-4">
                    {appsRes && appsRes.length > 0 ? appsRes.slice(0, 3).map((app) => (
                        <div key={app._id} className="glass-card p-5 flex items-center justify-between hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{app.internshipTitle}</h3>
                                    <p className="text-sm text-muted-foreground">{app.companyName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-medium mb-2 uppercase tracking-wide">
                                    {app.status.replace('_', ' ')}
                                </span>
                                <p className="text-xs text-muted-foreground block">
                                    {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="glass-card p-10 text-center text-muted-foreground border-dashed border-white/10">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 opacity-50" />
                            </div>
                            <p>You haven&apos;t applied to any internships yet.</p>
                            <Link href="/internships" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline">
                                Find internships <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

