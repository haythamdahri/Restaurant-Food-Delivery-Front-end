import { MealOrder } from "../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { throwError } from "rxjs";
import { Meal } from '../models/meal.model';

@Injectable({
  providedIn: "root",
})
export class MealOrderService {
  private API = "http://localhost:8080/api";
  private API_V1 = "http://localhost:8080/api/v1/mealorders";

  constructor(private http: HttpClient) {}

  getMealOrder(mealOrderId: number) {
    return this.http.get<MealOrder>(`${this.API}/mealOrders/${mealOrderId}`);
  }

  addMealOrder(mealId: number, quantity: number) {
    return this.http.post(`${this.API_V1}/`, {mealId, quantity});
  }

  saveMealOrder(mealOrder: MealOrder) {
    return this.http.post<MealOrder>(`${this.API}/mealOrders`, mealOrder);
  }

  updateQuantity(mealOrderId: number, newQuantity: number) {
    return this.http.patch<{status: boolean, message: string}>(`${this.API_V1}/${mealOrderId}/quantity/${newQuantity}`, {
      id: mealOrderId,
      quantity: parseInt(newQuantity.toString()),
    });
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
