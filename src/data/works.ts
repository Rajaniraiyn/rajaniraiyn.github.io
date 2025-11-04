export type TimelineEntry = {
    date: string;
    title: string;
    content: string;
};

export type Work = {
    title: string
    company: string
    companyUrl: string
    icon: string
    startDate: string
    endDate: string
    timeline: TimelineEntry[]
}

export const COMPANIES = ['portal', 'santa'] as const

export type Company = (typeof COMPANIES)[number]

export const abacusTimeline: TimelineEntry[] = [
    {
        date: "Jan 2025",
        title: "CodeLLM Launch & VS Code Fork",
        content:
            "Architected CodeLLM (codellm.abacus.ai), an AI-first VS Code fork owning the CLI agent, end-to-end autocomplete UX, and an agentic 'edit this' pipeline with diff/patch handling and undo/redo capabilities embedded in the editor. Basically, VS Code but with AI superpowers.",
    },
    {
        date: "Q1 2025",
        title: "LLM Integration & Performance Wizardry",
        content:
            "Integrated LLM features deep in the VS Code codebase (language servers, inline suggestions, code actions) without performance regressions, trimming autocomplete E2E latency by ~3% and enhancing developer experience through thoughtful UI/UX improvements. Made AI feel fast and natural.",
    },
    {
        date: "Ongoing",
        title: "Extension Suite & Developer Tools",
        content:
            "Built and maintain a suite of custom VS Code extensions (model router, context gatherer, inline chat/tools, telemetry), managing versioning, releases, and backward compatibility. Plus, led code reviews and mentored contributors across the fork, raising code quality and consistency.",
    },
    {
        date: "Earlier at Abacus",
        title: "Desktop Automation & OTA Updates",
        content:
            "Shipped a separate LLM-powered desktop automation app—implemented OTA updates, system-level integrations, and UI perf wins (startup/memory). Basically, AI that makes your computer do cool stuff automatically.",
    },
];

const portalTimeline: TimelineEntry[] = [
    {
        date: "Dec 2023 - Feb 2024",
        title: "AI-Powered Browser Architecture",
        content:
            "Led the development of Portal, an AI-powered browser featuring advanced RAG (Retrieval-Augmented Generation) and multi-agent systems capable of completing complex, browser-based tasks autonomously. Designed and implemented the comprehensive UX and design system for the entire Portal organization, establishing design engineering principles and micro-interactions that create cohesive, delightful user experiences across all products.",
    },
    {
        date: "Mar 2024 - May 2024",
        title: "Cross-Platform Engineering Excellence",
        content:
            "Maintained and extended custom forks of Playwright, Electron, and native addons to deliver platform-specific features including advanced multi-touch interactions for desktop applications. Engineered a high-performance, micro-interaction-rich agentic interface that dramatically improved both execution speed and usability for complex agent-driven workflows, setting new standards for AI-human interaction design.",
    },
    {
        date: "Jun 2024 - Aug 2024",
        title: "Infrastructure & SDK Innovation",
        content:
            "Architected and built a comprehensive inference-provider SDK following Vercel AI SDK patterns, unifying API calls across multiple AI platforms and dramatically simplifying maintenance overhead. Successfully migrated 15K+ active users from Redis to PostgreSQL with zero downtime through meticulous planning, phased cutovers, and robust testing—ensuring seamless scaling of AI infrastructure.",
    },
    {
        date: "Sep 2024 - Jan 2025",
        title: "Product Innovation & Analytics",
        content:
            "Launched groundbreaking 'Artifacts' feature enabling AI-generated web applications and sites, followed by Portal Search with sophisticated LLM-driven content summaries and intelligent ranking algorithms. Implemented comprehensive product analytics using Mixpanel and crafted fluid, engaging UI interactions powered by Framer Motion and GSAP, driving significant user engagement and product insights.",
    },
];

const santaTimeline: TimelineEntry[] = [
    {
        date: "Jan 2023 - Jun 2023",
        title: "Chromium Core Development",
        content:
            "Led development of Santa Browser, a Chromium-based browser with enhanced privacy features. Focused on optimizing the new tab page (NTP), implementing comprehensive ad-blocking systems, and refining settings interfaces. Achieved a 13% improvement in NTP load speed through strategic performance optimizations, directly enhancing user experience and perceived responsiveness.",
    },
    {
        date: "Jul 2023 - Sep 2023",
        title: "Rewards Platform & Search Enhancement",
        content:
            "Engineered a sophisticated rewards dashboard system and developed advanced search-enhancing browser extensions. Implemented comprehensive automated testing suites using Playwright and established robust monitoring infrastructure with Grafana. Ensured reliable, scalable deployments that maintained high availability and user satisfaction across the platform.",
    },
    {
        date: "Oct 2023 - Dec 2023",
        title: "Design System & Cross-Platform UX",
        content:
            "Collaborated closely with design teams to implement clean, responsive UI components using Tailwind CSS, establishing consistent visual language across the entire browser ecosystem. Ensured seamless cross-platform compatibility and delivered polished user experiences that felt native on Windows, macOS, and mobile platforms through meticulous attention to platform-specific interaction patterns.",
    },
    {
        date: "Jan 2022 - Dec 2022",
        title: "Browser Foundation & Research",
        content:
            "During internship, prototyped the initial Electron-based browser proof-of-concept, conducted extensive research into ad-blocking technologies and privacy protection mechanisms. Ensured robust cross-platform compatibility across Windows and Android platforms, establishing the technical foundation and architectural principles that evolved into the full Santa Browser product.",
    },
];

export const works: { [key in Company]: Work } = {
    // abacus: {
    //     title: 'Desktop Application Developer',
    //     company: 'Abacus',
    //     companyUrl: 'https://abacus.ai',
    //     icon: "https://www.google.com/s2/favicons?domain=abacus.ai&sz=128",
    //     startDate: "2025-01-01",
    //     endDate: 'Present',
    //     timeline: abacusTimeline,
    // },
    portal: {
        title: 'Founding Engineer',
        company: 'Portal',
        companyUrl: 'https://portal.so',
        icon: "https://www.google.com/s2/favicons?domain=portal.so&sz=128",
        startDate: "2023-12-01",
        endDate: "2025-01-01",
        timeline: portalTimeline,
    },
    santa: {
        title: 'Software Developer',
        company: 'Santa Browser',
        companyUrl: 'https://santabrowser.com',
        icon: '/src/assets/images/santabrowser-favicon.svg',
        startDate: "2023-01-01",
        endDate: "2023-12-01",
        timeline: santaTimeline,
    },
}; 