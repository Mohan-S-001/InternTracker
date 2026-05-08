'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { Search, MapPin, Briefcase, DollarSign, Filter, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Internship {
    _id: string;
    title: string;
    companyName: string;
    companyLogo?: string;
    location: string;
    type: string;
    domain: string;
    stipend: { min?: number; max?: number; currency: string; period: string };
    postedAt: string;
    skills: string[];
}

export default function InternshipsPage() {
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['internships', search, domainFilter],
        queryFn: async () => {
            const { data } = await api.get('/internships', {
                params: { search, domain: domainFilter, limit: 50 },
            });
            return data.internships as Internship[];
        },
    });

    return (
        <main className="min-h-screen pt-24 pb-20">
            <Navbar />

            {/* Header & Search */}
            <section className="container mx-auto px-6 max-w-7xl mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <h1 className="font-outfit text-4xl md:text-6xl font-bold mb-6">
                        Find Your Next <span className="text-gradient">Opportunity</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Browse through 1,000+ curated internships from top companies.
                    </p>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto glass p-2 rounded-2xl flex flex-col md:flex-row gap-2"
                >
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Job title, keywords, or company..."
                            className="w-full bg-transparent border-none outline-none pl-12 pr-4 py-4 text-white placeholder:text-muted-foreground"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:block w-px bg-white/10 my-2" />
                    <div className="flex-1 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                            className="w-full bg-transparent border-none outline-none pl-12 pr-4 py-4 text-white appearance-none cursor-pointer"
                            value={domainFilter}
                            onChange={(e) => setDomainFilter(e.target.value)}
                        >
                            <option value="" className="bg-secondary text-white">All Domains</option>
                            <option value="Software Engineering" className="bg-secondary text-white">Software Engineering</option>
                            <option value="AI/ML" className="bg-secondary text-white">AI / Machine Learning</option>
                            <option value="Data Science" className="bg-secondary text-white">Data Science</option>
                            <option value="Cloud Computing" className="bg-secondary text-white">Cloud Computing</option>
                        </select>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-medium transition-colors">
                        Search
                    </button>
                </motion.div>
            </section>

            {/* Results */}
            <section className="container mx-auto px-6 max-w-7xl">
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="glass-card h-80 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                        {data?.map((internship, i) => (
                            <motion.div
                                key={internship._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 flex flex-col group hover:border-accent/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0 border border-white/10 font-bold text-white text-lg">
                                            {internship.companyName?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{internship.title}</h3>
                                            <p className="text-muted-foreground text-sm">{internship.companyName}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-white/80">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {internship.location}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-white/80">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {internship.type === 'remote' ? 'Remote' : internship.type === 'hybrid' ? 'Hybrid' : 'On-site'}
                                    </div>
                                    {internship.stipend && (internship.stipend.min || internship.stipend.max) && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-green-500/10 text-green-400">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {internship.stipend.min ? `${internship.stipend.min}` : ''}
                                            {internship.stipend.max ? ` - ${internship.stipend.max}` : ''}
                                            {` ${internship.stipend.currency} / ${internship.stipend.period}`}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        {internship.postedAt ? `Posted ${formatDistanceToNow(new Date(internship.postedAt), { addSuffix: true })}` : 'Posted recently'}
                                    </p>
                                    <Link
                                        href={`/internships/${internship._id}`}
                                        className="flex items-center gap-1 text-sm font-medium text-accent hover:text-white transition-colors"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
