import { MealOrder } from "../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { throwError } from "rxjs";

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

  saveMealOrder(mealOrder: MealOrder) {
    return this.http.post<MealOrder>(`${this.API}/mealOrders`, mealOrder);
  }

  updateQuantity(mealOrderId: number, newQuantity: number) {
    return this.http.patch<MealOrder>(`${this.API}/mealOrders/${mealOrderId}`, {
      id: mealOrderId,
      quantity: newQuantity,
    });
  }
}
