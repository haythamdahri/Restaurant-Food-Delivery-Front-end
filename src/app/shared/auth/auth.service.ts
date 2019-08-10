import { UserToken } from './../../models/user-token.model';
import { map, retry, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwtDecode from "jwt-decode";
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static API = 'http://localhost:8080';
  private static EMAIL_CHECK_ENDPINT = 'http://localhost:8080/api/users/search/existsByEmail';

  constructor(private http: HttpClient) { }

  // Check expiration date
  isValidToken(expiration: number) {
    const now = new Date().getTime();
    return expiration > now;
  }

  // Check if user is authenticated
  isAuthenticated() {
    let userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    // Checking expiration and email
    if (userToken != null && this.isValidToken(userToken.exp)) {
      return true;
    } else {
      this.logout();
      return false;
    }
  }

  // Get current user
  getAuthenticatedUser() {
    const userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    if (userToken != null) {
      return userToken;
    } else {
      return null;
    }
  }

  // Login into internal system
  login(email: string, password: string) {
    return this.http
      .post<{ token: string }>(`${AuthService.API}/authenticate`, {
        email,
        password
      })
      .pipe(
        map(userData => {
          let userToken = this.decodeToken(userData.token);
          localStorage.setItem('userToken', JSON.stringify(userToken));
          return userToken;
        })
      );
  }

  // Logout from the system
  logout() {
    localStorage.clear();
  }

  // Check if user has role
  async hasRole(roleName: string) {
    let userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    return (
      userToken.roles.find(role => role.authority === roleName) != null
    );
  }

  // Check if connected user is an admin
  isAdmin() {
    let userToken: UserToken = JSON.parse(localStorage.getItem('userToken'));
    return (
      userToken.roles.find(role => role.authority === 'ROLE_ADMIN') != null
    );
  }

  // Decode token
  decodeToken(token: string) {
    var decoded = jwtDecode(token);
    let userToken = new UserToken();
    userToken.bearerToken = 'Bearer ' + token;
    userToken.token = token;
    userToken.email = decoded.sub;
    userToken.roles = decoded.roles;
    userToken.exp = Number(decoded.exp * 1000);
    return userToken;
  }

  // Check if the email is already used
  checkEmailValidity(email: string) {
    return this.http.get<boolean>(AuthService.EMAIL_CHECK_ENDPINT, { params: new HttpParams().append('email', email) }).pipe(
      map((exists) => {
        if (exists) {
          if (!this.isAuthenticated()) {
            return { 'isEmailAlreadyUsed': exists };
          } else {
            if (this.getAuthenticatedUser().email !== email) {
              return { 'isEmailAlreadyUsed': exists };
            } else {
              return null;
            }
          }
        } else {
          return null;
        }
      }),
      retry(3),
      catchError(this.handleEmailValidityError)
    );
  }

  // Check if the email exists 
  checkEmailExisting(email: string) {
    return this.http.get<boolean>(AuthService.EMAIL_CHECK_ENDPINT, { params: new HttpParams().append('email', email) }).pipe(
      map((exists) => {
        if (exists) {
          return null;
        } else {
          return { 'isEmailDoesNotExist': true };
        }
      }),
      retry(3),
      catchError(this.handleEmailValidityError)
    );
  }

  handleEmailValidityError(error) {
    return throwError(error);
  }
}
