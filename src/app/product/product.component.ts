import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription, Subject } from "rxjs";
import { MealService } from "../shared/meal.service";
import { Meal } from "../models/meal.model";
import { MealOrder } from "../models/meal-order.model";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AuthService } from "../shared/auth/auth.service";
import { UserService } from "../shared/user.service";
import { MealOrderService } from "../shared/meal-order.service";
import { Title } from "@angular/platform-browser";

enum ChangeType {
  INCREMENT,
  DECREMENT,
}

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnInit, OnDestroy {
  changeType = ChangeType;
  routeSubscription: Subscription;
  mealSubscription: Subscription;
  mealPreferencesSubscription: Subscription;
  orderSubscription: Subscription;
  isLoading: boolean = true;
  isError: boolean = false;
  errorMessage: string = "";
  mealOrder: MealOrder = new MealOrder();
  mealPreferred: boolean;
  @ViewChild("addMealToCartBtn")
  addMealToCartBtn: ElementRef;
  @ViewChild("btnPrefer") btnPrefer: ElementRef;
  @ViewChild("quantity") quantity: ElementRef;

  eventsSubject: Subject<number> = new Subject<number>();

  transferedData: { meal: Meal; reviewed: Boolean } = {
    meal: null,
    reviewed: false,
  };

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    public authService: AuthService,
    private userService: UserService,
    private mealOrderService: MealOrderService,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Set meal loading image
    this.mealOrder.meal = new Meal();
    this.mealOrder.meal.image.file = "../../assets/img/loading.gif";
    // Subscribe to activated route
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if (params["id"] != null) {
        const mealId = params.id;
        this.mealSubscription = this.mealService.getMeal(mealId).subscribe(
          (response) => {
            // Check if meal exists
            this.mealOrder.meal = response.meal;
            this.mealPreferred = response.mealPreferred;
            this.mealOrder.quantity = 1;
            // Set page title
            this.titleService.setTitle(response.meal.name);
            // Emit event to child reviews child component
            this.eventsSubject.next(response.meal.id);
            // Set if meal is reviewed by current user | Check user if authenticated first
            if( this.authService.isAuthenticated() ) {
              const currentUser = this.userService
                .getAuthenticatedUserDetails()
                .subscribe((user) => {
                  this.transferedData.reviewed =
                    response.meal.reviews.filter(
                      (review) => review.user.id == user.id
                    ).length > 0;
                });
            }
          },
          (error) => {
            this.errorMessage = "No product has been found";
            this.isError = true;
            // Emit event to child reviews child component to null
            this.eventsSubject.next(null);
            // Set null to Transfered Data
            this.transferedData = null;
            // Set page title
            this.titleService.setTitle("No product found");
          },
          () => {
            this.isLoading = false;
          }
        );
      } else {
        this.errorMessage = "No product has been found!";
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
    if (this.mealSubscription != null) {
      this.mealSubscription.unsubscribe();
    }
    if (this.mealPreferencesSubscription != null) {
      this.mealPreferencesSubscription.unsubscribe();
    }
    if (this.orderSubscription != null) {
      this.orderSubscription.unsubscribe();
    }
    // Unfill values
    this.mealOrder = null;
  }

  onQuantityChange(event) {
    const newQuantity = parseInt(
      (this.quantity.nativeElement as HTMLInputElement).value
    );
    if (newQuantity <= 0 || newQuantity > this.mealOrder.meal.stock) {
      (this.quantity
        .nativeElement as HTMLInputElement).value = this.mealOrder.quantity.toString();
    } else {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
      (this.quantity
        .nativeElement as HTMLInputElement).value = newQuantity.toString();
      this.mealOrder.quantity = newQuantity;
    }
  }

  onMealQuantityUpDown(changeType: ChangeType) {
    let type;
    let message: string = "";
    // Check quantity
    if (changeType == ChangeType.INCREMENT) {
      if (this.mealOrder.quantity < this.mealOrder.meal.stock) {
        this.mealOrder.quantity += 1;
      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          type: "error",
          title: `Invalid quantity, only ${this.mealOrder.meal.stock} is available!`,
        });
      }
    } else {
      if (this.mealOrder.quantity <= 1) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          type: "error",
          title: "Invalid quantity",
        });
      } else {
        this.mealOrder.quantity -= 1;
      }
    }
  }

  onMealPreference() {
    // Check if user is authenticated
    if (this.authService.isAuthenticated()) {
      this.mealPreferencesSubscription = this.userService
        .toggleMealFromPreferrences(this.mealOrder.meal.id)
        .subscribe(
          (response) => {
            // Response message
            const Toast = Swal.mixin({
              toast: true,
              position: "top-right",
              showConfirmButton: false,
              timer: 3000,
            });

            Toast.fire({
              type: response.status ? "success" : "error",
              title: response.message,
            });
            // Set prefer button new state
            (this.btnPrefer
              .nativeElement as HTMLElement).innerHTML = response.preferred
              ? `<i class="fas fa-heart"></i>`
              : `<i class="far fa-heart"></i>`;
          },
          (error) => {
            const Toast = Swal.mixin({
              toast: true,
              position: "top-right",
              showConfirmButton: false,
              timer: 3000,
            });
            Toast.fire({
              type: "error",
              title: "An error occurred, please try again",
            });
          }
        );
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        type: "error",
        title: "Please login to add meal to your preferrences",
      });
    }
  }

  onAddMealOrder() {
    if (this.authService.isAuthenticated()) {
      // Set button on loading state
      const defaultButton = (this.addMealToCartBtn.nativeElement as HTMLElement)
        .innerHTML;
      (this.addMealToCartBtn.nativeElement as HTMLButtonElement).innerHTML = `
          <div class="spinner-border spinner-border-sm text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          Adding meal 
      `;
      (this.addMealToCartBtn
        .nativeElement as HTMLButtonElement).disabled = true;
      this.orderSubscription = this.mealOrderService
        .addMealOrder(this.mealOrder.meal.id, this.mealOrder.quantity)
        .subscribe(
          (data) => {
            // Chek if data contain an error message
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
            });

            Toast.fire({
              type: data.status ? "success" : "error",
              title: data.message,
            });
          },
          (err) => {
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
          },
          () => {
            // Reset button
            (this.addMealToCartBtn
              .nativeElement as HTMLButtonElement).innerHTML = defaultButton;
            // Reset button
            (this.addMealToCartBtn
              .nativeElement as HTMLButtonElement).disabled = false;
          }
        );
    } else {
      Swal.fire("Your are not connected", "Please login", "error");
    }
  }

  onToggleReviewForm() {
    if (this.transferedData.meal == null) {
      this.transferedData.meal = this.mealOrder.meal;
    } else {
      this.transferedData.meal = null;
    }
  }

  onMealFormEnd() {
    // End meal edition form
    this.transferedData = null;
  }

  // Request filled and unfilled stars for display purposes
  getRating(rating: number) {
    return {
      filledStars: Array(rating).fill("*"),
      unfilledStars: Array(5 - rating).fill("*"),
    };
  }
}
