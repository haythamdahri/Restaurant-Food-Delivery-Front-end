import { AuthService } from './auth/auth.service';
import { map, catchError, retry } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, ErrorHandler } from '@angular/core';
import { throwError } from 'rxjs';
import { ConstantsService } from './constants.service';
import { Order } from '../models/order.model';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CartService {

  public API = environment.cartServiceEndpoint.API;
  public API_V1 = environment.cartServiceEndpoint.API_V1;
  public USER_CART = environment.cartServiceEndpoint.USER_CART;
  
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserCartOrders() {
    let headers = new HttpHeaders().set('Authorization', this.authService.getAuthenticatedUser().bearerToken);
    return this.http.get<{status: boolean, activeOrder: Order, noActiveOrder}>(`${this.USER_CART}/`, {
      headers: headers
    }).pipe(
      map((data) => {
        // Check if their is an order in progress
        if( data.noActiveOrder == false  ) {
          // Update image file and return data
          let mealOrders = data.activeOrder.mealOrders.map((mealOrder) => {
            mealOrder.meal.image.file = ConstantsService.FILES_ENDOINT + '/' + mealOrder.meal.image.id;
            return mealOrder;
          });
          data.activeOrder.mealOrders = mealOrders;
        }
        return data;
      }),
      catchError(this.handleHttpError)
    );
  }

  deleteMealOrder(id: number) {
    return this.http.delete<{status: boolean, message: string}>(`${this.API_V1}/mealorders/${id}`);
  }

  /**
   * Check if a meal is deleted in Order
   * @param order: Order
   */
  hasOrderDeletedMeals(order: Order) {
    return order.mealOrders?.filter((mealOrder, index) => mealOrder.meal.deleted).length > 0;
  }

  handleHttpError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
