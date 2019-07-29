import { Meal } from './../models/meal.model';
import { MealOrder } from './../models/meal-order.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private API = 'http://localhost:8080/api';
  private API_V1 = 'http://localhost:8080/api/v1';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getMeals() {
    return this.http.get<Array<Meal>>(`${this.API}/meals`).pipe(
      map(data => {
        const meals = new Array<Meal>();
        for (let meal of data['_embedded']['meals']) {
          const tempMeal = new Meal();
          tempMeal.id = meal.id;
          tempMeal.image = meal.image;
          tempMeal.name = meal.name;
          tempMeal.price = meal.price;
          meals.push(tempMeal);
        }
        return meals;
      })
    );
  }

  addMealOrders(meal: Meal, quantity: number) {
    const mealOrder = new MealOrder();
    mealOrder.id = null;
    mealOrder.meal = meal;
    mealOrder.quantity = quantity;
    console.log(mealOrder);
    return this.http.post(`${this.API_V1}/add-user-meal-order`, mealOrder);
  }
}
