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
        date: "Dec 2023 - Jan 2024",
        title: "AI-Powered Browser Foundation",
        content:
            "Led development of an AI-powered browser with RAG and multi-agent systems that complete complex, browser-based tasks. Designed the UX and design system for the Portal organization, driving design engineering and micro-interactions to deliver a cohesive and delightful user experience across all products.",
    },
    {
        date: "Q1 2024",
        title: "Platform Extensions & Performance",
        content:
            "Maintained and extended forks of Playwright, Electron, and custom native addons to add platform-specific features such as multi-touch interactions for desktop apps. Improved the agentic flow with a high-performance, micro-interaction-rich interface, elevating both speed and usability for complex agent-driven tasks.",
    },
    {
        date: "Q2 2024",
        title: "SDK Development & Database Migration",
        content:
            "Built an inference-provider SDK (Vercel AI SDK-style) to unify calls across multiple AI platforms and simplify maintenance. Migrated 15K users from Redis to PostgreSQL with zero downtime through careful planning and phased cutovers. Basically, made AI infrastructure reliable and scalable.",
    },
    {
        date: "Q3-Q4 2024",
        title: "Product Launches & Analytics",
        content:
            "Shipped 'Artifacts' (AI-generated apps/sites) and launched Portal Search for LLM-driven summaries and ranking. Instrumented product analytics (Mixpanel) and crafted fluid UI interactions with Framer Motion/GSAP to drive engagement and insight. Turned AI capabilities into tangible products users love.",
    },
];

const santaTimeline: TimelineEntry[] = [
    {
        date: "Jan 2023 - Jun 2023",
        title: "Chromium Browser Development",
        content:
            "Contributed to a Chromium-based browser focusing on new tab page (NTP), settings, and ad-blocking features. Boosted NTP load speed by 13% through performance optimizations. Basically, made the browser faster and more privacy-focused.",
    },
    {
        date: "Jul 2023 - Sep 2023",
        title: "Dashboard & Extension Engineering",
        content:
            "Built a rewards dashboard and search-enhancing extension using modern web technologies. Implemented automated testing with Playwright and monitoring via Grafana for reliable deployments. Made sure everything worked smoothly and looked great.",
    },
    {
        date: "Oct 2023 - Dec 2023",
        title: "UI/UX Polish & Cross-Platform",
        content:
            "Collaborated with design to deliver clean, responsive UI components using Tailwind CSS. Ensured cross-platform parity and polished user experience across different environments. Basically, made the browser look and feel amazing everywhere.",
    },
    {
        date: "Earlier (Jan 2022 - Jan 2023)",
        title: "Browser POC & Research",
        content:
            "Prototyped the Electron-based browser POC during internship, researched ad-blocking approaches, and ensured cross-platform compatibility (Windows/Android) for consistent user experience. Laid the groundwork for what became Santa Browser.",
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