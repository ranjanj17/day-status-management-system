"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryDayStatusRepository = void 0;
const DayStatusRepository_1 = require("./DayStatusRepository");
class InMemoryDayStatusRepository {
    records = [];
    currentId = 1;
    async findByDate(date) {
        return this.records.find(r => r.date === date) || null;
    }
    async findByYear(year) {
        return this.records.filter(r => r.date.startsWith(`${year}-`));
    }
    async findByYearAndMonth(year, month) {
        const monthStr = month.toString().padStart(2, '0');
        const prefix = `${year}-${monthStr}-`;
        return this.records.filter(r => r.date.startsWith(prefix));
    }
    async upsert(date, status, userId) {
        const existingIndex = this.records.findIndex(r => r.date === date);
        if (existingIndex !== -1) {
            this.records[existingIndex].status = status;
            this.records[existingIndex].created_by = userId;
            return this.records[existingIndex];
        }
        const record = {
            id: this.currentId++,
            date,
            status,
            created_by: userId,
        };
        this.records.push(record);
        return record;
    }
}
exports.InMemoryDayStatusRepository = InMemoryDayStatusRepository;
//# sourceMappingURL=InMemoryDayStatusRepository.js.map