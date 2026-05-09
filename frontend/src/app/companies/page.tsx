'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Search, MapPin, Star, ExternalLink, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Company {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    about: string;
    industry: string;
    headquarters: string;
    rating: number;
    website: string;
}

export default function CompaniesPage() {
    const [search, setSearch] = useState('');

    const { data: res, isLoading } = useQuery({
        queryKey: ['companies', search],
        queryFn: async () => {
            const { data } = await api.get('/companies', {
                params: { search }
            });
            return data;
        }
    });

    const companies = res?.companies as Company[] || [];

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Navbar />

            <section className="container mx-auto px-6 max-w-7xl mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <h1 className="font-outfit text-4xl md:text-6xl font-bold mb-6">
                        Top <span className="text-gradient">Companies</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explore the world&apos;s best workplaces and find your dream internship.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto glass p-2 rounded-2xl flex items-center gap-2 mb-16"
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search companies by name or industry..."
                            className="w-full bg-transparent border-none outline-none pl-12 pr-4 py-4 text-white placeholder:text-muted-foreground"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </motion.div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="glass-card h-64 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companies.map((company, i) => (
                            <motion.div
                                key={company._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-8 group hover:border-primary/50 transition-all hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0 border border-white/10 font-bold text-white text-2xl">
                                        {company.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold line-clamp-1">{company.name}</h3>
                                        <p className="text-sm text-primary font-medium">{company.industry}</p>
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 h-10">
                                    {company.about}
                                </p>

                                <div className="flex flex-wrap gap-4 mb-8 text-xs text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> {company.headquarters}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-yellow-500">
                                        <Star className="w-3.5 h-3.5 fill-current" /> {company.rating || '4.5'}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <Link
                                        href={`/companies/${company.slug}`}
                                        className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                        View Profile
                                    </Link>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-white transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!isLoading && companies.length === 0 && (
                    <div className="text-center py-20">
                        <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-xl text-muted-foreground">No companies found matching your search.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
