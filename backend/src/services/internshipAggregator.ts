import axios from 'axios';
import { env } from '../config/env';
import { Internship } from '../models/Internship';

interface AdzunaResult {
    id: string;
    title: string;
    company: { display_name: string };
    description: string;
    location: { display_name: string };
    redirect_url: string;
    salary_min?: number;
    salary_max?: number;
    created: string;
    category: { label: string };
}

interface RemotiveResult {
    id: number;
    url: string;
    title: string;
    company_name: string;
    company_logo?: string;
    category: string;
    tags: string[];
    job_type: string;
    publication_date: string;
    candidate_required_location: string;
    salary?: string;
    description: string;
}

// Extensive seed data for companies that don't have API access
const MNC_SEED_INTERNSHIPS = [
    {
        externalId: 'google-swe-intern-2024',
        source: 'manual' as const,
        title: 'Software Engineering Intern',
        companyName: 'Google',
        
        description: 'Join Google\'s engineering team and work on products used by billions of people worldwide. As a Software Engineering Intern, you\'ll contribute to real projects that impact users globally. You\'ll work alongside experienced engineers using cutting-edge technology.',
        responsibilities: ['Design and implement new features', 'Write clean, efficient code', 'Collaborate with cross-functional teams', 'Participate in code reviews', 'Present work to stakeholders'],
        requirements: ['Pursuing BS/MS in CS or related field', 'Strong coding skills in Python, Java, or C++', 'Understanding of data structures and algorithms', 'Problem-solving mindset'],
        skills: ['Python', 'Java', 'C++', 'Data Structures', 'Algorithms', 'Git'],
        domain: 'Software Engineering',
        location: 'Mountain View, CA',
        type: 'onsite' as const,
        duration: '12 weeks',
        stipend: { min: 8000, max: 10000, currency: 'USD', period: 'month' },
        applyUrl: 'https://careers.google.com/students/',
        isActive: true,
        isFeatured: true,
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'microsoft-swe-intern-2024',
        source: 'manual' as const,
        title: 'Software Engineering Intern',
        companyName: 'Microsoft',
        
        description: 'Microsoft interns work on real projects that ship to millions of customers. You\'ll be mentored by experienced engineers, attend exclusive intern events, and gain exposure to world-class technology. Projects span Azure, Office, Xbox, and more.',
        responsibilities: ['Develop features for Microsoft products', 'Work with mentors on impactful projects', 'Attend intern-specific training sessions', 'Contribute to open-source projects'],
        requirements: ['Pursuing BS/MS in CS, CE, or related field', 'Proficiency in C#, Python, JavaScript, or Java', 'Passion for technology and innovation'],
        skills: ['C#', 'Python', 'JavaScript', 'Azure', '.NET', 'TypeScript'],
        domain: 'Software Engineering',
        location: 'Redmond, WA',
        type: 'hybrid' as const,
        duration: '12 weeks',
        stipend: { min: 7500, max: 9000, currency: 'USD', period: 'month' },
        applyUrl: 'https://careers.microsoft.com/students/',
        isActive: true,
        isFeatured: true,
        postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'amazon-sde-intern-2024',
        source: 'manual' as const,
        title: 'SDE Intern',
        companyName: 'Amazon',
        
        description: 'Amazon\'s internship program gives you ownership over real projects that affect millions of customers. You\'ll work in a fast-paced environment with access to cutting-edge cloud services through AWS and mentorship from experienced Amazonians.',
        responsibilities: ['Design scalable solutions', 'Write production-quality code', 'Participate in on-call rotations', 'Lead design reviews'],
        requirements: ['Pursuing BS/MS in CS or related field', 'Strong OOP skills', 'Experience with at least one programming language', 'Leadership principles alignment'],
        skills: ['Java', 'Python', 'AWS', 'Distributed Systems', 'SQL', 'System Design'],
        domain: 'Software Engineering',
        location: 'Seattle, WA',
        type: 'onsite' as const,
        duration: '12 weeks',
        stipend: { min: 8500, max: 9500, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.amazon.jobs/en/teams/internships-for-students',
        isActive: true,
        isFeatured: true,
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'meta-swe-intern-2024',
        source: 'manual' as const,
        title: 'Software Engineer Intern',
        companyName: 'Meta',
        
        description: 'Meta interns work on AI, AR/VR, and social technology that connects billions of people. You\'ll have the opportunity to work on products like WhatsApp, Instagram, Facebook, or cutting-edge metaverse projects.',
        responsibilities: ['Build and maintain Meta\'s core infrastructure', 'Work on AI/ML models', 'Collaborate with product teams', 'Contribute to open-source projects'],
        requirements: ['Pursuing BS/MS in CS or related field', 'Strong C++, Python, or PHP skills', 'Experience with large-scale distributed systems'],
        skills: ['C++', 'Python', 'React', 'PyTorch', 'Hack/PHP', 'GraphQL'],
        domain: 'Software Engineering',
        location: 'Menlo Park, CA',
        type: 'hybrid' as const,
        duration: '12 weeks',
        stipend: { min: 8000, max: 10000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.metacareers.com/careerprograms/students/',
        isActive: true,
        isFeatured: true,
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'apple-swe-intern-2024',
        source: 'manual' as const,
        title: 'Software Engineering Intern',
        companyName: 'Apple',
        
        description: 'At Apple, you\'ll make an impact from day one. Our interns work on real features that ship to millions of customers through iOS, macOS, watchOS, and our other platforms and services.',
        responsibilities: ['Develop features for Apple platforms', 'Work on system-level software', 'Perform code reviews', 'Prototype new product ideas'],
        requirements: ['Pursuing BS/MS in CS or related field', 'Proficiency in Swift, Objective-C, or C/C++', 'Passion for Apple products and ecosystem'],
        skills: ['Swift', 'Objective-C', 'C++', 'Xcode', 'Core ML', 'ARKit'],
        domain: 'Mobile Development',
        location: 'Cupertino, CA',
        type: 'onsite' as const,
        duration: '12 weeks',
        stipend: { min: 7000, max: 9000, currency: 'USD', period: 'month' },
        applyUrl: 'https://jobs.apple.com/en-us/search?team=internships-STDNT-INTRN',
        isActive: true,
        isFeatured: true,
        postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'nvidia-ml-intern-2024',
        source: 'manual' as const,
        title: 'Deep Learning / AI Research Intern',
        companyName: 'NVIDIA',
        
        description: 'NVIDIA is the world leader in accelerated computing. As an AI Research Intern, you\'ll work with world-class researchers on cutting-edge deep learning, computer vision, and GPU computing projects.',
        responsibilities: ['Research and develop new DL algorithms', 'Work on CUDA programming', 'Publish research papers', 'Collaborate with product teams'],
        requirements: ['Pursuing PhD/MS in CS, EE, or Math', 'Strong background in ML/DL', 'Experience with PyTorch or TensorFlow', 'CUDA knowledge a plus'],
        skills: ['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'Computer Vision', 'NLP', 'C++'],
        domain: 'AI/ML',
        location: 'Santa Clara, CA',
        type: 'onsite' as const,
        duration: '16 weeks',
        stipend: { min: 8500, max: 11000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'tesla-software-intern-2024',
        source: 'manual' as const,
        title: 'Software Engineering Intern - Autopilot',
        companyName: 'Tesla',
        
        description: 'Join Tesla\'s Autopilot team to work on the software powering the world\'s most advanced electric vehicles. You\'ll work on perception, planning, and control systems using real-world data.',
        responsibilities: ['Develop Autopilot software', 'Work on computer vision pipelines', 'Implement safety-critical features', 'Analyze real-world driving data'],
        requirements: ['Pursuing BS/MS in CS, EE, or Robotics', 'Strong C++ and Python skills', 'Experience with deep learning frameworks', 'Interest in autonomous vehicles'],
        skills: ['C++', 'Python', 'PyTorch', 'Computer Vision', 'ROS', 'CUDA'],
        domain: 'Autonomous Systems',
        location: 'Palo Alto, CA',
        type: 'onsite' as const,
        duration: '16 weeks',
        stipend: { min: 8000, max: 10000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.tesla.com/careers/search/job-intern',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'infosys-ste-intern-2024',
        source: 'manual' as const,
        title: 'Systems Engineer Trainee',
        companyName: 'Infosys',
        
        description: 'Infosys\' flagship training program for fresh engineering graduates. Receive 3 months of intensive training in software development, followed by project placement in a technology domain.',
        responsibilities: ['Complete technology training modules', 'Work on live client projects', 'Participate in hackathons', 'Develop communication and presentation skills'],
        requirements: ['B.E./B.Tech in any stream', 'Minimum 60% throughout academics', 'No backlogs', 'Strong logical reasoning'],
        skills: ['Java', 'Python', 'SQL', 'HTML/CSS', 'JavaScript', 'UNIX'],
        domain: 'IT Services',
        location: 'Mysuru / Bangalore, India',
        type: 'onsite' as const,
        duration: '6 months',
        stipend: { min: 25000, max: 35000, currency: 'INR', period: 'month' },
        applyUrl: 'https://www.infosys.com/careers/apply.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'tcs-nqt-intern-2024',
        source: 'manual' as const,
        title: 'Ninja / Digital Intern',
        companyName: 'TCS',
        
        description: 'TCS NextStep internship and trainee program for engineering students. Work alongside India\'s largest IT services company on digital transformation projects for global enterprise clients.',
        responsibilities: ['Develop enterprise software solutions', 'Participate in agile sprints', 'Create technical documentation', 'Interact with global clients'],
        requirements: ['B.E./B.Tech/B.Sc/BCA/MCA/M.Sc', '60% aggregate throughout', 'No active backlogs', 'TCS NQT qualified'],
        skills: ['Java', 'Python', 'SQL', 'Agile', 'HTML/CSS', 'JavaScript'],
        domain: 'IT Services',
        location: 'Pan India',
        type: 'hybrid' as const,
        duration: '6 months',
        stipend: { min: 20000, max: 40000, currency: 'INR', period: 'month' },
        applyUrl: 'https://nextstep.tcs.com/',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'zoho-campus-intern-2024',
        source: 'manual' as const,
        title: 'Software Developer Intern',
        companyName: 'Zoho',
        
        description: 'Zoho\'s internship program is one of India\'s most sought after. Work on real products used by millions of businesses globally. Products include CRM, Books, Mail, Creator, and 50+ others.',
        responsibilities: ['Build features for Zoho product suite', 'Own end-to-end feature development', 'Collaborate with experienced engineers', 'Present work to leadership'],
        requirements: ['Pursuing or completed B.E./B.Tech in CS/IT/ECE', 'Strong programming fundamentals', 'Problem-solving aptitude', 'Self-motivated learner'],
        skills: ['Java', 'JavaScript', 'React', 'MySQL', 'Deluge (Zoho)', 'REST APIs'],
        domain: 'SaaS / Product',
        location: 'Chennai, India',
        type: 'onsite' as const,
        duration: '6 months',
        stipend: { min: 20000, max: 30000, currency: 'INR', period: 'month' },
        applyUrl: 'https://careers.zohocorp.com/jobs/Careers',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'adobe-research-intern-2024',
        source: 'manual' as const,
        title: 'Research Scientist Intern - AI/ML',
        companyName: 'Adobe',
        
        description: 'Adobe Research is pioneering the future of digital experiences. As a Research Intern, you\'ll work on generative AI, computer graphics, and content intelligence that powers products like Firefly, Photoshop, and Premiere Pro.',
        responsibilities: ['Research generative AI algorithms', 'Implement and test ML models', 'Publish papers at top conferences', 'Collaborate with product teams to productionize research'],
        requirements: ['Pursuing PhD in CS, EE, or Statistics', 'Expertise in deep learning', 'Publications at NeurIPS/CVPR/ICCV a plus'],
        skills: ['Python', 'PyTorch', 'Computer Vision', 'Generative AI', 'Diffusion Models', 'GANs'],
        domain: 'AI Research',
        location: 'San Jose, CA',
        type: 'hybrid' as const,
        duration: '12 weeks',
        stipend: { min: 9000, max: 12000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.adobe.com/careers/early-career.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'wipro-elite-intern-2024',
        source: 'manual' as const,
        title: 'Elite NLTH Trainee',
        companyName: 'Wipro',
        
        description: 'Wipro\'s Elite National Level Talent Hunt (NLTH) program identifies top engineering talent for fast-tracked careers. Selected candidates receive premium training and placement at Wipro\'s innovation centers.',
        responsibilities: ['Complete elite training curriculum', 'Work on digital transformation projects', 'Get certified in cloud and AI technologies', 'Mentor junior trainees'],
        requirements: ['B.E./B.Tech in CS/IT/ECE/EEE', '70% or above throughout academics', 'No backlogs', 'Wipro NLTH score above 80th percentile'],
        skills: ['Python', 'Java', 'Cloud (AWS/Azure)', 'AI/ML', 'DevOps', 'Agile'],
        domain: 'IT Services',
        location: 'Bengaluru / Hyderabad, India',
        type: 'hybrid' as const,
        duration: '6 months',
        stipend: { min: 30000, max: 45000, currency: 'INR', period: 'month' },
        applyUrl: 'https://careers.wipro.com/students.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'deloitte-tech-intern-2024',
        source: 'manual' as const,
        title: 'Technology Analyst Intern',
        companyName: 'Deloitte',
        
        description: 'Deloitte\'s Technology internship program gives you hands-on experience in cloud, cybersecurity, data analytics, and emerging technologies while serving Fortune 500 clients.',
        responsibilities: ['Assist in technology consulting projects', 'Analyze client technology needs', 'Implement cloud and digital solutions', 'Create executive presentations'],
        requirements: ['Pursuing BS/MS in CS, MIS, or related field', 'Strong analytical skills', 'Interest in consulting', 'Excel and data analysis skills'],
        skills: ['Cloud Computing', 'Data Analytics', 'Cybersecurity', 'Python', 'Power BI', 'Azure'],
        domain: 'Technology Consulting',
        location: 'New York / Chicago / Dallas',
        type: 'hybrid' as const,
        duration: '10 weeks',
        stipend: { min: 5000, max: 7000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www2.deloitte.com/us/en/pages/careers/articles/join-deloitte.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'ibm-research-intern-2024',
        source: 'manual' as const,
        title: 'Research Intern - AI & Quantum',
        companyName: 'IBM',
        
        description: 'IBM Research is one of the world\'s largest research organizations. Work on quantum computing, AI ethics, hybrid cloud, and enterprise AI. Projects directly impact IBM\'s next-generation products.',
        responsibilities: ['Conduct research in quantum computing or AI', 'Develop proofs of concept', 'Publish at top academic venues', 'Work with IBM\'s patent team'],
        requirements: ['Pursuing PhD/MS in CS, Physics, Math, or EE', 'Strong theoretical background', 'Experience with quantum computing or ML'],
        skills: ['Python', 'Qiskit', 'Machine Learning', 'NLP', 'Cloud Native', 'Mathematics'],
        domain: 'AI/Quantum Research',
        location: 'Yorktown Heights, NY / Remote',
        type: 'hybrid' as const,
        duration: '12 weeks',
        stipend: { min: 6000, max: 9000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.ibm.com/employment/student.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'cognizant-gen-c-2024',
        source: 'manual' as const,
        title: 'GenC Digital Trainee',
        companyName: 'Cognizant',
        
        description: 'Cognizant\'s GenC (Generation Cognizant) program is designed for engineering graduates to build skills in digital technologies while working on live client projects.',
        responsibilities: ['Build and test enterprise applications', 'Participate in client meetings', 'Work on digital transformation projects', 'Get certified in relevant technologies'],
        requirements: ['B.E./B.Tech in any engineering discipline', '60% or above throughout', 'No active backlogs', 'Cleared Cognizant Recruitment Process'],
        skills: ['Java', '.NET', 'Python', 'React', 'SQL', 'Agile', 'Cloud'],
        domain: 'IT Services',
        location: 'Chennai / Pune / Hyderabad, India',
        type: 'onsite' as const,
        duration: '6 months',
        stipend: { min: 25000, max: 35000, currency: 'INR', period: 'month' },
        applyUrl: 'https://careers.cognizant.com/global/en/students',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'accenture-asi-intern-2024',
        source: 'manual' as const,
        title: 'Associate Software Engineer Intern',
        companyName: 'Accenture',
        
        description: 'Accenture\'s internship program exposes you to the world\'s top enterprise IT and consulting projects. Work with cutting-edge technologies like cloud, AI, blockchain, and quantum computing for Fortune 500 clients.',
        responsibilities: ['Assist in software development', 'Participate in client delivery', 'Develop cloud-native applications', 'Contribute to innovation projects'],
        requirements: ['Pursuing B.E./B.Tech or MCA', 'Strong problem-solving skills', 'Collaborative mindset', 'Interest in emerging technologies'],
        skills: ['Java', 'Python', 'Cloud', 'React', 'SQL', 'Angular', 'DevOps'],
        domain: 'IT Consulting',
        location: 'Bengaluru / Pune / Hyderabad, India',
        type: 'hybrid' as const,
        duration: '6 months',
        stipend: { min: 22000, max: 38000, currency: 'INR', period: 'month' },
        applyUrl: 'https://www.accenture.com/in-en/careers/local/campus',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'siemens-tech-intern-2024',
        source: 'manual' as const,
        title: 'Technology Innovation Intern',
        companyName: 'Siemens',
        
        description: 'Siemens Technology interns work on Industry 4.0, digital twins, IoT, and AI-powered industrial automation. Be part of the team shaping the future of manufacturing, infrastructure, and healthcare.',
        responsibilities: ['Develop IoT and industrial software', 'Work on digital twin projects', 'Implement AI/ML for predictive maintenance', 'Collaborate with global engineering teams'],
        requirements: ['Pursuing B.E. in CS, EE, Mechatronics, or ME', 'Strong programming skills', 'Knowledge of embedded systems or AI'],
        skills: ['Python', 'C++', 'IoT', 'Machine Learning', 'SCADA', 'PLC Programming', 'Edge Computing'],
        domain: 'Industrial Tech / IoT',
        location: 'Bengaluru / Pune, India',
        type: 'onsite' as const,
        duration: '6 months',
        stipend: { min: 30000, max: 50000, currency: 'INR', period: 'month' },
        applyUrl: 'https://jobs.siemens.com/jobs?types=students&country=India',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'capgemini-fresher-intern-2024',
        source: 'manual' as const,
        title: 'Fresher / Analyst Intern',
        companyName: 'Capgemini',
        
        description: 'Capgemini\'s internship program offers fresh graduates an opportunity to work with global clients on transformation projects, with training in cloud, data, and AI technologies.',
        responsibilities: ['Develop enterprise applications', 'Work on data engineering pipelines', 'Assist in cloud migration projects', 'Create test cases and documentation'],
        requirements: ['B.E./B.Tech/MCA graduates', '60% cumulative aggregate', 'No active backlogs', 'Valid Capgemini assessment score'],
        skills: ['Java', 'Python', 'SQL', 'Cloud', 'Agile', 'JIRA'],
        domain: 'IT Consulting',
        location: 'Mumbai / Pune / Chennai, India',
        type: 'hybrid' as const,
        duration: '6 months',
        stipend: { min: 22000, max: 35000, currency: 'INR', period: 'month' },
        applyUrl: 'https://www.capgemini.com/in-en/careers/',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'oracle-cloud-intern-2024',
        source: 'manual' as const,
        title: 'Cloud Infrastructure Engineer Intern',
        companyName: 'Oracle',
        
        description: 'Work on Oracle Cloud Infrastructure (OCI), one of the world\'s leading enterprise cloud platforms. Build services at massive scale that power the most demanding enterprise workloads.',
        responsibilities: ['Build and maintain cloud services', 'Work on distributed systems', 'Implement security best practices', 'Contribute to OCI product roadmap'],
        requirements: ['Pursuing BS/MS in CS or EE', 'Strong Java or C++ skills', 'Understanding of networking and operating systems'],
        skills: ['Java', 'C++', 'Distributed Systems', 'Cloud Native', 'Kubernetes', 'Linux'],
        domain: 'Cloud Computing',
        location: 'Austin, TX / Seattle, WA',
        type: 'onsite' as const,
        duration: '12 weeks',
        stipend: { min: 7000, max: 9500, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.oracle.com/careers/students-grads/',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'cisco-network-intern-2024',
        source: 'manual' as const,
        title: 'Network Software Engineer Intern',
        companyName: 'Cisco',
        
        description: 'Cisco is the worldwide leader in IT and networking. Interns work on next-generation networking, security, collaboration, and cloud solutions that power the internet.',
        responsibilities: ['Develop network software and protocols', 'Work on security features', 'Test and validate networking solutions', 'Engage with open-source networking communities'],
        requirements: ['Pursuing BS/MS in CS, CE, or EE', 'Strong Python and C skills', 'Knowledge of networking protocols (TCP/IP, BGP, OSPF)'],
        skills: ['Python', 'C', 'Networking', 'Linux', 'Docker', 'Kubernetes', 'IOS XR'],
        domain: 'Networking / Security',
        location: 'San Jose, CA',
        type: 'hybrid' as const,
        duration: '12 weeks',
        stipend: { min: 6500, max: 8500, currency: 'USD', period: 'month' },
        applyUrl: 'https://jobs.cisco.com/jobs/SearchJobs/intern?21178=%5B169482%5D',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
        externalId: 'intel-chip-intern-2024',
        source: 'manual' as const,
        title: 'Software/Hardware Engineering Intern',
        companyName: 'Intel',
        
        description: 'Intel drives innovation in cloud computing, AI, data analytics, and autonomous vehicles. Interns contribute to next-generation processor design, AI frameworks, and cloud platforms.',
        responsibilities: ['Work on silicon architecture or firmware', 'Develop AI software frameworks', 'Optimize compiler and toolchain', 'Test and validate hardware designs'],
        requirements: ['Pursuing BS/MS in EE, CE, or CS', 'Strong C/C++ skills', 'Knowledge of computer architecture or digital design'],
        skills: ['C/C++', 'Python', 'VHDL/Verilog', 'Computer Architecture', 'OpenVINO', 'Machine Learning'],
        domain: 'Hardware / AI',
        location: 'Santa Clara, CA / Hillsboro, OR',
        type: 'onsite' as const,
        duration: '12 weeks',
        stipend: { min: 7000, max: 9000, currency: 'USD', period: 'month' },
        applyUrl: 'https://www.intel.com/content/www/us/en/jobs/locations/united-states/students.html',
        isActive: true,
        isFeatured: false,
        postedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    },
];

export class InternshipAggregator {
    // Fetch from Adzuna API
    static async fetchFromAdzuna(keywords = 'software engineer intern', page = 1): Promise<any[]> {
        if (!env.ADZUNA_APP_ID || !env.ADZUNA_API_KEY) {
            console.log('⚠️  Adzuna credentials not configured, skipping...');
            return [];
        }

        try {
            const response = await axios.get(
                `https://api.adzuna.com/v1/api/jobs/us/search/${page}`,
                {
                    params: {
                        app_id: env.ADZUNA_APP_ID,
                        app_key: env.ADZUNA_API_KEY,
                        results_per_page: 20,
                        what: keywords,
                        what_and: 'intern internship',
                        sort_by: 'date',
                        content_type: 'application/json',
                    },
                    timeout: 10000,
                }
            );

            return (response.data.results || []).map((job: AdzunaResult) => ({
                externalId: `adzuna-${job.id}`,
                source: 'adzuna',
                title: job.title,
                companyName: job.company.display_name,
                description: job.description,
                skills: [],
                domain: job.category.label,
                location: job.location.display_name,
                type: 'onsite',
                duration: '3 months',
                stipend: {
                    min: job.salary_min || 0,
                    max: job.salary_max || 0,
                    currency: 'USD',
                    period: 'month',
                },
                applyUrl: job.redirect_url,
                postedAt: new Date(job.created),
                isActive: true,
                isFeatured: false,
            }));
        } catch (err) {
            console.error('Adzuna fetch error:', err);
            return [];
        }
    }

    // Fetch from Remotive API (free, no key needed)
    static async fetchFromRemotive(): Promise<any[]> {
        try {
            const response = await axios.get('https://remotive.com/api/remote-jobs', {
                params: { category: 'software-dev', limit: 20, search: 'intern' },
                timeout: 10000,
            });

            return (response.data.jobs || [])
                .filter((job: RemotiveResult) =>
                    job.title.toLowerCase().includes('intern') ||
                    job.title.toLowerCase().includes('trainee') ||
                    job.title.toLowerCase().includes('junior')
                )
                .map((job: RemotiveResult) => ({
                    externalId: `remotive-${job.id}`,
                    source: 'remotive',
                    title: job.title,
                    companyName: job.company_name,
                    companyLogo: job.company_logo,
                    description: job.description?.replace(/<[^>]*>/g, '').substring(0, 1000) || '',
                    skills: job.tags || [],
                    domain: job.category,
                    location: job.candidate_required_location || 'Remote',
                    type: 'remote',
                    duration: '3 months',
                    stipend: { min: 0, max: 0, currency: 'USD', period: 'month' },
                    applyUrl: job.url,
                    postedAt: new Date(job.publication_date),
                    isActive: true,
                    isFeatured: false,
                }));
        } catch (err) {
            console.error('Remotive fetch error:', err);
            return [];
        }
    }

    // Seed MNC internship data
    static async seedMNCInternships(): Promise<void> {
        for (const internship of MNC_SEED_INTERNSHIPS) {
            try {
                await Internship.findOneAndUpdate(
                    { externalId: internship.externalId },
                    { $set: internship },
                    { upsert: true, new: true }
                );
            } catch (err) {
                console.error(`Error seeding internship ${internship.externalId}:`, err);
            }
        }
        console.log(`✅ Seeded ${MNC_SEED_INTERNSHIPS.length} MNC internship listings`);
    }

    // Main aggregation function
    static async aggregate(): Promise<void> {
        console.log('🔄 Starting internship aggregation...');

        await this.seedMNCInternships();

        const [adzunaJobs, remotiveJobs] = await Promise.all([
            this.fetchFromAdzuna('software engineer intern'),
            this.fetchFromRemotive(),
        ]);

        const allJobs = [...adzunaJobs, ...remotiveJobs];

        for (const job of allJobs) {
            try {
                await Internship.findOneAndUpdate(
                    { externalId: job.externalId },
                    { $setOnInsert: job },
                    { upsert: true, new: true }
                );
            } catch (err) {
                // Skip duplicates
            }
        }

        console.log(`✅ Aggregation complete. Added ${allJobs.length} external listings.`);
    }
}
