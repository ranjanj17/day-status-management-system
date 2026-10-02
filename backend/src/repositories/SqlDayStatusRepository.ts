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
      version: record.version,
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
      version: r.version,
    }));
  }

  async findByYearAndMonth(year: number, month: number): Promise<DayStatusRecord[]> {
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    const endDate = `${year}-${monthStr}-31`; 

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
      version: r.version,
    }));
  }

  async upsert(date: string, status: string, userId: number, version?: number): Promise<DayStatusRecord> {
    let record = await DayStatusModel.findOne({ where: { date } });
    
    if (record) {
      if (version !== undefined && record.version !== version) {
        throw new Error('CONCURRENCY_ERROR');
      }
      record.status = status;
      record.created_by = userId;
      await record.save(); // Sequelize handles the version increment
    } else {
      record = await DayStatusModel.create({
        date,
        status,
        created_by: userId,
      });
    }

    return {
      id: record.id,
      date: record.date,
      status: record.status,
      created_by: record.created_by,
      version: record.version,
    };
  }

  async delete(date: string): Promise<void> {
    await DayStatusModel.destroy({ where: { date } });
  }
}
