import { User } from "./user.model";
import { MealOrder } from './meal-order.model';
import { Shipping } from './shipping.model';
export class Order {
    id: number;
    user: User;
    mealOrders: Array<MealOrder>;
    price: number;
    totalPrice: number;
    shippingFees: number;
    shipping: Shipping;
    time: Date;
    delivered: boolean;
    cancelled: boolean;
}