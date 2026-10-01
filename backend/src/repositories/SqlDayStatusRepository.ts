import { Op } from 'sequelize';
import { DayStatusRecord, DayStatusRepository } from './DayStatusRepository';
import { DayStatus as DayStatusModel } from '../storage/models/DayStatus';

export class SqlDayStatusRepository implements DayStatusRepository {
  async findByDate(date: string): Promise<DayStatusRecord | null> {
    const record = await DayStatusModel.findOne({ where: { date } });
    if (!record) return null;
    return {
      id: record.id,
      date: record.date,
      status: record.status,
      created_by: record.created_by,
    };
  }

  async findByYear(year: number): Promise<DayStatusRecord[]> {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    const records = await DayStatusModel.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return records.map(r => ({
      id: r.id,
      date: r.date,
      status: r.status,
      created_by: r.created_by,
    }));
  }

  async findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]> {
    const monthStr = month.toString().padStart(2, '0');
    // Using string prefix matching or between depending on dialect, let's use between for safety
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-31`; // The db engine will handle valid date limits in between

    const records = await DayStatusModel.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return records.map(r => ({
      id: r.id,
      date: r.date,
      status: r.status,
      created_by: r.created_by,
    }));
  }

  async upsert(date: string, status: string, userId: number): Promise<DayStatusRecord> {
    const [record] = await DayStatusModel.upsert({
      date,
      status,
      created_by: userId,
    });

    // In some dialects upsert doesn't return the full record immediately, 
    // so we might need to fetch it or rely on the returned values if available
    return {
      id: record.id,
      date: record.date,
      status: record.status,
      created_by: record.created_by,
    };
  }
}
