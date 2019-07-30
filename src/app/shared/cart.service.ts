import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private API = 'http://localhost:8080/api';
  private API_VA = 'http://localhost:8080/api/v1';
  // Temprory user with id = 1
  private USER_CART =
    'http://localhost:8080/api/v1/user-cart';

  constructor(private http: HttpClient) {}

  getUserCartOrders() {
    return this.http.get(this.USER_CART,).pipe(
      map(data => {
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
