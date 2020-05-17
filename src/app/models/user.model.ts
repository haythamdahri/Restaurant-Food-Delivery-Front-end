import { Role } from './role.model';
import { Meal } from './meal.model';
import { Review } from './review.model';
import { RestaurantFile } from './restaurant-file.model';

export class User {
    public id: number;
    public email: string;
    public password: string;
    public username: string;
    public enabled: boolean;
    public image: RestaurantFile = new RestaurantFile();
    public location: string;
    public roles: Array<Role>;
    public preferredMeals: Array<Meal>;
    private reviews: Array<Review>;
    public online: boolean = false;
    public lastOnlineTime: Date = new Date();
}