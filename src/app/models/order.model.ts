import { User } from "./user.model";
import { MealOrder } from './meal-order.model';
export class Order {
    id: number;
    user: User;
    mealOrders: Array<MealOrder>;
    price: number;
    totalPrice: number;
    shippingFees: number;
    deliveryAddress: string;
    time: Date;
    delivered: boolean;
    cancelled: boolean;
}