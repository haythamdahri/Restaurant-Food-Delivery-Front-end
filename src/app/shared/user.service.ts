import { catchError, retry } from "rxjs/operators";
import { User } from "./../models/user.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private static SIGN_UP_ENDPOINT = 'http://localhost:8080/api/v1/sign-up';
  private static ACTIVATION_ACCOUNT_ENDPOINT = 'http://localhost:8080/api/v1/activate-account';

  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post<User>(UserService.SIGN_UP_ENDPOINT, user).pipe(
      map((user) => {
        return user;
      },
      catchError(this.handleHttpError)
      )
    );
  }

  activateAccount(token: string) {
    return this.http.get<{status: boolean, message: string}>(`${UserService.ACTIVATION_ACCOUNT_ENDPOINT}/${token}`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  handleHttpError(error) {
    return throwError(error);
  }
}
