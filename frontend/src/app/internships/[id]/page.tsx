'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { MapPin, Briefcase, DollarSign, Calendar, Building, Sparkles, ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function InternshipDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: res, isLoading } = useQuery({
        queryKey: ['internship', id],
        queryFn: async () => {
            const { data } = await api.get(`/internships/${id}`);
            return data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return <div className="min-h-screen bg-background pt-32 text-center text-white">Loading...</div>;
    }

    const internship = res?.internship;

    if (!internship) {
        return <div className="min-h-screen bg-background pt-32 text-center text-white">Internship not found</div>;
    }

    return (
        <main className="min-h-screen pb-20">
            <Navbar />

            {/* Hero Header */}
            <section className="relative pt-32 pb-20 border-b border-white/5 bg-secondary/10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <Link href="/internships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Search
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 shrink-0 flex items-center justify-center border border-white/10">
                            <span className="text-5xl font-bold text-white">
                                {internship.companyName?.charAt(0) || '?'}
                            </span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-medium bg-black/40 text-white/90">
                                    {internship.domain}
                                </span>
                                {internship.isFeatured && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Featured
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground ml-auto">
                                    Posted {formatDistanceToNow(new Date(internship.postedAt), { addSuffix: true })}
                                </span>
                            </div>

                            <h1 className="font-outfit text-3xl md:text-5xl font-bold mb-4">{internship.title}</h1>

                            <div className="flex items-center gap-2 text-xl text-white/80 mb-8">
                                <Building className="w-5 h-5 text-muted-foreground" />
                                <Link href={`/companies/${internship.company?.slug || '#'}`} className="hover:text-primary transition-colors hover:underline">
                                    {internship.companyName}
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                {internship.source === 'manual' ? (
                                    <Link
                                        href={`/apply/${internship._id}`}
                                        className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    >
                                        Apply Now (Easy Apply)
                                    </Link>
                                ) : (
                                    <a
                                        href={internship.applyUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        Apply on {internship.companyName} Career Site <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                                <button className="px-8 py-3 rounded-full glass font-semibold hover:bg-white/5 transition-colors">
                                    Save for later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details Grid */}
            <section className="container mx-auto px-6 max-w-5xl py-16 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">

                    {/* About */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full" /> About the Role
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>{internship.description}</p>
                        </div>
                    </div>

                    {/* Requirements & Responsibilities */}
                    {internship.responsibilities?.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-accent rounded-full" /> Key Responsibilities
                            </h2>
                            <ul className="space-y-3">
                                {internship.responsibilities.map((req: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {internship.requirements?.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-primary rounded-full" /> Requirements
                            </h2>
                            <ul className="space-y-3">
                                {internship.requirements.map((req: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="font-bold mb-6">Job Overview</h3>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                                    <p className="font-medium">{internship.location}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Work Type</p>
                                    <p className="font-medium capitalize">{internship.type}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                                    <p className="font-medium">{internship.duration}</p>
                                </div>
                            </div>

                            {(internship.stipend?.min || internship.stipend?.max) && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Stipend</p>
                                        <p className="font-medium text-green-400">
                                            {internship.stipend.min ? `${internship.stipend.currency} ${internship.stipend.min}` : ''}
                                            {internship.stipend.max ? ` - ${internship.stipend.max}` : ''}
                                            {` / ${internship.stipend.period}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Skills Required */}
                    {internship.skills?.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="font-bold mb-4">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {internship.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </main>
    );
}
