import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { MealService } from "../shared/meal.service";
import { Meal } from "../models/meal.model";
import { MealOrder } from "../models/meal-order.model";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AuthService } from "../shared/auth/auth.service";
import { UserService } from "../shared/user.service";
import { MealOrderService } from "../shared/meal-order.service";

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
  @ViewChild("addMealToCartBtn", { static: false })
  addMealToCartBtn: ElementRef;
  @ViewChild("btnPrefer", { static: false }) btnPrefer: ElementRef;
  @ViewChild("quantity", { static: false }) quantity: ElementRef;

  USERS_IMAGE_PREFIX = 'http://localhost:8080/uploads/users/images';

  constructor(
    private route: ActivatedRoute,
    private mealService: MealService,
    private authService: AuthService,
    private userService: UserService,
    private mealOrderService: MealOrderService
  ) {}

  ngOnInit() {
    // Set meal loading image
    this.mealOrder.meal = new Meal();
    this.mealOrder.meal.image = "../../assets/img/loading.gif";
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
            console.log(response);
          },
          (error) => {
            this.errorMessage = "No product has been";
            this.isError = true;
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

  onAddMealOrder(meal: Meal) {
    if (this.authService.isAuthenticated()) {
      // Set button on loading state
      const defaultButton = (this.addMealToCartBtn.nativeElement as HTMLElement)
        .innerHTML;
      (this.addMealToCartBtn.nativeElement as HTMLElement).innerHTML = `
        Adding meal 
          <div class="spinner-border spinner-border-sm text-success" role="status">
            <span class="sr-only">Loading...</span>
          </div>
      `;
      this.orderSubscription = this.mealOrderService
        .addMealOrder(this.mealOrder.meal, this.mealOrder.quantity)
        .subscribe(
          (data) => {
            // Chek if data contain an error message
            if (data["error"]) {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
              });

              Toast.fire({
                type: "error",
                title: data["message"],
              });
            } else {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
              });

              Toast.fire({
                type: "success",
                title: "Your order has been added to your cart successfully",
              });
            }
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
              .nativeElement as HTMLElement).innerHTML = defaultButton;
          }
        );
    } else {
      Swal.fire("Your are not connected", "Please login", "error");
    }
  }

  // Request filled and unfilled stars for display purposes
  getRating(rating: number) {
    return {
      filledStars: Array(rating).fill("*"),
      unfilledStars: Array(5 - rating).fill("*"),
    };
  }
}
