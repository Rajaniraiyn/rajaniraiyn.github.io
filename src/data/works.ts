import SantaBrowserIcon from '@/assets/images/santabrowser-favicon.svg'

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

export const COMPANIES = ['abacus', 'portal', 'santa'] as const

export type Company = (typeof COMPANIES)[number]

export const abacusTimeline: TimelineEntry[] = [
    {
        date: "Jan 2025",
        title: "Abacus Editor Launch",
        content:
            "Built Abacus Editor with autocomplete, LLM integrations, inline actions, diff application, undo/redo, and end-to-end editor flows.",
    },
    {
        date: "Q1 2025",
        title: "Abacus Agent CLI",
        content:
            "Built the Abacus Agent CLI around the same core workflows, keeping the command-line surface fast, practical, and tightly coupled to the agent loop.",
    },
    {
        date: "Q1 2025",
        title: "Three Platforms, Three Modes",
        content:
            "Managed the same product across three platforms with three distinct operating modes so each surface could behave correctly without fragmenting the architecture. Designed the control flow so the CLI could share core logic with the other surfaces while still shipping independently.",
    },
    {
        date: "Q2 2025",
        title: "Agentic Harness & Custom Rendering",
        content:
            "Architected the custom rendering engine and the state-of-the-art agentic harness that powered the product core and other internal tools. Focused on reliability, tool execution, and a rendering pipeline that could keep up with real workflows.",
    },
    {
        date: "Q2 2025",
        title: "VS Code Extension & Platform Integration",
        content:
            "Shipped the VS Code extension and the surrounding integrations that tied the editor experience back to Abacus Editor and Abacus Agent. Kept the extension maintainable, compatible, and aligned with the broader product surface as the stack evolved.",
    },
    {
        date: "Q2 2025",
        title: "Abacus Desktop App",
        content:
            "Built the separate Abacus desktop app as another product surface, with its own workflows and integrations alongside the editor and CLI.",
    },
];

const portalTimeline: TimelineEntry[] = [
    {
        date: "Dec 2023 - Feb 2024",
        title: "AI-Powered Browser Architecture",
        content:
            "Led the development of Portal, an AI-powered browser with RAG and multi-agent task execution. Designed the UX and design system for the product so the browser and its companion surfaces felt coherent instead of stitched together.",
    },
    {
        date: "Mar 2024 - May 2024",
        title: "Cross-Platform Engineering Excellence",
        content:
            "Maintained custom forks of Playwright, Electron, and native addons to deliver platform-specific behavior. Built a fast agentic interface with the right micro-interactions for complex browser workflows without turning the UI into noise.",
    },
    {
        date: "Jun 2024 - Aug 2024",
        title: "Infrastructure & SDK Innovation",
        content:
            "Architected an inference-provider SDK pattern that unified calls across multiple AI platforms and cut maintenance overhead. Migrated 15K+ active users from Redis to PostgreSQL with zero downtime through phased cutovers and validation.",
    },
    {
        date: "Sep 2024 - Feb 2026",
        title: "Product Iteration, Pi SDK, and Vision Control",
        content:
            "Shipped Artifacts, Portal Search, and product analytics, then extended the stack with Pi SDK integration and vision-based computer control. Kept pushing the product toward more direct, automated interaction with the desktop and browser.",
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
    abacus: {
        title: 'Software Engineer',
        company: 'Abacus',
        companyUrl: 'https://abacus.ai',
        icon: "https://www.google.com/s2/favicons?domain=abacus.ai&sz=128",
        startDate: "2025-01-01",
        endDate: 'Present',
        timeline: abacusTimeline,
    },
    portal: {
        title: 'Founding Engineer',
        company: 'Portal',
        companyUrl: 'https://portal.so',
        icon: "https://www.google.com/s2/favicons?domain=portal.so&sz=128",
        startDate: "2023-12-01",
        endDate: "2026-02-01",
        timeline: portalTimeline,
    },
    santa: {
        title: 'Software Developer',
        company: 'Santa Browser',
        companyUrl: 'https://santabrowser.com',
        icon: SantaBrowserIcon,
        startDate: "2023-01-01",
        endDate: "2023-12-01",
        timeline: santaTimeline,
    },
}; 
