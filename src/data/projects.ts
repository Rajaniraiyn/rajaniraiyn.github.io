export type Project = {
    name: string
    github: string
    website: string
    startDate: string
    endDate: string
    description: React.ReactNode
    details: React.ReactNode
}

export const projects: Project[] = [
    {
        name: "React Alien Signals",
        github: "https://github.com/Rajaniraiyn/react-alien-signals",
        website: "",
        startDate: "2024-11-01",
        endDate: "Present",
        description: "Alien React Signals is a TypeScript library that provides state management APIs built on top of Alien Signals.",
        details: [
            "Modern state management solution for React applications with signal-based reactivity.",
            "Built on top of the powerful Alien Signals library for optimal performance.",
            "Provides familiar React hooks API while leveraging advanced signal patterns.",
            "52+ stars on GitHub, actively maintained and adopted by developers.",
        ]
    },
    {
        name: "AI SDK Solid",
        github: "https://github.com/Rajaniraiyn/ai-sdk-solid",
        website: "",
        startDate: "2025-01-01",
        endDate: "Present",
        description: "AI SDK provider for solidjs - enabling seamless AI integration in SolidJS applications.",
        details: [
            "Official AI SDK integration for the SolidJS reactive framework.",
            "Implements reactive AI state management with streaming capabilities.",
            "Provides TypeScript-first API for modern AI interactions.",
            "Enables reactive AI workflows within SolidJS applications.",
        ]
    },
    {
        name: "Vite Plugin React Scan",
        github: "https://github.com/Rajaniraiyn/vite-plugin-react-scan",
        website: "",
        startDate: "2025-01-01",
        endDate: "Present",
        description: "Vite plugin for react-scan - automatic React performance monitoring and component analysis.",
        details: [
            "Seamless Vite integration for the popular react-scan performance tool.",
            "Automatic component re-render analysis during development.",
            "Helps identify performance bottlenecks in React applications.",
            "Zero-config setup for immediate performance insights.",
        ]
    },
    {
        name: "CSSUnicorn",
        github: "https://github.com/Rajaniraiyn/cssunicorn",
        website: "",
        startDate: "2024-12-01",
        endDate: "Present",
        description: "CSS utilities and components library for modern web development.",
        details: [
            "Comprehensive CSS utility library for rapid web development.",
            "Modern component system with accessible and responsive design patterns.",
            "TypeScript support for type-safe styling solutions.",
            "Performance-optimized CSS with minimal bundle size impact.",
        ]
    },
    {
        name: "CDS Design System",
        github: "",
        website: "https://cds-design.github.io",
        startDate: "2023-07-01",
        endDate: "Present",
        description: "A comprehensive design system & component library focused on interaction engineering (1.4k+ npm downloads).",
        details: [
            "Designed & developed reusable UI components and guidelines, improving development efficiency.",
            "Implemented micro-interactions and animations using Framer Motion and GSAP.",
            "Led the project from design to deployment, ensuring visual consistency and adherence to design principles.",
            "Enhanced developer experience by providing detailed documentation and tooling.",
        ]
    },
    {
        name: "UPM",
        github: "https://github.com/Rajaniraiyn/upm",
        website: "",
        startDate: "2023-02-01",
        endDate: "Present",
        description: "A simplified and performant package manager built with Rust.",
        details: [
            "Achieved high performance and memory safety using Rust.",
            "Simplified commands for better user experience.",
            "Ensured cross-platform support and scalability.",
        ]
    },
    {
        name: "svelte-sound",
        github: "https://github.com/Rajaniraiyn/svelte-sound",
        website: "",
        startDate: "2022-11-01",
        endDate: "Present",
        description: "Svelte actions for playing interaction sounds on DOM events. (6.4k+ npm downloads)",
        details: [
            "Developed a lightweight and performant audio interaction library for Svelte.",
            "Implemented dynamic imports to support partial hydration.",
            "Created a scalable solution for complex game interactions.",
        ]
    },
    {
        name: "RTube",
        github: "https://github.com/Rajaniraiyn/rtube",
        website: "",
        startDate: "2022-09-01",
        endDate: "Present",
        description: "A modern, lightweight YouTube video player and downloader.",
        details: [
            "Built using web technologies and Svelte.",
            "Features include ad-free viewing, ultra-fast downloads with parallel connections, and resumable downloads.",
            "Designed an intuitive user interface, enhancing user satisfaction.",
        ]
    },
    {
        name: "Raj Browser",
        github: "https://github.com/Rajaniraiyn/raj-browser",
        website: "",
        startDate: "2021-08-01",
        endDate: "Present",
        description: "A UI and privacy-focused web browser built from scratch using Electron.js.",
        details: [
            "Engineered a custom browser focusing on privacy and user experience.",
            "Implemented ad-blocking, custom scrollbars, process management, and advanced download features.",
            "Designed a unique and modern interface, handling both design and development aspects.",
            "Optimized performance and resource usage, resulting in a lightweight application used by thousands of users.",
        ]
    },
]; 
