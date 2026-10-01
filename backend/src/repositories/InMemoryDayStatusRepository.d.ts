import { DayStatusRecord, DayStatusRepository } from './DayStatusRepository';
export declare class InMemoryDayStatusRepository implements DayStatusRepository {
    private records;
    private currentId;
    findByDate(date: string): Promise<DayStatusRecord | null>;
    findByYear(year: number): Promise<DayStatusRecord[]>;
    findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]>;
    upsert(date: string, status: string, userId: number): Promise<DayStatusRecord>;
}
//# sourceMappingURL=InMemoryDayStatusRepository.d.ts.map