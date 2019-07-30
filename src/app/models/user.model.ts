import { Role } from './role.model';

export class User {
    public id: number;
    public email: string;
    public password: string;
    public username: string;
    public enabled: boolean;
    public image: string;
    public roles: Array<Role>;
}