import { Model } from 'sequelize';
export declare class User extends Model {
    id: number;
    email: string;
    password_hash: string;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export declare const initUserModel: () => void;
//# sourceMappingURL=User.d.ts.map