import { Role } from './role.model';
import { Meal } from './meal.model';
import { Review } from './review.model';

export class User {
    public id: number;
    public email: string;
    public password: string;
    public username: string;
    public enabled: boolean;
    public image: string;
    public location: string;
    public roles: Array<Role>;
    public preferredMeals: Array<Meal>;
    private reviews: Array<Review>;
}