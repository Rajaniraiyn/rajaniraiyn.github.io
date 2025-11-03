import {
    AstroIcon,
    BlenderIcon,
    BunIcon,
    CIcon,
    CppIcon,
    CSSIcon,
    DevToIcon,
    DockerIcon,
    ElectronIcon,
    FigmaIcon,
    GitHubActionsIcon,
    GitIcon,
    GoIcon,
    HtmlIcon,
    JavaScriptIcon,
    LinuxIcon,
    MarkdownIcon,
    NextJSIcon,
    NodeJSIcon,
    NPMIcon,
    PythonIcon,
    ReactIcon,
    RedisIcon,
    RegexIcon,
    RollupIcon,
    RustIcon,
    SASSIcon,
    SentryIcon,
    SolidJSIcon,
    SqliteIcon,
    StyledComponentsIcon,
    SupabaseIcon,
    SvelteIcon,
    TailwindIcon,
    TauriIcon,
    ThreeJSIcon,
    TypeScriptIcon,
    ViteIcon,
    VSCodeIcon,
    WASMIcon,
    WorkersIcon
} from "@/components/icons";

export type Stack = {
    name: string
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    description: string | React.ReactNode
    proficiency: number
    link?: string
}

export const stack = {
    // --- Mastered / Daily Use (Proficiency: 0.98 - 1) ---
    typescript: {
        name: 'TypeScript',
        icon: TypeScriptIcon,
        description: 'My main jam. Built literally EVERYTHING with it—web apps, OS, CLIs, you name it.',
        proficiency: 0.999,
        link: 'https://github.com/rajaniraiyn?tab=repositories&q=&type=&language=typescript',
    },
    electron: {
        name: 'Electron',
        icon: ElectronIcon,
        description: 'Deep in Electron: built browsers, chatbots, and squeezed in spooky OS integrations.',
        proficiency: 0.9,
    },
    nodejs: {
        name: 'Node.js',
        icon: NodeJSIcon,
        description: 'My production runtime of choice. Personally stress-tested its limits—passed with flying colors.',
        proficiency: 0.9,
        link: 'https://github.com/rajaniraiyn?tab=repositories&q=&type=&language=nodejs',
    },
    react: {
        name: 'React',
        icon: ReactIcon,
        description: 'Originally forced in, but mastered it anyway. Know React’s guts and can wrangle any wild codebase.',
        proficiency: 1,
        link: 'https://github.com/rajaniraiyn?tab=repositories&q=&type=&language=javascript',
    },
    vscode: {
        name: 'VSCode',
        icon: VSCodeIcon,
        description: "My true home. Too lazy to migrate to NeoVim, but hey—I contributed to VSCode, worked on its forks, and even jammed AI onto it.",
        proficiency: 1,
        link: 'https://github.com/rajaniraiyn/dotfiles',
    },
    css: {
        name: 'CSS',
        icon: CSSIcon,
        description: "Certified CSS fanatic. Can't say it enough. Love it. Love it. LOVE IT.",
        proficiency: 1,
    },
    markdown: {
        name: 'Markdown',
        icon: MarkdownIcon,
        description: 'Do I even need to explain? Use it everywhere, from shares to personal note-taking.',
        proficiency: 1,
        link: 'https://github.com/rajaniraiyn/knowledge-base',
    },
    tailwind: {
        name: 'Tailwind',
        icon: TailwindIcon,
        description: 'Started skeptical, now can’t start a project without it. Every build, every time.',
        proficiency: 0.99,
        link: 'https://github.com/rajaniraiyn/tailwindcss-examples',
    },
    javascript: {
        name: 'JavaScript',
        icon: JavaScriptIcon,
        description: 'My first love and still my go-to. From web projects to wild scripts—if it needs coding, I’ve probably done it in JS.',
        proficiency: 0.98,
        link: 'https://github.com/rajaniraiyn?tab=repositories&q=&type=&language=javascript',
    },
    nextjs: {
        name: 'Next.js',
        icon: NextJSIcon,
        description: 'Relied on it at Portal for landing pages, micro-apps, and (surprise) chatbots.',
        proficiency: 0.95,
        link: 'https://github.com/rajaniraiyn/nextjs-app-template',
    },
    html: {
        name: 'HTML',
        icon: HtmlIcon,
        description: "JSX and template engines are great, but I'm deeply loyal to semantic HTML features—even if it sends me into the spec's abyss.",
        proficiency: 1,
    },
    npm: {
        name: 'npm',
        icon: NPMIcon,
        description: 'All my libs land on npm, and VSCode dev is basically npm Central.',
        proficiency: 1,
        link: 'https://www.npmjs.com/~rajaniraiyn',
    },
    vite: {
        name: 'Vite',
        icon: ViteIcon,
        description: 'Bundler of choice. Pushed it with rolldown, made plugins, poked its internals—a true default.',
        proficiency: 0.95,
        link: 'https://github.com/rajaniraiyn/vite-react-template',
    },
    astro: {
        name: 'Astro',
        icon: AstroIcon,
        description: "Big fan of Astro's no-JS approach. Crafted plenty of content-rich sites and rolled my own CMS.",
        proficiency: 0.9,
        link: 'https://github.com/rajaniraiyn/blog',
    },
    regex: {
        name: 'Regex',
        icon: RegexIcon,
        description: "Regex ninja: after my fair share of headaches, now I wield it for quick hacks. ihateregex.io fan, obviously.",
        proficiency: 0.9,
    },

    // --- Everyday & Strong (Proficiency: 0.8 - 0.89) ---
    linux: {
        name: 'Linux',
        icon: LinuxIcon,
        description: "Quad-booted through a pile of distros back in the day—Linux was my playground. Sorry, not an Arch fan.",
        proficiency: 0.82,
    },
    devto: {
        name: 'Dev.to',
        icon: DevToIcon,
        description: "Occasional writer! Shared plenty of learnings when inspiration struck. There's gold in those posts.",
        proficiency: 0.80,
        link: 'https://dev.to/rajaniraiyn',
    },
    git: {
        name: 'Git',
        icon: GitIcon,
        description: 'My daily (and nightly) driver. Lately stretching its limits—sometimes prefer Jujutsu for solo jams.',
        proficiency: 0.80,
        link: 'https://github.com/rajaniraiyn',
    },
    python: {
        name: 'Python',
        icon: PythonIcon,
        description: 'Python? Love it! Published some packages and used it for most of the backend magic at Portal.',
        proficiency: 0.8,
        link: 'https://github.com/rajaniraiyn?tab=repositories&q=&type=&language=python',
    },
    bun: {
        name: 'Bun',
        icon: BunIcon,
        description: 'Latest obsession. Handles anything from tiny scripts to serious automation—my dev tool playground.',
        proficiency: 0.8,
    },
    rollup: {
        name: 'Rollup',
        icon: RollupIcon,
        description: 'Bundled up countless micro-libs in projects like Chromium and VSCode with Rollup. Swiss-army knife.',
        proficiency: 0.8,
    },
    'github-actions': {
        name: 'GitHub Actions',
        icon: GitHubActionsIcon,
        description: 'All CI/CD built here: even the personal stuff gets treated to a workflow or two.',
        proficiency: 0.8,
    },
    redis: {
        name: 'Redis',
        icon: RedisIcon,
        description: 'Caching layers, pub/sub, resumable streams—you name it, Redis is behind it.',
        proficiency: 0.8,
    },
    sentry: {
        name: 'Sentry',
        icon: SentryIcon,
        description: "Deployed it at Portal for error tracking—spiced it up with automation and custom reporting. Stacked on Sentry.",
        proficiency: 0.8,
    },
    sqlite: {
        name: 'SQLite',
        icon: SqliteIcon,
        description: "Go-to DB for everything: desktop, web, dev, prod—if it stores data, I've probably @sqlite'd it.",
        proficiency: 0.8,
    },
    tauri: {
        name: 'Tauri',
        icon: TauriIcon,
        description: "Built chatbots and desktop/mobile apps with Tauri—definitely prefer it over Electron, just waiting for a prod moment.",
        proficiency: 0.8,
    },

    // --- Above Intermediate (Proficiency: 0.7 - 0.79) ---
    docker: {
        name: 'Docker',
        icon: DockerIcon,
        description: "Dockered nearly everything—built OSs on top and used it for AI benchmarking, dev envs, and more.",
        proficiency: 0.7,
    },
    'styled-components': {
        name: 'Styled Components',
        icon: StyledComponentsIcon,
        description: 'Styled custom browser pages at SantaBrowser with it. Cozy with its quirks.',
        proficiency: 0.7,
    },

    // --- Intermediate & Familiar (Proficiency: 0.60 - 0.69) ---
    rust: {
        name: 'Rust',
        icon: RustIcon,
        description: 'On the Rust hype train. Used it for shiny desktop apps, experiment-y research projects, and CLIs that mean business.',
        proficiency: 0.6,
    },
    supabase: {
        name: 'Supabase',
        icon: SupabaseIcon,
        description: "Used at Portal as part of the backend squad.",
        proficiency: 0.6,
    },
    workers: {
        name: 'Workers',
        icon: WorkersIcon,
        description: "Cloudflare Workers whenever I need tiny, not time-sensitive services spun up in a flash.",
        proficiency: 0.6,
    },
    solidjs: {
        name: 'Solid.js',
        icon: SolidJSIcon,
        description: 'Big fan. Fine-grained reactivity is chef’s kiss—even fought epic edge cases and still a devotee.',
        proficiency: 0.75,
    },

    // --- Getting There (Proficiency: 0.40 - 0.59) ---
    cpp: {
        name: 'C++',
        icon: CppIcon,
        description: 'Dove into C++ for SantaBrowser: poked around Chromium source and played with MOJO IPC to expose APIs.',
        proficiency: 0.45,
    },
    threejs: {
        name: 'Three.js',
        icon: ThreeJSIcon,
        description: "Used it for neat 3D visuals and subtle effects. If designers dream it, I'll render it—super performant, too.",
        proficiency: 0.45,
    },
    go: {
        name: 'Go',
        icon: GoIcon,
        description: 'Super handy: tossed it at APIs, and even built desktop apps with Wails. Go go go!',
        proficiency: 0.35,
    },
    sass: {
        name: 'Sass',
        icon: SASSIcon,
        description: 'Used to love it for nesting and functions—these days, native CSS does it and more.',
        proficiency: 0.4,
    },
    wasm: {
        name: 'WASM',
        icon: WASMIcon,
        description: "Went ALL IN for threading custom layouts in web apps. Usually, if I want WASM, I call Rust for backup.",
        proficiency: 0.4,
    },
    figma: {
        name: 'Figma',
        icon: FigmaIcon,
        description: "Not a fan of of when I can design directly on code, but I can whip up a prototype. Still, I'm way better with a keyboard than a drag handle.",
        proficiency: 0.4,
    },

    // --- Light Use / Exposure (Proficiency: 0.25 - 0.39) ---
    c: {
        name: 'C',
        icon: CIcon,
        description: 'Cut my teeth on C during university—embedded systems, low-level code, and all that good stuff.',
        proficiency: 0.3,
    },
    svelte: {
        name: 'Svelte',
        icon: SvelteIcon,
        description: 'Was once a big fan. Haven’t shipped much recently, but I do have some Svelte packages out there.',
        proficiency: 0.25,
    },

    // --- Just For Fun (Proficiency: 0.1) ---
    blender: {
        name: 'Blender',
        icon: BlenderIcon,
        description: "Yep, used it to export assets for three.js. Sculpting? I could get something decent eventually... if you give me a few years.",
        proficiency: 0.1,
    },
} satisfies Record<string, Stack>