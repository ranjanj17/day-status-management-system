"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getStatuses = exports.getStatusByDate = void 0;
const repositories_1 = require("../repositories");
const dateUtils_1 = require("../utils/dateUtils");
const dayStatusRepo = (0, repositories_1.getDayStatusRepository)();
const getStatusByDate = async (date) => {
    if (!(0, dateUtils_1.isValidCalendarDate)(date)) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date' } };
    }
    const record = await dayStatusRepo.findByDate(date);
    return {
        success: true,
        data: record ? record : null, // If no record, return null data to show empty state
    };
};
exports.getStatusByDate = getStatusByDate;
const getStatuses = async (year, month) => {
    if (isNaN(year) || year < 1900 || year > 2100) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid year' } };
    }
    let records;
    if (month !== undefined) {
        if (isNaN(month) || month < 1 || month > 12) {
            return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid month' } };
        }
        records = await dayStatusRepo.findByYearAndMonth(year, month);
    }
    else {
        records = await dayStatusRepo.findByYear(year);
    }
    return {
        success: true,
        data: records,
    };
};
exports.getStatuses = getStatuses;
const updateStatus = async (date, status, userId) => {
    if (!(0, dateUtils_1.isValidCalendarDate)(date)) {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date' } };
    }
    if (typeof status !== 'string' || status.trim() === '') {
        return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Status cannot be empty' } };
    }
    const record = await dayStatusRepo.upsert(date, status.trim(), userId);
    return {
        success: true,
        data: record,
    };
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=dayStatusService.js.map