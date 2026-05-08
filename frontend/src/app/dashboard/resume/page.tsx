'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { FileText, UploadCloud, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResumeAnalysis {
    atsScore: number;
    summary: string;
    skills: string[];
    suggestions: string[];
}

export default function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) return;
        setIsLoading(true);

        try {
            const { data } = await api.post('/ai/resume/analyze', { resumeText });
            setAnalysis(data.analysis);
        } catch {
            alert('Failed to analyze resume. Make sure you pasted enough text.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">AI Resume Analyzer</h1>
                    <p className="text-muted-foreground">Paste your resume text to get an instant ATS score and improvement suggestions.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 flex-1">
                {/* Input area */}
                <div className="glass-card flex flex-col h-full overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-accent" />
                        <h2 className="font-semibold">Paste Resume Text</h2>
                    </div>
                    <textarea
                        className="flex-1 w-full bg-transparent resize-none p-6 outline-none text-white/90 placeholder:text-white/20"
                        placeholder="Paste the plain text of your resume here..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                    />
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !resumeText}
                            className="w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Analyzing with AI...' : 'Analyze My Resume'}
                        </button>
                    </div>
                </div>

                {/* Output area */}
                <div className="glass-card h-full flex flex-col overflow-hidden relative">
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold">AI Analysis Report</h2>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto">
                        {!analysis && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-50">
                                <FileText className="w-16 h-16" />
                                <p>Paste your resume and click analyze to see results.</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-accent space-y-4">
                                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                                <p className="animate-pulse font-medium">Extracting your skills...</p>
                            </div>
                        )}

                        {analysis && !isLoading && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* ATS Score */}
                                <div className="text-center p-6 bg-black/20 rounded-2xl border border-white/5">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">ATS Compatibility Score</h3>
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="w-32 h-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                            <circle cx="64" cy="64" r="56" fill="transparent" stroke={analysis.atsScore > 75 ? '#22c55e' : analysis.atsScore > 50 ? '#eab308' : '#ef4444'} strokeWidth="8" strokeDasharray="351.86" strokeDashoffset={351.86 - (351.86 * analysis.atsScore) / 100} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute text-3xl font-bold">{analysis.atsScore}%</span>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Summary View</h3>
                                    <p className="text-sm leading-relaxed text-white/90">{analysis.summary}</p>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Extracted Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.skills.map((skill: string) => (
                                            <span key={skill} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/20">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Key Improvements</h3>
                                    <ul className="space-y-3">
                                        {analysis.suggestions.map((suggestion: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm items-start bg-destructive/10 p-3 rounded-xl border border-destructive/20 text-red-200">
                                                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                                <span>{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
