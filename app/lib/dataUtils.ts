import Papa from 'papaparse';

export const majorDisplayNames: Record<string, string> = {
    elektro: 'Teknik Elektro',
    komputer: 'Teknik Komputer',
    biomedik: 'Teknik Biomedik'
};

export interface DiktatItem {
    name: string;
    major: string[];
    year: number[];
    googleDriveLink: string;
    img: string | null;
}

export interface DiktatData {
    id: string;
    year: number;
    uts_uas: string;
    ganjil_genap: string;
    is_active?: boolean;
    content: DiktatItem[];
}

export interface AsistensiItem {
    name: string;
    major: string[];
    year: number[];
    person: { name: string }[];
    date: Date | string; // Date on client, string on wire
    zoomMeetingsLink: string;
    recordingsLink: string;
}

export interface AsistensiData {
    id: string;
    year: number;
    uts_uas: string;
    ganjil_genap: string;
    content: AsistensiItem[];
}

export const getLatestData = <T extends { year: number; uts_uas: string; ganjil_genap: string }>(dataList: T[]): T | null => {
    if (!dataList.length) return null;
    const sorted = [...dataList].sort((a, b) => {
        const yearA = parseInt(String(a.year)) || 0;
        const yearB = parseInt(String(b.year)) || 0;
        if (yearB !== yearA) return yearB - yearA;
        if (b.uts_uas !== a.uts_uas) return b.uts_uas === 'uas' ? 1 : -1;
        return b.ganjil_genap === 'genap' ? 1 : -1;
    });
    return sorted[0];
};

export const filterContent = <T extends { year: number[]; major: string[] }>(
    content: T[] | undefined,
    selectedYear: number,
    selectedMajor: string
): T[] => {
    if (!content) return [];
    return content.filter(item => {
        const yearMatch = !selectedYear || item.year.includes(selectedYear);
        const majorMatch = !selectedMajor || item.major.includes(selectedMajor);
        return yearMatch && majorMatch;
    });
};

export const getSemester = (year: number, ganjilGenap: string): number => {
    return ganjilGenap === 'genap' ? 2 * year : 2 * year - 1;
};

export const convertMajorCode = (str: string) => {
    if (!str) return '';
    const lower = str.toLowerCase();
    if (lower.includes('elektro') || lower.includes('ee')) return 'elektro';
    if (lower.includes('komputer') || lower.includes('ce')) return 'komputer';
    if (lower.includes('biomedik') || lower.includes('be')) return 'biomedik';
    if (lower.includes('e')) return 'elektro';
    if (lower.includes('t')) return 'komputer';
    if (lower.includes('b')) return 'biomedik';
    return '';
};

export const parseCsv = (csvString: string): string[][] => {
    const results = Papa.parse<string[]>(csvString, {
        skipEmptyLines: true,
    });
    return results.data;
};
