import { getDayStatusRepository } from '../repositories';
import { isValidCalendarDate } from '../utils/dateUtils';

const dayStatusRepo = getDayStatusRepository();

export const getStatusByDate = async (date: string) => {
  if (!isValidCalendarDate(date)) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date' } };
  }

  const record = await dayStatusRepo.findByDate(date);
  
  return {
    success: true,
    data: record ? record : null, // If no record, return null data to show empty state
  };
};

export const getStatuses = async (year: number, month?: number) => {
  if (isNaN(year) || year < 1900 || year > 2100) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid year' } };
  }

  let records;
  if (month !== undefined) {
    if (isNaN(month) || month < 1 || month > 12) {
      return { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid month' } };
    }
    records = await dayStatusRepo.findByYearAndMonth(year, month);
  } else {
    records = await dayStatusRepo.findByYear(year);
  }

  return {
    success: true,
    data: records,
  };
};

export const updateStatus = async (date: string, status: string, userId: number) => {
  if (!isValidCalendarDate(date)) {
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
