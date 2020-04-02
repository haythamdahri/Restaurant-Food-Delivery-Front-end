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
  userImageChangedSubscription: Subscription;
  loadingUser: boolean = true;
  errorUser: boolean = false;
  loadingImage = "../../assets/img/loading.gif";
  defaultUserImage = "../../assets/img/default.png";
  updates: number;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    // Fetch user
    this.retrieveCurrentUserData();
    // Listen to image change events
    this.userImageChangedSubscription = this.userService.userImageChangedEvent.subscribe(
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
    // Unsubscribe from user
    if( this.userSubscription != null ) {
      this.userSubscription.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
