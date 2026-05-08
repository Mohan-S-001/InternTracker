'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ApplyPage() {
    const params = useParams();
    const id = params.id as string;

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const { data: res } = useQuery({
        queryKey: ['internship', id],
        queryFn: async () => {
            const { data } = await api.get(`/internships/${id}`);
            return data;
        },
        enabled: !!id,
    });

    const [formData, setFormData] = useState({
        personalInfo: { name: '', email: '', phone: '', location: '' },
        education: { college: '', degree: '', branch: '', year: '', cgpa: '' },
        skills: '',
        github: '',
        linkedin: '',
        portfolio: '',
        resumeUrl: '',
        coverLetter: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
            };
            await api.post(`/applications/${id}`, payload);
            setSuccess(true);
        } catch {
            alert('Application failed or you already applied!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const internship = res?.internship;

    if (success) {
        return (
            <main className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
                <Navbar />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-12 max-w-lg text-center">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
                    <p className="text-muted-foreground mb-8">Your application for {internship?.title} at {internship?.companyName} has been successfully submitted. We&apos;ve sent a confirmation email to {formData.personalInfo.email}.</p>
                    <Link href="/dashboard/applications" className="px-8 py-3 bg-primary text-white rounded-full font-medium inline-block">
                        Track Application
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pb-20 pt-24">
            <Navbar />

            <div className="container mx-auto max-w-3xl px-6 py-12">
                <Link href={`/internships/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Cancel Application
                </Link>

                {internship && (
                    <div className="mb-8 p-6 glass-card border-accent/20">
                        <p className="text-sm text-muted-foreground mb-1">Applying for</p>
                        <h2 className="text-xl font-bold">{internship.title}</h2>
                        <p className="text-accent">{internship.companyName}</p>
                    </div>
                )}

                <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(s => s + 1); }} className="glass-card p-8 bg-secondary/30">

                    {/* Stepper */}
                    <div className="flex items-center mb-10 border-b border-white/5 pb-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center flex-1 last:flex-none">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary text-white' : 'bg-white/10 text-white/40'}`}>
                                    {i}
                                </div>
                                {i < 3 && <div className={`h-1 flex-1 mx-4 rounded-full ${step > i ? 'bg-primary' : 'bg-white/10'}`} />}
                            </div>
                        ))}
                    </div>

                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        {step === 1 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6">Personal details</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.personalInfo.name} onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, name: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.personalInfo.email} onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, email: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.personalInfo.phone} onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, phone: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Location</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.personalInfo.location} onChange={e => setFormData({ ...formData, personalInfo: { ...formData.personalInfo, location: e.target.value } })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6">Education & Skills</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">College / University</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.education.college} onChange={e => setFormData({ ...formData, education: { ...formData.education, college: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Degree (e.g. B.Tech)</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.education.degree} onChange={e => setFormData({ ...formData, education: { ...formData.education, degree: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Branch / Major</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.education.branch} onChange={e => setFormData({ ...formData, education: { ...formData.education, branch: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Graduation Year</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.education.year} onChange={e => setFormData({ ...formData, education: { ...formData.education, year: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">CGPA</label>
                                        <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.education.cgpa} onChange={e => setFormData({ ...formData, education: { ...formData.education, cgpa: e.target.value } })} />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium">Top Skills (comma separated)</label>
                                        <input required type="text" placeholder="React, Node.js, Python..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold mb-6">Links & Cover Letter</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Resume Link (Google Drive / Cloudinary)</label>
                                        <input required type="url" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.resumeUrl} onChange={e => setFormData({ ...formData, resumeUrl: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">LinkedIn Profile</label>
                                        <input type="url" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">GitHub / Portfolio</label>
                                        <input type="url" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors" value={formData.portfolio} onChange={e => setFormData({ ...formData, portfolio: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Why should we hire you? (Cover Letter)</label>
                                        <textarea required rows={5} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 outline-none focus:border-primary transition-colors resize-none" value={formData.coverLetter} onChange={e => setFormData({ ...formData, coverLetter: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                            {step > 1 ? (
                                <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">Back</button>
                            ) : <div />}
                            <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors font-medium">
                                {step === 3 ? (isSubmitting ? 'Submitting...' : 'Submit Final Application') : 'Continue'}
                            </button>
                        </div>
                    </motion.div>

                </form>
            </div>
        </main>
    );
}
