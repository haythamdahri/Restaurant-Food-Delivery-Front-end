import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const PAYMENT_ENDPOINT = "http://localhost:8080/api/v1/payments";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getCheckoutData() {
    return this.http.get<{
      amount: number;
      stripePublicKey: string;
      noActiveOrder: Boolean;
      currency: string;
      status: boolean;
    }>(`${PAYMENT_ENDPOINT}/checkout`);
  }
}
