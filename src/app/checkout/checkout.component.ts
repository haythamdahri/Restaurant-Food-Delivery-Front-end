import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../shared/payment.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {

  private checkoutSubscription: Subscription;
  public message: string;
  public isLoading: boolean = true;
  public isError: boolean = false;
  public isNoOrder: boolean = false;
  public checkoutData: {
    amount: number;
    stripePublicKey: string;
    noActiveOrder: Boolean;
    currency: string;
    status: boolean;
  } = null;

  constructor(private paymentService: PaymentService,
      private titleService: Title) { }

  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Checkout');
    // Fetch checkout data
    this.checkoutSubscription = this.paymentService.getCheckoutData().subscribe(
      (checkoutData) => {
        // Check if user has an order in progress
        if( checkoutData.status == true && checkoutData.noActiveOrder == false ) {
          this.checkoutData = checkoutData;
        } else {
          // Set no checkout order in place
          this.isNoOrder = true;
          this.isError = false;
          this.message = 'No order in place, please add products to your cart!'
        }
      },
      (error) => {
        this.message = 'An error occurred!'
        this.isNoOrder = false;
        this.isError = true;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from subscritpions
    if( this.checkoutSubscription != null ) {
      this.checkoutSubscription.unsubscribe();
    }
  }

}
