import { Meal } from "./meal.model";
import { Order } from './order.model';
export class MealOrder {
    public id: number;
    public meal: Meal;
    public order: Order;
    public quantity: number;
    public totalPrice: number;
}