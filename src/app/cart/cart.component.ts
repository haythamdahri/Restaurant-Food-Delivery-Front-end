import { Subscription } from 'rxjs';
import { CartService } from './../shared/cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order } from '../models/order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  activeOrder: Order;
  errorMode = false;
  subscription: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.subscription = this.cartService.getUserCartOrders().subscribe(
      data => {
        if (data['noActiveOrder']) {
          this.activeOrder = new Order();
        } else {
          this.activeOrder = data['activeOrder'];
        }
      },
      err => {
        console.log(err);
        this.errorMode = true;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.errorMode = false;
    this.activeOrder = null;
  }

  onDeleteMealOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete the meal from your cart",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '<i class="far fa-check-circle"></i> Yes, delete it!',
      cancelButtonText: '<i class="far fa-times-circle"></i> No, cancel'
    }).then(result => {
      if (result.value) {
        // Delete method invokation
        this.cartService.deleteMealOrder(id).subscribe(
          data => {
            console.log(data);
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Meal has been deleted from your cart successflly'
            });
            this.subscription.unsubscribe();
            this.errorMode = false;
            this.activeOrder = null;
            this.ngOnInit();
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
              title: 'An error occurred'
            });
          }
        );
      }
    });
  }
}
