import { Meal } from "./../models/meal.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {retry, catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { Page } from '../pagination/page';
import { Pageable } from '../pagination/pageable';
import { Review } from '../models/review.model';

 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const API = "http://localhost:8080/api/meals";
const API_V1 = "http://localhost:8080/api/v1/meals";

@Injectable({
  providedIn: "root"
})
export class MealService {

  constructor(private http: HttpClient) {}

  getMealsPage(pageable: Pageable): Observable<Page<Meal>> {
    let url = API_V1 + '/'
    + '?page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize;
    return this.http.get<Page<Meal>>(url, httpOptions).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  getRating(reviews: Array<Review>) {
    let sum = 0;
    // Check reviews
    if( reviews == null ) {
      return {filledStars: 0, unfilledStars: 0};
    }
    // Count reviews
    reviews.forEach(review => {
      sum += review.rating;
    });
    // Return stars as reviews
    const filledStars = Array.from(Array(Number.parseInt((sum/5).toString())).keys()).map(i => "*");
    const unfilledStars = Array.from(Array(Number.parseInt((5 - (sum/5)).toString())).keys()).map(i => "*");
    return {filledStars, unfilledStars}
  }

  getPopularMeals() {
    return this.http.get<Array<Meal>>(`${API_V1}/popular`).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  getMeal(id) {
    return this.http.get<{meal: Meal, mealPreferred: boolean}>(`${API_V1}/${id}`);
  }

  saveMeal(meal: Meal) {
    return this.http.post<Meal>(`${API}`, meal);
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
