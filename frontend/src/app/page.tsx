'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from '@/components/layout/Navbar';
import { ArrowRight, Bot, Compass, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    // GSAP Scroll Animations
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        },
      });

      gsap.from('.company-logo', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.companies-section',
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen">
      <Navbar />

      {/* Background Animated Gradient / Shapes */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <motion.div style={{ y }} className="container mx-auto max-w-7xl relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/20 mb-8"
          >
            <SparklesIcon className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-white/90">Powered by Next-Gen AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-outfit text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight"
          >
            Your Real-World <br className="hidden md:block" />
            <span className="text-gradient">Internship Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-12 leading-relaxed"
          >
            Stop endlessly searching. Let our AI match you with live opportunities from Google, Amazon, Microsoft, and 500+ top companies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          >
            <Link
              href="/internships"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
            >
              Explore Openings <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full glass font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              AI Resume Analyzer <Bot className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Floating UI Mocks */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 relative w-full max-w-5xl animate-float"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-full w-full pointer-events-none" />
            <div className="relative h-[300px] md:h-[500px] w-full">
              <Image 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                alt="Dashboard Preview" 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="rounded-t-2xl border-t border-l border-r border-white/10 opacity-50 select-none object-cover" 
                priority
              />
            </div>

            {/* Overlay Cards to create a layered "UI mockup" feel without actual images */}
            <div className="absolute top-10 left-10 md:top-20 md:left-20 glass-card p-4 flex items-center gap-4 z-20 shadow-2xl">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold">98%</span>
              </div>
              <div>
                <p className="text-sm text-white/50">Resume ATS Score</p>
                <p className="font-bold">Highly Compatible</p>
              </div>
            </div>

            <div className="absolute bottom-20 right-10 md:bottom-32 md:right-20 glass-card p-4 flex gap-4 z-20 shadow-2xl max-w-xs">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-white/80">&quot;I found 3 new matches at Microsoft based on your latest Python projects.&quot;</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Companies Marquee */}
      <section className="companies-section py-20 border-y border-white/5 bg-secondary/20">
        <div className="container mx-auto px-6 text-center max-w-7xl">
          <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-10">Aggregating live opportunities from</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-80 mix-blend-luminosity">
            {/* Simple logo representations */}
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company) => (
              <div key={company} className="company-logo text-2xl md:text-3xl font-extrabold text-white/60 hover:text-white transition-colors cursor-default">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-section py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="font-outfit text-3xl md:text-5xl font-bold mb-6">Everything you need to <br /><span className="text-gradient">land your dream offer</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We combine real-time data aggregation with AI assistance to give you an unfair advantage in your job search.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card glass-card p-8 group hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Live Discovery</h3>
              <p className="text-muted-foreground">Aggregates real-time internships directly from top MNC careers sites and premium job boards.</p>
            </div>

            <div className="feature-card glass-card p-8 group hover:border-accent/50 transition-colors">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI Analyzer</h3>
              <p className="text-muted-foreground">Drop your resume, and our AI will extract your skills, score your ATS compatibility, and suggest improvements.</p>
            </div>

            <div className="feature-card glass-card p-8 group hover:border-green-500/50 transition-colors">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-4">Smart Matching</h3>
              <p className="text-muted-foreground">We automatically match your extracted skills against live requirements to deliver personalized recommendations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-5xl mt-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[3rem] p-12 md:p-20 text-center border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h2 className="relative z-10 font-outfit text-4xl md:text-6xl font-bold mb-8">Ready to jumpstart your career?</h2>
          <p className="relative z-10 text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join thousands of students who have found their dream internships using InternTracker AI.
          </p>
          <Link
            href="/register"
            className="relative z-10 px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform inline-flex shadow-2xl"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} InternTracker AI. Crafted for the ambitious.</p>
      </footer>
    </main>
  );
}

function SparklesIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
