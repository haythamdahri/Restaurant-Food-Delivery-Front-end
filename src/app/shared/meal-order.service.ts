import { MealOrder } from "../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class MealOrderService {
  private API = environment.mealOrderServiceEndpoints.API;
  private API_V1 = environment.mealOrderServiceEndpoints.API_V1;

  constructor(private http: HttpClient) {}

  getMealOrder(mealOrderId: number) {
    return this.http.get<MealOrder>(`${this.API}/mealOrders/${mealOrderId}`);
  }

  addMealOrder(mealId: number, quantity: number) {
    return this.http.post<{ status: boolean; message: string }>(
      `${this.API_V1}/`,
      { mealId, quantity }
    );
  }

  saveMealOrder(mealOrder: MealOrder) {
    return this.http.post<MealOrder>(`${this.API}/mealOrders`, mealOrder);
  }

  updateQuantity(mealOrderId: number, newQuantity: number) {
    return this.http.patch<{ status: boolean; message: string }>(
      `${this.API_V1}/${mealOrderId}/quantity/${newQuantity}`,
      {
        id: mealOrderId,
        quantity: parseInt(newQuantity.toString()),
      }
    );
  }

  handleHttpError(error) {
    let errorMessage = "";
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
