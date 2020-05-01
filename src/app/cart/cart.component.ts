import { MealService } from "./../shared/meal.service";
import { Subscription } from "rxjs";
import { CartService } from "./../shared/cart.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Order } from "../models/order.model";
import Swal from "sweetalert2";
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { MealOrderService } from "../shared/meal-order.service";


@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"],
})
export class CartComponent implements OnInit, OnDestroy {
  activeOrder: Order;
  errorMode = false;
  loadingMode = true;
  subscription: Subscription;
  mealSaveSubscription: Subscription;
  mealOrderSubscription: Subscription;
  mealForm: FormGroup;

  constructor(
    public cartService: CartService,
    public mealOrderService: MealOrderService,
    public titleService: Title,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Init indicators
    this.errorMode = false;
    // Set page title
    this.titleService.setTitle("Cart");
    // Init Form Array
    this.mealForm = this.formBuilder.group({
      mealOrders: this.formBuilder.array([]),
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
    this.mealForm = null;
  }

  fetchData() {
    // Set loading mode
    this.loadingMode = true;
    this.errorMode = false;
    this.subscription = this.cartService.getUserCartOrders().subscribe(
      (data) => {
        if (data["noActiveOrder"]) {
          this.activeOrder = new Order();
        } else {
          this.activeOrder = data["activeOrder"];
          // Init form
          this.mealForm = this.formBuilder.group({
            mealOrders: this.formBuilder.array([])
          });
          const control = this.mealForm.controls['mealOrders'] as FormArray;
          // Create form for each meal order
          this.activeOrder.mealOrders.map((mealOrder) => {
            control.push(this.formBuilder.group({
              quantity: new FormControl(mealOrder.quantity, [
                Validators.required,
                Validators.min(1),
                Validators.max(500),
              ]),
            }));
          });
        }
        // Set loading mode to false
        this.loadingMode = false;
      },
      (err) => {
        this.errorMode = true;
      },
      () => {
        // Set loading mode to false
        this.loadingMode = false;
      }
    );
  }

  onDeleteMealOrder(event: any, id: number) {
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
        // Button
        const btn = (event.target as HTMLButtonElement);
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = (
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting...'
        );
        btn.disabled = true
        // Delete method invokation
        this.cartService.deleteMealOrder(id).subscribe(
          (data) => {
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-left",
              showConfirmButton: false,
              timer: 3000,
            });
            Toast.fire({
              type: data.status == true ? 'success': 'error',
              title: data.message,
            });
            this.subscription.unsubscribe();
            this.errorMode = false;
            this.activeOrder = null;
            // Init Form Array
            this.mealForm = this.formBuilder.group({
              mealOrders: this.formBuilder.array([]),
            });
            // Fetch data
            this.fetchData();
            // Delete button original state
            btn.innerHTML = originalContent;
            btn.disabled = false;
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
            // Delete button original state
            btn.innerHTML = originalContent;
            btn.disabled = false;
          }
        );
      }
    });
  }

  async onUpdateMealOrderQuantity(event: any, mealOrderId: number, i) {
    const btn = (event.target as HTMLButtonElement);
    const newQuantity = Number(((this.mealForm.controls.mealOrders as FormArray).controls[i] as FormGroup).controls.quantity.value);
    if (((this.mealForm.controls.mealOrders as FormArray).controls[i] as FormGroup).controls.quantity.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      Toast.fire({
        type: "error",
        title: "Invalid quantity, please set a value between 1 and 500 unit",
      });
    } else {
      btn.innerHTML = (
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...'
      );
      btn.setAttribute("disabled", "true");
      // Perform mealOrder quantity update
      this.performMealOrderQuantityUpdate(btn, mealOrderId, newQuantity);
    }
  }

  performMealOrderQuantityUpdate(btn: HTMLButtonElement, mealOrderId: number, newQuantity: number) {
    console.log(newQuantity);
    console.log(mealOrderId);
    this.mealSaveSubscription = this.mealOrderService
      .updateQuantity(mealOrderId, newQuantity)
      .subscribe(
        (data) => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
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
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });

          Toast.fire({
            type: "error",
            title: "An error occurred",
          });
          // Update button state
          btn.innerHTML = (
            '<i class="fas fa-redo-alt"></i> Update'
          );
          btn.removeAttribute("disabled");
        },
        () => {
        }
      );
  }

}
