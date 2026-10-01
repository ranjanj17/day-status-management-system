"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlDayStatusRepository = void 0;
const sequelize_1 = require("sequelize");
const DayStatusRepository_1 = require("./DayStatusRepository");
const DayStatus_1 = require("../storage/models/DayStatus");
class SqlDayStatusRepository {
    async findByDate(date) {
        const record = await DayStatus_1.DayStatus.findOne({ where: { date } });
        if (!record)
            return null;
        return {
            id: record.id,
            date: record.date,
            status: record.status,
            created_by: record.created_by,
        };
    }
    async findByYear(year) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const records = await DayStatus_1.DayStatus.findAll({
            where: {
                date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
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
    async findByYearAndMonth(year, month) {
        const monthStr = month.toString().padStart(2, '0');
        // Using string prefix matching or between depending on dialect, let's use between for safety
        const startDate = `${year}-${monthStr}-01`;
        const endDate = `${year}-${monthStr}-31`; // The db engine will handle valid date limits in between
        const records = await DayStatus_1.DayStatus.findAll({
            where: {
                date: {
                    [sequelize_1.Op.between]: [startDate, endDate],
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
    async upsert(date, status, userId) {
        const [record] = await DayStatus_1.DayStatus.upsert({
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
exports.SqlDayStatusRepository = SqlDayStatusRepository;
//# sourceMappingURL=SqlDayStatusRepository.js.map