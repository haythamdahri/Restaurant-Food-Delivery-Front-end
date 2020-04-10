import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Page } from '../pagination/page';
import { Review } from '../models/review.model';
import { Pageable } from '../pagination/pageable';

const API_V1_REVIEWS = 'http://localhost:8080/api/v1/reviews';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  getPagedReviews(pageable: Pageable, mealId: number): Observable<Page<Review>> {
    let url = API_V1_REVIEWS + '/'
    + '?meal=' + mealId
    + '&page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize;
    return this.http.get<Page<Review>>(url).pipe(
      retry(5),
      catchError(this.handleHttpError)
    );
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
