"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getStatuses = exports.getStatusByDate = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const dayStatusService = __importStar(require("../services/dayStatusService"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const dateParamSchema = zod_1.z.object({
    date: zod_1.z.string(),
});
const querySchema = zod_1.z.object({
    year: zod_1.z.string().regex(/^\d{4}$/).transform(Number),
    month: zod_1.z.string().regex(/^\d{1,2}$/).transform(Number).optional(),
});
const updateSchema = zod_1.z.object({
    status: zod_1.z.string().min(1, 'Status cannot be empty'),
});
const getStatusByDate = async (req, res) => {
    try {
        const parsedParams = dateParamSchema.safeParse(req.params);
        if (!parsedParams.success) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid date parameter' } });
        }
        const result = await dayStatusService.getStatusByDate(parsedParams.data.date);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('getStatusByDate error:', error);
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
    }
};
exports.getStatusByDate = getStatusByDate;
const getStatuses = async (req, res) => {
    try {
        const parsedQuery = querySchema.safeParse(req.query);
        if (!parsedQuery.success) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters' } });
        }
        const { year, month } = parsedQuery.data;
        const result = await dayStatusService.getStatuses(year, month);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('getStatuses error:', error);
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
    }
};
exports.getStatuses = getStatuses;
const updateStatus = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } });
        }
        const parsedParams = dateParamSchema.safeParse(req.params);
        const parsedBody = updateSchema.safeParse(req.body);
        if (!parsedParams.success || !parsedBody.success) {
            return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } });
        }
        const { date } = parsedParams.data;
        const { status } = parsedBody.data;
        const result = await dayStatusService.updateStatus(date, status, req.user.id);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    }
    catch (error) {
        console.error('updateStatus error:', error);
        res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong' } });
    }
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=dayStatusController.js.map