import { Meal } from "./meal.model";
export class MealOrder {
    public id: number;
    public meal: Meal;
    public quantity: number;
    public price: number;
}