import { Meal } from "./../models/meal.model";
import { MealOrder } from "./../models/meal-order.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, retry, catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MealService {
  private API = "http://localhost:8080/api";
  private API_V1 = "http://localhost:8080/api/v1/meals";

  constructor(private http: HttpClient) {}

  getMeals() {
    return this.http.get<Array<Meal>>(`${this.API_V1}/`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  getPopularMeals() {
    return this.http.get<Array<Meal>>(`${this.API_V1}/popular`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  getMeal(id) {
    return this.http.get<Meal>(`${this.API}/meals/${id}`);
  }

  saveMeal(meal: Meal) {
    return this.http.post<Meal>(`${this.API}/meals`, meal);
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
