import { Model } from 'sequelize';
export declare class DayStatus extends Model {
    id: number;
    date: string;
    status: string;
    created_by: number;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export declare const initDayStatusModel: () => void;
export declare const associateModels: () => void;
//# sourceMappingURL=DayStatus.d.ts.map