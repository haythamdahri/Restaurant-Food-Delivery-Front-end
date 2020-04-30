import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { retry, catchError, map } from "rxjs/operators";
import { Page } from "../pagination/page";
import { Review } from "../models/review.model";
import { Pageable } from "../pagination/pageable";

const API_V1_REVIEWS = "http://localhost:8080/api/v1/reviews";
const FILES_ENDOINT = "http://localhost:8080/api/v1/restaurantfiles/file";

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  getPagedReviews(
    pageable: Pageable,
    mealId: number
  ): Observable<Page<Review>> {
    let url =
      API_V1_REVIEWS +
      "/approved" +
      "?meal=" +
      mealId +
      "&page=" +
      pageable.pageNumber +
      "&size=" +
      pageable.pageSize;
    return this.http.get<Page<Review>>(url).pipe(
      map((response) => {
        let reviews = response.content.map((review) => {
          review.user.image.file = FILES_ENDOINT + "/" + review.user.image.id;
          return review;
        });
        response.content = reviews;
        return response;
      }),
      retry(5),
      catchError(this.handleHttpError)
    );
  }

  saveReview(review: { mealId: number; comment: string; rating: number }) {
    return this.http
      .post<Review>(
        `${API_V1_REVIEWS}/`,
        review,
        {
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("accept", "application/json"),
        }
      )
      .pipe(retry(5), catchError(this.handleHttpError));
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
