export declare const login: (email: string, password: string) => Promise<{
    success: boolean;
    error: {
        code: string;
        message: string;
    };
    data?: never;
} | {
    error?: never;
    success: boolean;
    data: {
        token: string;
        user: {
            id: number;
            email: string;
        };
    };
}>;
export declare const register: (email: string, password: string) => Promise<{
    data?: never;
    success: boolean;
    error: {
        code: string;
        message: string;
    };
} | {
    error?: never;
    success: boolean;
    data: {
        token: string;
        user: {
            id: number;
            email: string;
        };
    };
}>;
export declare const getMe: (userId: number) => Promise<{
    data?: never;
    success: boolean;
    error: {
        code: string;
        message: string;
    };
} | {
    error?: never;
    success: boolean;
    data: {
        user: {
            id: number;
            email: string;
        };
    };
}>;
//# sourceMappingURL=authService.d.ts.map