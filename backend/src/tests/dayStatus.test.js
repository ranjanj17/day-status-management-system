"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
(0, vitest_1.describe)('Day Status API', () => {
    let token;
    (0, vitest_1.beforeAll)(async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({ email: 'daystatus@example.com', password: 'password123' });
        token = res.body.data.token;
    });
    (0, vitest_1.it)('should get empty statuses for a year', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/day-status?year=2026');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data).toEqual([]);
    });
    (0, vitest_1.it)('should prevent unauthenticated update', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/day-status/2026-01-01')
            .send({ status: 'Working' });
        (0, vitest_1.expect)(res.status).toBe(401);
    });
    (0, vitest_1.it)('should allow authenticated update', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/day-status/2026-01-01')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Working' });
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.success).toBe(true);
        (0, vitest_1.expect)(res.body.data.status).toBe('Working');
    });
    (0, vitest_1.it)('should fetch the updated status', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/day-status/2026-01-01');
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body.data.status).toBe('Working');
    });
    (0, vitest_1.it)('should reject invalid dates like 2026-02-29', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/day-status/2026-02-29')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Working' });
        (0, vitest_1.expect)(res.status).toBe(400);
        (0, vitest_1.expect)(res.body.error.code).toBe('VALIDATION_ERROR');
    });
    (0, vitest_1.it)('should accept leap year date like 2024-02-29', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/day-status/2024-02-29')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Working' });
        (0, vitest_1.expect)(res.status).toBe(200);
    });
    (0, vitest_1.it)('should reject invalid dates like 2026-04-31', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .put('/api/day-status/2026-04-31')
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'Working' });
        (0, vitest_1.expect)(res.status).toBe(400);
    });
});
//# sourceMappingURL=dayStatus.test.js.map