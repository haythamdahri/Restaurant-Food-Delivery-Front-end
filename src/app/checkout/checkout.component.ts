import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { PaymentService } from "../shared/payment.service";
import { Title } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import {
  StripeService,
  Elements,
  ElementsOptions,
  StripeCardComponent,
  ElementOptions,
} from "ngx-stripe";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { Order } from '../models/order.model';
import { CountriesService } from '../shared/countries.service';
import { Country } from '../models/country.model';
import { Shipping } from '../models/shipping.model';
import Swal from 'sweetalert2';

declare var Stripe: any;
// Your Stripe public key
const stripe = Stripe("pk_test_123456123456123456");

// Create `card` element that will watch for updates
// and display error messages
const elements = stripe.elements();

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private checkoutSubscription: Subscription;
  private chargeSubscription: Subscription;
  private countriesSubscription: Subscription;
  private stripeSubscription: Subscription;
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
    order: Order
  } = null;
  public countries: Array<Country>;
  public shipping: Shipping = new Shipping();

  // Stripe elements
  error: any;
  elements: Elements;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        lineHeight: "40px",
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };
  elementsOptions: ElementsOptions = {
    locale: "en",
  };
  public paymentForm: FormGroup;
  @ViewChild("proceedBtn", { static: false }) proceedBtn: ElementRef;

  isPaymentDone: boolean = false;
  order: Order = null;

  constructor(
    private paymentService: PaymentService,
    private titleService: Title,
    private stripeService: StripeService,
    private countriesService: CountriesService
  ) {}

  async ngOnInit() {
    // Set page title
    this.titleService.setTitle("Checkout");
    // Initialize stripe form
    this.paymentForm = new FormGroup({
      country: new FormControl("", Validators.required),
      firstName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      lastName: new FormControl("", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      address: new FormControl("", [Validators.required, Validators.minLength(15), Validators.maxLength(250)]),
      city: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      state: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      postalCode: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl("", [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(40)]),
      phone: new FormControl("", [Validators.required])
    });
    // Fetch checkout data
    this.checkoutSubscription = this.paymentService.getCheckoutData().subscribe(
      (checkoutData) => {
        // Check if user has an order in progress
        if (
          checkoutData.status == true &&
          checkoutData.noActiveOrder == false
        ) {
          this.checkoutData = checkoutData;
          // Fetch countries
          this.fetchCountries();
        } else {
          // Set no checkout order in place
          this.isNoOrder = true;
          this.isError = false;
          this.message = "No order in place, please add products to your cart!";
        }
      },
      (error) => {
        this.message = "An error occurred!";
        this.isNoOrder = false;
        this.isError = true;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  fetchCountries() {
    this.countriesSubscription = this.countriesService.getCountries().subscribe(
      (countries) => {
        this.countries = countries;
      },
      (err) => {
        // Fill temprory countries
        const tempCountry = new Country();
        tempCountry.name = 'WORLD';
        this.countries = [tempCountry];
      }
    )
  }

  ngOnDestroy() {
    // Unsubscribe from subscritpions
    if (this.checkoutSubscription != null) {
      this.checkoutSubscription.unsubscribe();
    }
    if (this.stripeSubscription != null) {
      this.stripeSubscription.unsubscribe();
    }
    if( this.chargeSubscription != null ) {
      this.chargeSubscription.unsubscribe();
    }
    if( this.countriesSubscription != null ) {
      this.countriesSubscription.unsubscribe();
    }
  }

  onBuy() {
    // Check if the form is valid
    if( this.paymentForm.invalid ) {
      Swal.fire({
        type: 'error',
        title: 'Invalid data',
        text: 'Payment form data is invalid, please recheck your inputs!'
      });
      return null;
    }
    // No error in the begining
    this.error = null;
    // Set proceed button state
    const originalBtn = (this.proceedBtn.nativeElement as HTMLButtonElement)
      .innerHTML;
    (this.proceedBtn.nativeElement as HTMLButtonElement).innerHTML = `
      <div class="spinner-border spinner-border-sm text-light" role="status">
        <span class="sr-only">Loading...</span>
      </div> Proceeding
    `;
    (this.proceedBtn.nativeElement as HTMLButtonElement).disabled = true;
    this.stripeSubscription = this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(
        (result) => {
          if (result.token) {
            // Proceed to server for payment
            this.pursuitPurchase(result.token.id, originalBtn);
          } else if (result.error) {
            this.error = result.error.message;
            // Set origin button state
            (this.proceedBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
            (this.proceedBtn.nativeElement as HTMLButtonElement).disabled = false;
          }
        },
        () => {
          // Set origin button state
          (this.proceedBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
          (this.proceedBtn.nativeElement as HTMLButtonElement).disabled = false;
        }
      );
  }

  pursuitPurchase(token, originalBtn) {
    // Set form data in shipping object
    this.shipping = this.paymentForm.value;
    this.chargeSubscription = this.paymentService.chargeCard(token, this.shipping).subscribe(
      (data) => {
        console.log(data);
        // Check if payment is done successfully
        if( data.status == true ) {
          this.order = data.order;
          this.isPaymentDone = true;
          this.message = data.message;
        } else {
          this.error = data.message;
        }
        // Set origin button state
        (this.proceedBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
        (this.proceedBtn.nativeElement as HTMLButtonElement).disabled = false;
      },
      (err) => {
        this.error = err;
        // Set origin button state
        (this.proceedBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
        (this.proceedBtn.nativeElement as HTMLButtonElement).disabled = false;
      },
      () => {
      }
    );
  }
}
