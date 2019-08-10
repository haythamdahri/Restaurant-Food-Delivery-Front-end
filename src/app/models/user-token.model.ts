export class UserToken {
  bearerToken: string;
  token: string;
  email: string;
  roles: [{ authority: string }];
  exp: number;
}
