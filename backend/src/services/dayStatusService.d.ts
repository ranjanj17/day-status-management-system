export declare const getStatusByDate: (date: string) => Promise<{
    success: boolean;
    error: {
        code: string;
        message: string;
    };
    data?: never;
} | {
    error?: never;
    success: boolean;
    data: import("../repositories/DayStatusRepository").DayStatusRecord | null;
}>;
export declare const getStatuses: (year: number, month?: number) => Promise<{
    data?: never;
    success: boolean;
    error: {
        code: string;
        message: string;
    };
} | {
    error?: never;
    success: boolean;
    data: import("../repositories/DayStatusRepository").DayStatusRecord[];
}>;
export declare const updateStatus: (date: string, status: string, userId: number) => Promise<{
    data?: never;
    success: boolean;
    error: {
        code: string;
        message: string;
    };
} | {
    error?: never;
    success: boolean;
    data: import("../repositories/DayStatusRepository").DayStatusRecord;
}>;
//# sourceMappingURL=dayStatusService.d.ts.map