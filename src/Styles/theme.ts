export interface ThemeType {
    color: {
        background: string;
        text: string;
        muted: string;
        primary: string;
        border: string;
        card: string;
        textSecondary: string;
    };
}

export const LightTheme: ThemeType = {
    color: {
        background: "#F8FAFC",
        text: "#1E293B",
        muted: "#FFFFFF",
        primary: "#6366F1",
        border: "#E2E8F0",
        card: "#FFFFFF",
        textSecondary: "#64748B",
    },
};

export const DarkTheme: ThemeType = {
    color: {
        background: "#0F172A",
        text: "#F1F5F9",
        muted: "#1E293B",
        primary: "#818CF8",
        border: "#334155",
        card: "#1E293B",
        textSecondary: "#94A3B8",
    },
};
