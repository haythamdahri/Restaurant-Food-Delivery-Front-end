import { AuthService } from "./../shared/auth/auth.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
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
import { ActivatedRoute, Params } from '@angular/router';
import MealsPage from '../models/meals-page.model';

declare var $: any;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  mealsPage: MealsPage;
  mealsPageSubscription: Subscription;
  mealSubscription: Subscription;
  orderSubscription: Subscription;
  routeSubscription: Subscription;
  errorMode = false;
  form;
  @ViewChild("saveMealnBtn", { static: false }) saveBtn: ElementRef;
  @ViewChild("closeBtn", { static: false }) closeBtn: ElementRef;

  constructor(
    private mealService: MealService,
    private authService: AuthService,
    private mealOrderService: MealOrderService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Set page title
    this.titleService.setTitle("Home");
    this.form = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(80),
      ]),
      image: new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8000),
      ]),
      price: new FormControl("", [
        Validators.required,
        Validators.min(5),
        Validators.maxLength(10000),
      ]),
      stock: new FormControl("", [
        Validators.required,
        Validators.max(1000000),
        Validators.min(0),
      ]),
    });
    // Listen to route params
    this.routeSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        console.log('Page: ' +  params['page']);
        // Check page query param and Fetch meals using MealService
        if( params['page'] != null ) {
          this.fetchMeals(params['page']);
        } else {
          this.fetchMeals();
        }
      }
    );
  }

  fetchMeals(page = 0) {
    // Set init values
    this.errorMode = false;
    this.mealsPage = null;
    this.mealsPageSubscription = this.mealService.getMeals(page).subscribe(
      (data) => {
        this.mealsPage = data
        console.log(data);
      },
      (err) => {
        this.errorMode = true;
      }
    );
  }

  ngOnDestroy() {
    this.errorMode = false;
    if( this.mealsPageSubscription != null ) {
      this.mealsPageSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.mealSubscription) {
      this.mealSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.mealsPage = null;
  }

  setButtonState(mode: number) {
    if (mode == 1) {
      (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
      (<HTMLInputElement>this.saveBtn.nativeElement).attributes[
        "disabled"
      ] = true;
    } else {
      (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
        '<i class="fas fa-save"></i> Save';
      (<HTMLInputElement>this.saveBtn.nativeElement).attributes[
        "disabled"
      ] = false;
      $("#meal-form-modal").modal("hide");
      // Initialize form after saving
      this.initForm();
    }
  }

  async onSaveMeal() {
    if (this.form.valid) {
      // Set button for loading mode
      this.setButtonState(1);
      const meal = this.form.value;
      await this.mealService.saveMeal(meal).subscribe(
        (newMeal) => {
          // Refetch data
          this.fetchMeals();
          // Set button to normal mode
          this.setButtonState(0);
          // Success message
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            type: "success",
            title: "Meal has been saved successfully",
          });
        },
        (err) => {
          // Set button to normal mode
          this.setButtonState(0);
          // Error message
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            type: "success",
            title: "An error occurred!",
          });
        }
      );
    } else {
      Swal.fire("Invalid data", "Please fill correct data save", "error");
    }
  }

  onAddMealOrder(meal: Meal) {
    if (this.authService.isAuthenticated()) {
      this.orderSubscription = this.mealOrderService
        .addMealOrder(meal, 1)
        .subscribe(
          (data) => {
            // Chek if data contain an error message
            if (data["error"]) {
              const Toast = Swal.mixin({
                toast: true,
                position: "bottom-left",
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
                position: "bottom-left",
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
              position: "bottom-left",
              showConfirmButton: false,
              timer: 3000,
            });

            Toast.fire({
              type: "error",
              title: "An error occurred, please try again!",
            });
          }
        );
    } else {
      Swal.fire("Your are not connected", "Please login", "error");
    }
  }

  onMealFetch(id: number) {
    this.mealSubscription = this.mealService.getMeal(id).subscribe(
      (meal: Meal) => {
        this.form.setValue({
          id: meal.id,
          name: meal.name,
          image: meal.image,
          price: meal.price,
          stock: meal.stock,
        });
        $("#meal-form-modal").modal("show");
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
        });

        Toast.fire({
          type: "error",
          title: "An error occurred, please try again!",
        });
      }
    );
  }

  initForm() {
    this.form.reset();
  }
}
