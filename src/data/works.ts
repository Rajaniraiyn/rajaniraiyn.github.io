export type Work = {
    title: string
    company: string
    companyUrl: string
    icon: string
    startDate: string
    endDate: string
}

export const COMPANIES = ['portal', 'santabrowser'] as const

export type Company = (typeof COMPANIES)[number]

export const works: { [key in Company]: Work } = {
    portal: {
        title: 'Founding Engineer',
        company: 'Portal',
        companyUrl: 'https://portal.so',
        icon: "https://www.google.com/s2/favicons?domain=portal.so&sz=128",
        startDate: "2023-12-01",
        endDate: 'Present',
    },
    santabrowser: {
        title: 'Software Developer',
        company: 'Santa Browser',
        companyUrl: 'https://santabrowser.com',
        icon: '/src/assets/images/santabrowser-favicon.svg',
        startDate: "2023-01-01",
        endDate: "2023-12-01",
    },
}; 