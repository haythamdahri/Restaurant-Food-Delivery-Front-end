import { Order } from './order.model';
import { User } from './user.model';

export class Payment {
    public id: number;
    public user: User;
    public order: Order;
    public chargeId: number;
    public timestamp: Date;
}