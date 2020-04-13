import { AuthService } from "./../shared/auth/auth.service";
import { Meal } from "./../models/meal.model";
import { MealService } from "./../shared/meal.service";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Title } from "@angular/platform-browser";
import { MealOrderService } from "../shared/meal-order.service";
import { Page } from "../pagination/page";
import { CustomPaginationService } from "../pagination/services/custom-pagination.service";
import { UserService } from "../shared/user.service";

declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  mealsPageSubscription: Subscription;
  preferredMealsSubscription: Subscription;
  mealSubscription: Subscription;
  mealPreferencesSubscription: Subscription;
  orderSubscription: Subscription;
  errorMode = false;
  loadingMode: boolean = true;
  @ViewChild("saveMealnBtn") saveBtn: ElementRef;
  @ViewChild("closeBtn") closeBtn: ElementRef;

  page: Page<Meal> = new Page();
  preferredMeals: Array<Meal> = null;

  constructor(
    private mealService: MealService,
    private authService: AuthService,
    private userService: UserService,
    private mealOrderService: MealOrderService,
    private titleService: Title,
    private paginationService: CustomPaginationService
  ) {}

  ngOnInit() {
    // Set page title
    this.titleService.setTitle("Home");
    this.getData();
  }

  getData() {
    // Set init values
    this.errorMode = false;
    this.loadingMode = true;
    this.page.content = [];
    this.mealsPageSubscription = this.mealService
      .getMealsPage(this.page.pageable)
      .subscribe(
        (page) => {
          // Set final data
          this.page = page;
          // Check if user is authenticated to check its preferences
          if( this.authService.isAuthenticated() ) {
            // Retrieve user preferred meals
            this.preferredMealsSubscription = this.userService
              .getUserPreferredMeals()
              .subscribe(
                (meals) => {
                  this.preferredMeals = meals;
                },
                () => {}
              );
          }
        },
        (err) => {
          this.errorMode = true;
        },
        () => {
          this.loadingMode = false;
        }
      );
  }

  checkMealPreferred(id) {
    return this.preferredMeals?.filter((m) => m.id === id).length > 0;
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

  ngOnDestroy() {
    this.errorMode = false;
    if (this.mealsPageSubscription != null) {
      this.mealsPageSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.mealSubscription) {
      this.mealSubscription.unsubscribe();
    }
    if( this.preferredMealsSubscription != null ) {
      this.preferredMealsSubscription.unsubscribe();
    }
    if( this.mealPreferencesSubscription != null ) {
      this.mealPreferencesSubscription.unsubscribe();
    }
    this.page = null;
  }

  onAddMealOrder(id: number, event) {
    if (this.authService.isAuthenticated()) {
      const originalContent = event.target.innerHTML;
      event.target.innerHTML = `
          <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div> 
          Adding meal
      `;
      event.target.disabled = true;
      this.orderSubscription = this.mealOrderService
        .addMealOrder(id, 1)
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
            // Set button to original state
            event.target.innerHTML = originalContent;
            event.target.disabled = false;
          }
        );
    } else {
      Swal.fire("Your are not connected", "Please login", "error");
    }
  }

  onMealPreference(event, id) {
    // Check if user is authenticated
    if( this.authService.isAuthenticated() ) {
    this.mealPreferencesSubscription = this.userService
      .toggleMealFromPreferrences(id)
      .subscribe(
        (response) => {
          // Response message
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          Toast.fire({
            type: response.status ? "success" : "error",
            title: response.message,
          });
          // Set prefer button new state
          document.getElementById(
            "btnPreffer" + id
          ).innerHTML = response.preferred
            ? `<i class="fas fa-heart"></i>`
            : `<i class="far fa-heart"></i>`;
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
            title: "An error occurred, please try again",
          });
        }
      );
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        type: "error",
        title: "Please login to add meal to your preferrences",
      });
    }
  }
}
