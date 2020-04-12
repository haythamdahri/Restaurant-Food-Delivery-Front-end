import { AuthService } from "./../shared/auth/auth.service";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  user: User;
  userSubscription: Subscription;
  userUpdateSubscription: Subscription;
  userAuthSubscription: Subscription;
  loadingUser: boolean = true;
  errorUser: boolean = false;
  loadingImage = "../../assets/img/loading.gif";
  defaultUserImage = "../../assets/img/default.png";
  updates: number;

  constructor(public authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    // Fetch user if authenticated
    if( this.authService.isAuthenticated() ) {
      this.retrieveCurrentUserData();
    }
    // Listen to user update events
    this.userUpdateSubscription = this.userService.userUpdateEvent.subscribe(
      () => {
        this.retrieveCurrentUserData();
        // Change updates value to refresh image
        this.updates = Date.now();
      }
    )
    // Listen to user auth events
    this.userAuthSubscription = this.authService.userAuthEvent.subscribe(
      () => {
        this.retrieveCurrentUserData();
        // Change updates value to refresh image
        this.updates = Date.now();
      }
    )
  }

  retrieveCurrentUserData() {
    this.userSubscription = this.userService
    .getAuthenticatedUserDetails()
    .subscribe(
      data => {
        this.user = data;
        // Update page title
        this.loadingUser = false;
      },
      err => {
        this.errorUser = true;
      }
    );
  }

  ngOnDestroy() {
    // Unsubscribe from subscribed events
    if( this.userSubscription != null ) {
      this.userSubscription.unsubscribe();
    }
    if( this.userAuthSubscription != null ) {
      this.userAuthSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
