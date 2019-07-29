import { Meal } from './../models/meal.model';
import { MealService } from './../shared/meal.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

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
        this.meals = data['_embedded']['meals'];
        console.log(data['_embedded']['meals']);
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
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }
}
