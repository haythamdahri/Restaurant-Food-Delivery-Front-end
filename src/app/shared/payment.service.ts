import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Order } from "../models/order.model";
import { catchError, retry } from "rxjs/operators";
import { throwError } from "rxjs";

const PAYMENT_ENDPOINT = "http://localhost:8080/api/v1/payments";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  public stripe;

  constructor(private http: HttpClient) {}

  getCheckoutData() {
    return this.http.get<{
      amount: number;
      stripePublicKey: string;
      noActiveOrder: Boolean;
      currency: string;
      status: boolean;
      order: Order;
    }>(`${PAYMENT_ENDPOINT}/checkout`);
  }

  chargeCard(token: string) {
    const headers = new HttpHeaders({ token: token });
    return this.http
      .post(`${PAYMENT_ENDPOINT}/charge`, {}, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
