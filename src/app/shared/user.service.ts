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
  private static PASSWORD_RESET_ENDPOINT = 'http://localhost:8080/api/v1/reset-password';
  private static CHECK_TOKEN_ENDPOINT = 'http://localhost:8080/api/v1/check-token';
  private static PERFOMR_PASSWORD_RESET_ENDPOINT = 'http://localhost:8080/api/v1/perform-reset-password';

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

  sendPasswordResetToken(email: string) {
    return this.http.post<{status: boolean, message: string}>(`${UserService.PASSWORD_RESET_ENDPOINT}`, email).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{status: boolean, message: string}>(`${UserService.PERFOMR_PASSWORD_RESET_ENDPOINT}`, {token: token, newPassword: newPassword}).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  checkPasswordResetToken(token: string) {
    return this.http.get<{status: boolean, message: string}>(`${UserService.CHECK_TOKEN_ENDPOINT}/${token}`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  handleHttpError(error) {
    return throwError(error);
  }
}
