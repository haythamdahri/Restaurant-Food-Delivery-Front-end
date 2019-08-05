import { UserService } from "./../shared/user.service";
import { CartService } from "./../shared/cart.service";
import { Order } from "./../models/order.model";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User = new User();
  userOrders: Array<Order>;
  errorOrders = false;
  errorUser = false;
  ordersSubscription: Subscription;
  userSubscription: Subscription;
  USERS_IMAGE_PREFIX = UserService.USERS_IMAGE_PREFIX;
  loadingUser = false;
  loadingOrders = false;
  loadingImage = "../../assets/img/loading.gif";

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadingOrders = true;
    this.loadingUser = true;
    this.user.image = this.loadingImage;
    this.ordersSubscription = this.userService.getUserOrdersHistory().subscribe(
      data => {         
        this.userOrders = data;
        this.loadingOrders = false;
      },
      err => {
        console.log(err);
        this.errorOrders = true;
      }
    );
    this.userSubscription = this.userService.getAuthenticatedUserDetails().subscribe(
      (data) => {
        this.user = data;
        this.loadingUser = false;
        console.log(!this.loadingUser && !this.errorUser)
      },
      (err) => {
        this.errorUser = true;
      }
    );
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.ordersSubscription.unsubscribe();
    this.user = null;
    this.userOrders = null;
    this.errorOrders = false;
    this.errorUser = false;
    this.loadingOrders = true;
    this.loadingUser = true;
  }

}
