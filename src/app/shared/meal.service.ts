import { Meal } from "./../models/meal.model";
import { MealOrder } from "./../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MealService {
  private API = "http://localhost:8080/api";
  private API_V1 = "http://localhost:8080/api/v1/meals";

  constructor(private http: HttpClient) {}

  getMeals() {
    return this.http.get<Array<Meal>>(`${this.API}/meals?sort=id,desc`).pipe(
      map(data => {
        return data["_embedded"]["meals"];
      })
    );
  }

  getMeal(id) {
    return this.http.get<Meal>(`${this.API}/meals/${id}`);
  }

  saveMeal(meal: Meal) {
    return this.http.post<Meal>(`${this.API}/meals`, meal);
  }
}
