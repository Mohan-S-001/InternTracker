'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { MapPin, Globe, Star, Users, Building, Briefcase, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CompanyDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const { data: res, isLoading } = useQuery({
        queryKey: ['company', slug],
        queryFn: async () => {
            const { data } = await api.get(`/companies/${slug}`);
            return data;
        },
        enabled: !!slug
    });

    const company = res?.company;

    if (isLoading) {
        return <div className="min-h-screen bg-background pt-32 text-center text-white">Loading...</div>;
    }

    if (!company) {
        return <div className="min-h-screen bg-background pt-32 text-center text-white">Company not found</div>;
    }

    return (
        <main className="min-h-screen pb-20">
            <Navbar />

            {/* Hero Header */}
            <section className="relative pt-32 pb-16 border-b border-white/5 bg-secondary/10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> All Companies
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/30 shrink-0 flex items-center justify-center border border-white/10 shadow-2xl">
                            <span className="text-6xl font-bold text-white">{company.name?.charAt(0) || '?'}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full border border-white/10 text-xs font-medium bg-black/40 text-white/90">
                                    {company.industry}
                                </span>
                                {company.isVerified && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary flex items-center gap-1">
                                        Verified Company
                                    </span>
                                )}
                            </div>

                            <h1 className="font-outfit text-4xl md:text-6xl font-bold mb-6">{company.name}</h1>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {company.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                        Website
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" /> {company.rating || '4.8'} / 5.0
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-6 max-w-5xl py-16 grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-primary rounded-full" /> About {company.name}
                        </h2>
                        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                            <p>{company.description}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 text-center">
                            <Users className="w-6 h-6 text-primary mx-auto mb-3" />
                            <p className="text-2xl font-bold">10k+</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Employees</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <Building className="w-6 h-6 text-accent mx-auto mb-3" />
                            <p className="text-2xl font-bold">50+</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Offices</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <Briefcase className="w-6 h-6 text-green-500 mx-auto mb-3" />
                            <p className="text-2xl font-bold">100+</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Internships</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Quick info */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <h3 className="font-bold mb-6">Company Details</h3>
                        <div className="space-y-6 text-sm">
                            <div>
                                <p className="text-muted-foreground mb-1">Industry</p>
                                <p className="font-medium text-white">{company.industry}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Headquarters</p>
                                <p className="font-medium text-white">{company.location}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground mb-1">Company Size</p>
                                <p className="font-medium text-white">Enterprise (10,000+)</p>
                            </div>
                            <div className="pt-6 border-t border-white/5">
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl bg-primary text-white font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                                >
                                    Visit Career Site <Globe className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
