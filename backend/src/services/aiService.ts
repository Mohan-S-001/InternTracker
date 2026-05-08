import OpenAI from 'openai';
import { env } from '../config/env';

let openai: OpenAI | null = null;
if (env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `You are InternBot, an expert AI career assistant for InternTracker AI - a premium internship and career platform.

You help students:
- Find the right internships based on their skills and interests
- Improve their resumes and cover letters
- Prepare for technical interviews
- Navigate their career paths
- Understand industry trends and in-demand skills
- Suggest learning roadmaps

Always be:
- Friendly, encouraging, and professional
- Specific and actionable in your advice
- Knowledgeable about tech, finance, consulting, and engineering domains
- Helpful in both the US and Indian job markets

Keep responses concise but comprehensive (max 300 words unless asked for more).`;

export const chatWithAI = async (
    messages: { role: 'user' | 'assistant'; content: string }[],
    userContext?: string
): Promise<string> => {
    if (!openai) {
        return getFallbackResponse(messages[messages.length - 1]?.content || '');
    }

    try {
        const systemMessage = userContext
            ? `${SYSTEM_PROMPT}\n\nUser Context: ${userContext}`
            : SYSTEM_PROMPT;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemMessage },
                ...messages.slice(-10), // last 10 messages for context
            ],
            max_tokens: 500,
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || 'I couldn\'t generate a response. Please try again.';
    } catch (err) {
        console.error('OpenAI error:', err);
        return getFallbackResponse(messages[messages.length - 1]?.content || '');
    }
};

export const analyzeResume = async (resumeText: string): Promise<{
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
    certifications: string[];
    atsScore: number;
    suggestions: string[];
    summary: string;
}> => {
    if (!openai) {
        return getMockResumeAnalysis(resumeText);
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional resume analyzer. Extract information from the resume and return ONLY valid JSON. Never include markdown code blocks or extra text.`,
                },
                {
                    role: 'user',
                    content: `Analyze this resume and return a JSON object with these fields:
- skills: array of technical and soft skills found
- experience: array of work/internship experiences (brief descriptions)
- education: array of educational qualifications
- projects: array of project names/descriptions
- certifications: array of certifications
- atsScore: ATS compatibility score from 0-100 (be realistic)
- suggestions: array of 5 specific improvement suggestions
- summary: brief 2-sentence professional summary of the candidate

Resume text:
${resumeText.substring(0, 3000)}`,
                },
            ],
            max_tokens: 1000,
            temperature: 0.3,
        });

        const content = response.choices[0]?.message?.content || '{}';
        return JSON.parse(content);
    } catch (err) {
        console.error('Resume analysis error:', err);
        return getMockResumeAnalysis(resumeText);
    }
};

export const getInternshipRecommendations = async (
    skills: string[],
    preferences: { domain?: string; location?: string; type?: string }
): Promise<string[]> => {
    const skillList = skills.join(', ');
    const prefText = JSON.stringify(preferences);

    if (!openai) {
        return ['Software Engineering', 'Web Development', 'Data Science', 'Cloud Computing'];
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: `Based on these skills: ${skillList} and preferences: ${prefText}, suggest the top 5 internship domains/roles. Return only a JSON array of strings.`,
                },
            ],
            max_tokens: 100,
        });

        return JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch {
        return ['Software Engineering', 'Data Science', 'Cloud Computing'];
    }
};

const getFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('resume') || msg.includes('cv')) {
        return "📄 **Resume Tips**: Keep your resume to 1 page (2 for experienced candidates). Use action verbs, quantify achievements (e.g., 'Improved performance by 40%'), and tailor it to each job description. Include a skills section with relevant tech stack. Want me to review your resume? Use the AI Resume Analyzer in your dashboard!";
    }
    if (msg.includes('interview')) {
        return "💡 **Interview Prep**: Practice STAR method for behavioral questions. For technical interviews: review data structures, algorithms, and system design. Do 3-5 LeetCode problems daily. Research the company beforehand. What company/role are you interviewing for? I can give specific tips!";
    }
    if (msg.includes('skill') || msg.includes('learn')) {
        return "🚀 **Trending Skills in 2024**: For software: Python, TypeScript, React, Kubernetes, AWS. For AI/ML: PyTorch, LangChain, RAG, Vector Databases. For data: SQL, Spark, Tableau. Start with fundamentals, then pick a specialization. Which domain interests you most?";
    }
    if (msg.includes('google') || msg.includes('amazon') || msg.includes('microsoft')) {
        return "🏢 **FAANG Internship Tips**: Apply early (Aug-Oct for summer internships). Network via LinkedIn with employees. Prepare for 2-4 coding rounds (LeetCode Medium-Hard). Behavioral rounds follow Amazon's Leadership Principles. Check the Internships page to see their current openings!";
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "👋 Hi there! I'm **InternBot**, your AI career assistant. I can help you:\n\n• 🔍 Find the right internships for your skills\n• 📄 Improve your resume and cover letter\n• 💡 Prepare for technical interviews\n• 🗺️ Plan your career roadmap\n• 📚 Suggest skills to learn\n\nWhat would you like help with today?";
    }

    return "I'm here to help with your internship and career questions! Ask me about finding internships, improving your resume, interview preparation, or career advice. Note: AI responses require an OpenAI API key to be configured. Ask the admin to set it up for premium AI responses!";
};

const getMockResumeAnalysis = (resumeText: string) => {
    const text = resumeText.toLowerCase();
    const detectedSkills: string[] = [];

    const techKeywords = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'machine learning', 'tensorflow', 'pytorch', 'typescript', 'angular', 'vue', 'c++', 'c#', 'go', 'rust'];
    techKeywords.forEach(skill => { if (text.includes(skill)) detectedSkills.push(skill); });

    return {
        skills: detectedSkills.length > 0 ? detectedSkills : ['Programming', 'Problem Solving', 'Communication'],
        experience: ['Experience details extracted from resume'],
        education: ['Educational qualification found in resume'],
        projects: ['Projects mentioned in resume'],
        certifications: [],
        atsScore: 65,
        suggestions: [
            'Add more quantifiable achievements (e.g., "Increased efficiency by 30%")',
            'Include relevant keywords from the job description',
            'Add a professional summary at the top',
            'Ensure consistent formatting throughout',
            'Add links to GitHub, LinkedIn, and portfolio',
        ],
        summary: 'Candidate with solid technical foundation seeking internship opportunities. Profile shows potential for growth in software engineering and technology roles.',
    };
};
