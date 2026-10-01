"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCalendarDate = void 0;
const isValidCalendarDate = (dateString) => {
    // Regex to ensure format is strictly YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (month < 1 || month > 12)
        return false;
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day < 1 || day > daysInMonth[month - 1])
        return false;
    return true;
};
exports.isValidCalendarDate = isValidCalendarDate;
const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};
//# sourceMappingURL=dateUtils.js.map