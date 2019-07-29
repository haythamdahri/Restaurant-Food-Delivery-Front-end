import { Meal } from "./../models/meal.model";
import { MealOrder } from "./../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private API = 'http://localhost:8080/api';
  private API_V1 = 'http://localhost:8080/api/v1';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getMeals() {
    return this.http.get(`${this.API}/meals`);
  }

  addMealOrders(meal: Meal, quantity: number) {
    const mealOrder = new MealOrder();
    mealOrder.meal = meal;
    mealOrder.price = meal.price*quantity;
    mealOrder.quantity = quantity;
    console.log(mealOrder);
    return this.http.post(`${this.API_V1}/add-user-meal-order`, mealOrder, {headers: this.headers});
  }
}
