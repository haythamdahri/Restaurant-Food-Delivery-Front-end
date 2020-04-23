import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../shared/payment.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Payment } from '../models/payment.model';
import { Page } from '../pagination/page';
import { CustomPaginationService } from '../pagination/services/custom-pagination.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  private paymentsSubscription: Subscription;
  page: Page<Payment> = new Page();
  public loading: boolean = true;
  public error: boolean = false;
  message: string;

  // TODO: PAGEABLE OBJECT

  constructor(private paymentService: PaymentService, private titleService: Title, private paginationService: CustomPaginationService) { }

  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Payments');
    // Get payments data
    this.getData();
  }

  ngOnDestroy() {
    // Unsubscribe from subscriptions
    if( this.paymentService != null ) {
      this.paymentsSubscription.unsubscribe();
    }
  }

  getData() {
    // Retrieve payments
    this.paymentsSubscription = this.paymentService.getPaymentsHistoryPage(this.page.pageable).subscribe(
      (page) => {
        this.page = page;
        // Set loading to false
        this.loading = false;
        this.error = false;
      },
      (err) => {
        // Set error
        this.error = true;
        this.loading = false;
        this.message = err?.message || err?.text || 'An error occurred while retrieving payments!';
      }
    );
  }

  getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.getData();
  }

  getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.getData();
  }

  getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(
      this.page,
      pageSize
    );
    this.getData();
  }

}
