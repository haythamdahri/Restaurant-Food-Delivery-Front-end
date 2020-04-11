import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { MealService } from 'src/app/shared/meal.service';
import { Meal } from 'src/app/models/meal.model';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit, OnDestroy {

  private mealsSubscription: Subscription;
  popularMeals: Array<Meal>;
  isError: boolean = false;
  isLoading: boolean = true;
  message: string = "";
  @Output('addMealToCartEvent') addMealToCartEvent : EventEmitter<Meal> = new EventEmitter<Meal>();

  constructor(private mealService: MealService, private authService: AuthService) { }

  ngOnInit() {
    // Fetch data using service
    this.mealsSubscription = this.mealService.getPopularMeals().subscribe(
      (meals) => {
        this.isError = false;
        this.popularMeals = meals;
      },
      (error) => {
        this.isError = true;
        this.message = error.message;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    // Destroy subscription for memory weakness reasons
    if( this.mealsSubscription != null ) {
      this.mealsSubscription.unsubscribe();
    }
  }

  onAddMealOrder(id) {
    // Emit data on event emitter
    this.addMealToCartEvent.emit(id);
  }

}
