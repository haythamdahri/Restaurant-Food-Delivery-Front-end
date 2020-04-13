import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
    }>(`${PAYMENT_ENDPOINT}/checkout`);
  }

  chargeCard(token: string) {
    const headers = new HttpHeaders({'token': token, 'amount': '100'});
    this.http.post(`${PAYMENT_ENDPOINT}/charge`, {}, {headers: headers})
      .subscribe(resp => {
        console.log(resp);
      })
  }
}
