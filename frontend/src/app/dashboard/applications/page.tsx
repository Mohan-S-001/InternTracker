'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Briefcase, Building, Calendar, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Application {
    _id: string;
    internshipTitle: string;
    companyName: string;
    createdAt: string;
    status: string;
    internship: string | { _id: string };
}

export default function ApplicationsPage() {
    const { data: applications, isLoading } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data } = await api.get('/applications/me');
            return data.applications as Application[];
        },
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'applied': return <Clock className="w-5 h-5 text-blue-400" />;
            case 'under_review': return <Clock className="w-5 h-5 text-accent" />;
            case 'interview': return <Calendar className="w-5 h-5 text-primary" />;
            case 'selected': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'under_review': return 'bg-accent/10 text-accent border-accent/20';
            case 'interview': return 'bg-primary/10 text-primary border-primary/20';
            case 'selected': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-white/5 text-muted-foreground border-white/10';
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Applications</h1>
                <p className="text-muted-foreground">Track the status of your internship applications taking place across different companies.</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 glass-card animate-pulse" />)}
                </div>
            ) : (applications && applications.length > 0) ? (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app._id} className="glass-card p-6 flex flex-col md:flex-row gap-6 md:items-center hover:border-white/10 transition-colors">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                                <Briefcase className="w-8 h-8 text-muted-foreground" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-1 hover:text-primary transition-colors cursor-pointer">{app.internshipTitle}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building className="w-4 h-4" /> {app.companyName}
                                    <span className="mx-1">•</span>
                                    Applied {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                                <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 text-sm font-medium uppercase tracking-wide ${getStatusColor(app.status)}`}>
                                    {getStatusIcon(app.status)}
                                    {app.status.replace('_', ' ')}
                                </div>
                                <Link
                                    href={`/internships/${typeof app.internship === 'object' ? app.internship._id : app.internship}`}
                                    className="text-sm font-medium text-white/50 hover:text-white flex items-center transition-colors"
                                >
                                    View Job <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card py-20 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Briefcase className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Applications Yet</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">You haven&apos;t applied to any internships yet. Browse our curated listings and find your dream role today!</p>
                    <Link href="/internships" className="px-8 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
                        Browse Internships
                    </Link>
                </div>
            )}
        </div>
    );
}

