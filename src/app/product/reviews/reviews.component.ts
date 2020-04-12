import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ReviewService } from 'src/app/shared/review.service';
import { Subscription, Observable } from 'rxjs';
import { Page } from 'src/app/pagination/page';
import { Review } from 'src/app/models/review.model';
import { CustomPaginationService } from 'src/app/pagination/services/custom-pagination.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  isError: boolean = false;
  eventSubscription: Subscription;
  pageReviewsSubscription: Subscription;
  @Input() events: Observable<number>;
  page: Page<Review> = new Page();
  private mealId: number;
  private errorMessage: string = '';
  USERS_IMAGE_PREFIX = 'http://localhost:8080/uploads/users/images';

  constructor(private reviewService: ReviewService, private paginationService: CustomPaginationService) { }

  ngOnInit() {
    // Subscribe to events from parent component
    this.eventSubscription = this.events.subscribe(
      (mealId) => {
        // Check if mealId is null
        if( mealId != null ) {
          this.mealId = mealId;
          // Fetch data
          this.fetchData();
        } else {
          // Set error
          this.isError = true;
          this.errorMessage = 'No product exists for reviews';
        }
      }
    );
  }

  ngOnDestroy() {
    if( this.eventSubscription != null ) {
      this.eventSubscription.unsubscribe();
    }
    if( this.pageReviewsSubscription != null ) {
      this.pageReviewsSubscription.unsubscribe();
    }
    // Unfill data
    this.page = null;
  }

  fetchData() {
    this.pageReviewsSubscription = this.reviewService.getPagedReviews(this.page.pageable, this.mealId).subscribe(
      (page) => {
        this.page = page;
        // Set loading to false
        this.isLoading = false;
      },
      (error) => {
        // Set error mode
        this.isError = true;
        this.errorMessage = 'An error occurred';
      }
    );
  }

  getNextPage(): void {
    this.page.pageable = this.paginationService.getNextPage(this.page);
    this.fetchData();
  }

  getPreviousPage(): void {
    this.page.pageable = this.paginationService.getPreviousPage(this.page);
    this.fetchData();
  }

  getPageInNewSize(pageSize: number): void {
    this.page.pageable = this.paginationService.getPageInNewSize(
      this.page,
      pageSize
    );
    this.fetchData();
  }

  // Request filled and unfilled stars for display purposes
  getRating(rating: number) {
    return {
      filledStars: Array(rating).fill("*"),
      unfilledStars: Array(5 - rating).fill("*"),
    };
  }
}
