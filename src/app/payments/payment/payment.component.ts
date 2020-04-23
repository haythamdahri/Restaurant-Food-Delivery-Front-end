import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PaymentService } from 'src/app/shared/payment.service';
import { Payment } from 'src/app/models/payment.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  private paymentSubscription: Subscription;
  private routeSubscription: Subscription;
  payment: Payment;
  loading: boolean = true;
  error: boolean = false;
  message: string;

  constructor(private route: ActivatedRoute, private titleService: Title, private paymentService: PaymentService) { }

  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Payment details');
    // Subscribe to route
    this.routeSubscription = this.route.params.subscribe(
      (params: Params) => {
        const paymentId = params.id;
        this.paymentSubscription = this.paymentService.getPaymentDetails(paymentId).subscribe(
          (payment) => {
            this.payment = payment;
            this.loading = false;
            this.error = false;
          },
          (err) => {
            this.message = err?.message || err?.text || 'An error occurred while retrieving payment details!';
            this.error = true;
            this.loading = false;
            this.payment = null;
          }
        );
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if( this.routeSubscription != null ) {
      this.routeSubscription.unsubscribe();
    }
    if( this.paymentSubscription != null ) {
      this.paymentSubscription.unsubscribe();
    }
  }

}
