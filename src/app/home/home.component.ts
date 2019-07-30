import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Meal } from './../models/meal.model';
import { MealService } from './../shared/meal.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as $ from 'jquery';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  meals: Array<Meal>;
  subscription: Subscription;
  orderSubscription: Subscription;
  errorMode = false;
  form;
  @ViewChild('saveMealnBtn', { static: false }) saveBtn: ElementRef;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;

  constructor(private mealService: MealService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(80)
      ]),
      image: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8000)
      ]),
      price: new FormControl('', [
        Validators.required,
        Validators.min(5),
        Validators.maxLength(10000)
      ]),
      stock: new FormControl('', [
        Validators.required,
        Validators.max(1000000),
        Validators.min(0)
      ])
    });

    this.subscription = this.mealService.getMeals().subscribe(
      data => {
        this.meals = data;
      },
      err => {
        this.errorMode = true;
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.errorMode = false;
    this.subscription.unsubscribe();
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

  setButtonState(mode: number) {
    if (mode == 1) {
      (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...';
      (<HTMLInputElement>this.saveBtn.nativeElement).attributes[
        'disabled'
      ] = true;
    } else {
      (<HTMLInputElement>this.saveBtn.nativeElement).innerHTML =
        '<i class="fas fa-save"></i> Save';
      (<HTMLInputElement>this.saveBtn.nativeElement).attributes[
        'disabled'
      ] = false;
      (<HTMLInputElement>this.closeBtn.nativeElement).click();
    }
  }

  async onSaveNewMeal() {
    if (this.form.valid) {
      // Set button for loading mode
      this.setButtonState(1);
      const meal = this.form.value;
      await this.mealService.saveMeal(meal).subscribe(
        (newMeal) => {
          this.meals = [newMeal, ...this.meals];
          // Set button for normal mode
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'success',
            title: 'Meal has been saved successflly'
          });
        },
        err => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'An error occurred!'
          });
        }
      );
      // Set button for normal mode
      this.setButtonState(0);
    } else {
      Swal.fire('Invalid data', 'Please fill correct data save', 'error');
    }
  }

  onAddMealOrder(meal: Meal) {
    this.orderSubscription = this.mealService.addMealOrders(meal, 1).subscribe(
      data => {
        // Chek if data contain an error message
        if (data['error']) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: data['message']
          });
        } else {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Your order has been added to your cart successflly'
          });
        }
      },
      err => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'bottom-left',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'An error occurred, please try again!'
        });
      }
    );
  }
}
