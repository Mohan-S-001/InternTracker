'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layout/Navbar';
import {
    User, Mail, Phone, MapPin, GraduationCap, BookOpen, GitBranch,
    Link2, Globe, Briefcase, Save, Loader2, CheckCircle2, Plus, X, Star
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/lib/store/authSlice';

interface ProfileData {
    name: string;
    email: string;
    avatar: string;
    profile: {
        bio: string;
        phone: string;
        location: string;
        college: string;
        degree: string;
        graduationYear: string;
        cgpa: string;
        skills: string[];
        github: string;
        linkedin: string;
        portfolio: string;
    };
}

export default function ProfilePage() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [skillInput, setSkillInput] = useState('');
    const [saved, setSaved] = useState(false);

    const { data: res, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await api.get('/users/profile');
            return data.user;
        },
    });

    const [form, setForm] = useState<ProfileData>({
        name: '',
        email: '',
        avatar: '',
        profile: {
            bio: '',
            phone: '',
            location: '',
            college: '',
            degree: '',
            graduationYear: '',
            cgpa: '',
            skills: [],
            github: '',
            linkedin: '',
            portfolio: '',
        }
    });

    useEffect(() => {
        if (res) {
            setForm({
                name: res.name || '',
                email: res.email || '',
                avatar: res.avatar || '',
                profile: {
                    bio: res.profile?.bio || '',
                    phone: res.profile?.phone || '',
                    location: res.profile?.location || '',
                    college: res.profile?.college || '',
                    degree: res.profile?.degree || '',
                    graduationYear: res.profile?.graduationYear?.toString() || '',
                    cgpa: res.profile?.cgpa?.toString() || '',
                    skills: res.profile?.skills || [],
                    github: res.profile?.github || '',
                    linkedin: res.profile?.linkedin || '',
                    portfolio: res.profile?.portfolio || '',
                }
            });
        }
    }, [res]);

    const mutation = useMutation({
        mutationFn: async (payload: ProfileData) => {
            const { data } = await api.put('/users/profile', {
                name: payload.name,
                profile: {
                    ...payload.profile,
                    graduationYear: payload.profile.graduationYear ? Number(payload.profile.graduationYear) : undefined,
                    cgpa: payload.profile.cgpa ? Number(payload.profile.cgpa) : undefined,
                }
            });
            return data.user;
        },
        onSuccess: (user) => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            dispatch(updateUser({ name: user.name, profile: user.profile }));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    });

    const handleChange = (field: keyof ProfileData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleProfileChange = (field: keyof ProfileData['profile'], value: string) => {
        setForm(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (skill && !form.profile.skills.includes(skill)) {
            setForm(prev => ({ ...prev, profile: { ...prev.profile, skills: [...prev.profile.skills, skill] } }));
        }
        setSkillInput('');
    };

    const removeSkill = (skill: string) => {
        setForm(prev => ({ ...prev, profile: { ...prev.profile, skills: prev.profile.skills.filter(s => s !== skill) } }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pb-20">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-12 border-b border-white/5 bg-secondary/10">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="container mx-auto px-6 max-w-4xl relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 text-white font-bold text-3xl shadow-lg">
                        {form.name?.charAt(0) || <User className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="font-outfit text-3xl md:text-4xl font-bold">{form.name || 'Your Profile'}</h1>
                        <p className="text-muted-foreground">{form.email}</p>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-6 max-w-4xl py-12 space-y-8">

                {/* Basic Info */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><User className="w-4 h-4 text-primary" /></div>
                        Basic Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.name} onChange={e => handleChange('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="Your name" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.email} disabled className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white/40 outline-none cursor-not-allowed" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.phone} onChange={e => handleProfileChange('phone', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="+91 98765 43210" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.location} onChange={e => handleProfileChange('location', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="Chennai, India" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Bio</label>
                            <textarea value={form.profile.bio} onChange={e => handleProfileChange('bio', e.target.value)} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors resize-none" placeholder="Tell us a little about yourself..." />
                        </div>
                    </div>
                </motion.div>

                {/* Education */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"><GraduationCap className="w-4 h-4 text-accent" /></div>
                        Education
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">College / University</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.college} onChange={e => handleProfileChange('college', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="Anna University" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Degree</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.degree} onChange={e => handleProfileChange('degree', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="B.E. Computer Science" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Graduation Year</label>
                            <input value={form.profile.graduationYear} onChange={e => handleProfileChange('graduationYear', e.target.value)} type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="2026" />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">CGPA</label>
                            <div className="relative">
                                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.cgpa} onChange={e => handleProfileChange('cgpa', e.target.value)} type="number" step="0.01" max="10" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="8.5" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Skills */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center"><Briefcase className="w-4 h-4 text-green-500" /></div>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                        {form.profile.skills.map(skill => (
                            <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-sm font-medium text-primary">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <input
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors"
                            placeholder="Add a skill (e.g. Python, React) and press Enter"
                        />
                        <button onClick={addSkill} className="px-5 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Links */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center"><Globe className="w-4 h-4 text-blue-400" /></div>
                        Links & Portfolio
                    </h2>
                    <div className="grid md:grid-cols-1 gap-6">
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">GitHub</label>
                            <div className="relative">
                                <GitBranch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.github} onChange={e => handleProfileChange('github', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="https://github.com/username" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">LinkedIn</label>
                            <div className="relative">
                                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.linkedin} onChange={e => handleProfileChange('linkedin', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="https://linkedin.com/in/username" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Portfolio Website</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input value={form.profile.portfolio} onChange={e => handleProfileChange('portfolio', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-colors" placeholder="https://yourportfolio.dev" />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={() => mutation.mutate(form)}
                        disabled={mutation.isPending}
                        className="flex items-center gap-3 px-10 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                    >
                        {mutation.isPending ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : saved ? (
                            <><CheckCircle2 className="w-5 h-5 text-green-400" /> Saved!</>
                        ) : (
                            <><Save className="w-5 h-5" /> Save Profile</>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
