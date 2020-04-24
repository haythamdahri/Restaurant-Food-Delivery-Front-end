import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Order } from "../models/order.model";
import { catchError, retry } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { Payment } from '../models/payment.model';
import { Shipping } from '../models/shipping.model';
import { Pageable } from '../pagination/pageable';
import { Page } from '../pagination/page';

const PAYMENT_ENDPOINT = "http://localhost:8080/api/v1/payments";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  public stripe;

  constructor(private http: HttpClient) { }

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

  chargeCard(token: string, shipping: Shipping) {
    const headers = new HttpHeaders({ token: token });
    return this.http
      .post<{ status: boolean, message: string, order: Order }>(`${PAYMENT_ENDPOINT}/charge`, shipping, { headers: headers })
      .pipe(catchError(this.handleError));
  }

  getPaymentsHistoryPage(pageable: Pageable): Observable<Page<Payment>> {
    let url = PAYMENT_ENDPOINT + '/'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.http.get<Page<Payment>>(url, httpOptions).pipe(
      retry(5),
      catchError(this.handleError)
    );
  }

  getPaymentDetails(id: number) {
    return this.http.get<Payment>(`${PAYMENT_ENDPOINT}/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  downloadPaymentDetailsFile(id: number) {
    return this.http.get(`${PAYMENT_ENDPOINT}/download/${id}`, 
        { headers: new HttpHeaders({ 'Accept': 'application/pdf' }), responseType: 'blob' }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = "";
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      message = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      message = error.error;
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(message);
  };
}
