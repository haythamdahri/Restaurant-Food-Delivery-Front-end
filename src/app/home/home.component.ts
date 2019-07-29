import { Meal } from './../models/meal.model';
import { MealService } from './../shared/meal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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

  constructor(private mealsService: MealService) {}

  ngOnInit() {
    this.subscription = this.mealsService.getMeals().subscribe(
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

  onAddMealOrder(meal: Meal) {
    this.orderSubscription = this.mealsService.addMealOrders(meal, 1).subscribe(
      data => {
        // Chek if data contain an error message
        if( data['error'] ) {
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
