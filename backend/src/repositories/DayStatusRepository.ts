export interface DayStatusRecord {
  id: number;
  date: string;
  status: string;
  created_by: number;
  version: number;
}

export interface DayStatusRepository {
  findByDate(date: string): Promise<DayStatusRecord | null>;
  findByYear(year: number): Promise<DayStatusRecord[]>;
  findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]>;
  upsert(date: string, status: string, userId: number, version?: number): Promise<DayStatusRecord>;
}
