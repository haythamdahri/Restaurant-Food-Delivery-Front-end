import { AuthService } from './auth/auth.service';
import { map, catchError, retry } from 'rxjs/operators';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private API = 'http://localhost:8080/api';
  private API_VA = 'http://localhost:8080/api/v1';
  // Temprory user with id = 1
  private USER_CART = 'http://localhost:8080/api/v1/user-cart';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserCartOrders() {
    let headers = new HttpHeaders().set('Authorization', this.authService.getAuthenticatedUser().bearerToken);
    return this.http.get(this.USER_CART, {
      headers: headers
    }).pipe(
      map((data) => {
        return data;
      }),
      catchError(this.handleError)
    );
  }

  handleError(err: HttpErrorResponse) {
    return throwError(err);
  }

  deleteMealOrder(id: number) {
    return this.http.delete(`${this.API}/mealOrders/${id}`);
  }
}
