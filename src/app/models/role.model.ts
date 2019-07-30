import { User } from './user.model';

export class Role {
    id: number;
    roleName: string;
    users: Array<User>;
}