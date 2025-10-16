export type Work = {
    title: string
    company: string
    companyUrl: string
}

export const works = {
    abacus: {
        title: 'Desktop Application Developer',
        company: 'Abacus',
        companyUrl: 'https://abacus.ai',
    },
    portal: {
        title: 'Founding Engineer',
        company: 'Portal',
        companyUrl: 'https://portal.so',
    },
    santabrowser: {
        title: 'Software Developer',
        company: 'Santa Browser',
        companyUrl: 'https://santabrowser.com',
    },
} satisfies Record<string, Work>

export type WorkId = keyof typeof works