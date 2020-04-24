import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { PaymentService } from 'src/app/shared/payment.service';
import { Payment } from 'src/app/models/payment.model';
import Swal from 'sweetalert2';

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
  paymentDetailsFileSubscription: Subscription;
  @ViewChild('downloadBtn', {static: false}) downloadBtn: ElementRef;

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
            this.message = (typeof err == 'string') ? err : err?.message || err?.text || 'An error occurred while retrieving payment details!';
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

  onPaymentDetailsDownload() {
    // Button state
    const originalContent = (this.downloadBtn.nativeElement as HTMLButtonElement).innerHTML;
    (this.downloadBtn.nativeElement as HTMLButtonElement).innerHTML = `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Downloading document
    `;
    (this.downloadBtn.nativeElement as HTMLButtonElement).disabled = true;
    // Download Payment File Details
    this.paymentDetailsFileSubscription = this.paymentService.downloadPaymentDetailsFile(this.payment.id).subscribe(
      (response) => {
        // Invoke local method to download retrieved file
        this.downloadFile(response);
        // Reset Button to original state
        (this.downloadBtn.nativeElement as HTMLButtonElement).innerHTML = originalContent;
        (this.downloadBtn.nativeElement as HTMLButtonElement).disabled = false;
      },
      (err) => {
        // Reset Button to original state
        (this.downloadBtn.nativeElement as HTMLButtonElement).innerHTML = originalContent;
        (this.downloadBtn.nativeElement as HTMLButtonElement).disabled = false;
        console.log(err);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        const title = 'An error occurred while downloading payment details document!';
        Toast.fire({
          type: "error",
          title,
        });
      }
    );
  }

  downloadFile(data) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

}
