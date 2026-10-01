import { DayStatusRecord, DayStatusRepository } from './DayStatusRepository';

export class InMemoryDayStatusRepository implements DayStatusRepository {
  private records: DayStatusRecord[] = [];
  private currentId = 1;

  async findByDate(date: string): Promise<DayStatusRecord | null> {
    return this.records.find(r => r.date === date) || null;
  }

  async findByYear(year: number): Promise<DayStatusRecord[]> {
    return this.records.filter(r => r.date.startsWith(`${year}-`));
  }

  async findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]> {
    const monthStr = month.toString().padStart(2, '0');
    const prefix = `${year}-${monthStr}-`;
    return this.records.filter(r => r.date.startsWith(prefix));
  }

  async upsert(date: string, status: string, userId: number): Promise<DayStatusRecord> {
    const existingIndex = this.records.findIndex(r => r.date === date);
    
    if (existingIndex !== -1) {
      this.records[existingIndex].status = status;
      this.records[existingIndex].created_by = userId;
      return this.records[existingIndex];
    }

    const record: DayStatusRecord = {
      id: this.currentId++,
      date,
      status,
      created_by: userId,
    };
    this.records.push(record);
    return record;
  }
}
