import { User } from './user.model';
import { Meal } from './meal.model';

export class Review {
    public id: number;
    public user: User;
    public meal: Meal;
    public comment: string;
    public rating: number;
}