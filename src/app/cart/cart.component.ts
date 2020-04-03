import { MealService } from "./../shared/meal.service";
import { Subscription } from "rxjs";
import { CartService } from "./../shared/cart.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Order } from "../models/order.model";
import Swal from "sweetalert2";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { MealOrder } from "../models/meal-order.model";
import { Title } from "@angular/platform-browser";
import { MealOrderService } from "../shared/meal-order.service";

declare var $: any;

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  activeOrder: Order;
  errorMode = false;
  subscription: Subscription;
  mealSaveSubscription: Subscription;
  mealOrderSubscription: Subscription;
  form;

  constructor(
    private cartService: CartService,
    private mealService: MealService,
    private mealOrderService: MealOrderService,
    private titleService: Title
  ) {}

  ngOnInit() {
    // Init indicators
    this.errorMode = false;
    // Set page title
    this.titleService.setTitle("Cart");
    this.form = new FormGroup({
      quantity: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(500),
      ]),
    });
    // fetch Data
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.errorMode = false;
    this.activeOrder = null;
    if (this.mealSaveSubscription != null) {
      this.mealSaveSubscription.unsubscribe();
    }
    if (this.mealOrderSubscription != null) {
      this.mealOrderSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.subscription = this.cartService.getUserCartOrders().subscribe(
      (data) => {
        if (data["noActiveOrder"]) {
          this.activeOrder = new Order();
        } else {
          this.activeOrder = data["activeOrder"];
        }
      },
      (err) => {
        console.log(err);
        this.errorMode = true;
      }
    );
  }

  onDeleteMealOrder(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete the meal from your cart",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: '<i class="far fa-check-circle"></i> Yes, delete it!',
      cancelButtonText: '<i class="far fa-times-circle"></i> No, cancel',
    }).then((result) => {
      if (result.value) {
        // Delete method invokation
        this.cartService.deleteMealOrder(id).subscribe(
          (data) => {
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-left",
              showConfirmButton: false,
              timer: 3000,
            });
            if( data.status == true ) {
              Toast.fire({
                type: "success",
                title: data.message,
              });
            } else {
              Toast.fire({
                type: "error",
                title: data.message,
              });
            }
            this.subscription.unsubscribe();
            this.errorMode = false;
            this.activeOrder = null;
            // Fetch data
            this.fetchData();
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
              title: "An error occurred",
            });
          }
        );
      }
    });
  }

  onQuantityChange(event) {
    const quantity = Number(event.target.value);
    event.target.value = parseInt(event.target.value);
    if (quantity <= 0 || quantity > 1500) {
      $(event.target).addClass("is-invalid");
      $(event.target).removeClass("is-valid");
    } else {
      $(event.target).addClass("is-valid");
      $(event.target).removeClass("is-invalid");
    }
  }

  async onUpdateMealOrderQuantity(mealOrderId: number) {
    const newQuantity = Number($("#quantity" + mealOrderId).val());
    if (newQuantity <= 0 || newQuantity > 1500) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000,
      });

      Toast.fire({
        type: "error",
        title: "Invalid quantity, please set a value between 1 and 1500 unit",
      });
    } else {
      $("#updateBtn" + mealOrderId).html(
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
      );
      $("#updateBtn").attr("disabled", true);
      // Perform mealOrder quantity update
      this.performMealOrderQuantityUpdate(mealOrderId, newQuantity);
    }
  }

  performMealOrderQuantityUpdate(mealOrderId: number, newQuantity: number) {
    this.mealSaveSubscription = this.mealOrderService
      .updateQuantity(mealOrderId, newQuantity)
      .subscribe(
        (data) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            type: data.status == true ? 'success' : 'error',
            title: data.message,
          });
          // Init data
          this.fetchData();
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
            title: "An error occurred",
          });
        }
      );
  }
}
