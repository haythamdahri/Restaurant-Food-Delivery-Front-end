import { User } from './user.model';
import { RoleType } from './role-type.enum';

export class Role {
    id: number;
    roleName: RoleType;
    users: Array<User>;
}