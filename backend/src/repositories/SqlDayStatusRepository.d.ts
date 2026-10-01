import { DayStatusRecord, DayStatusRepository } from './DayStatusRepository';
export declare class SqlDayStatusRepository implements DayStatusRepository {
    findByDate(date: string): Promise<DayStatusRecord | null>;
    findByYear(year: number): Promise<DayStatusRecord[]>;
    findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]>;
    upsert(date: string, status: string, userId: number): Promise<DayStatusRecord>;
}
//# sourceMappingURL=SqlDayStatusRepository.d.ts.map