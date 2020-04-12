import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/shared/review.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit, OnDestroy {

  @Input('transferedData') transferedData: {meal: Meal, reviewed: Boolean};
  @Output('onMealFormEnd') onMealFormEnd: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  isDone: boolean = false;
  reviewSubscription: Subscription;
  @ViewChild('submitBtn') submitBtn: ElementRef;
  
  constructor(private reviewService: ReviewService) { }

  ngOnInit() {
    // Init form controls
    this.form = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.minLength(25), Validators.maxLength(1200)]),
      rating: new FormControl(5, [Validators.required])
    });
  }

  ngOnDestroy() {
    // Unsubscribe from active subscriptions
    if( this.reviewSubscription != null ) {
      this.reviewSubscription.unsubscribe();
    }
  }

  onReviewSubmit() {
    // Check form validity
    if( this.form.invalid ) {
      Swal.fire(
        'Invalid review!',
        'Please check inputs!',
        'error'
      ); 
    } else {
      // Set loading on button
      const originalBtn = (this.submitBtn.nativeElement as HTMLButtonElement).innerHTML;
      (this.submitBtn.nativeElement as HTMLButtonElement).innerHTML = `
          <div class="spinner-border spinner-border-sm text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div> 
          Submitting review
      `;
      (this.submitBtn.nativeElement as HTMLButtonElement).disabled = true;
      // Create custom review to post
      let customreview = this.form.value;
      customreview['mealId'] = this.transferedData.meal.id;
      // Use service method to send review to the server
      this.reviewSubscription = this.reviewService.saveReview(customreview).subscribe(
        (review) => {
          this.isDone = true;
          // Set button original state
          (this.submitBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
          (this.submitBtn.nativeElement as HTMLButtonElement).disabled = false;
        },
        (error) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            type: "error",
            title: "An error occurred, please try again!",
          });
          // Set button original state
          (this.submitBtn.nativeElement as HTMLButtonElement).innerHTML = originalBtn;
          (this.submitBtn.nativeElement as HTMLButtonElement).disabled = false;
        },
        () => {
        }
      );
    }
  }

}
