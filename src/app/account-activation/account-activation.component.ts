import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit, OnDestroy {
  loading = true;
  activationDone = false;
  activationFail = false;
  error = false;
  message = '';
  routeSubscription: Subscription;
  activationSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(
      params => {
        const token = params['token'];
        this.activationSubscription = this.userService
          .activateAccount(token)
          .subscribe(
            data => {
              this.error = false;
              this.loading = false;
              this.message = data.message;
              if (data.status == false) {
                this.activationFail = true;
                this.activationDone = false;
              } else {
                this.activationFail = false;
                this.activationDone = true;
              }
            },
            err => {
              this.error = true;
              this.loading = false;
              this.activationFail = false;
              this.activationDone = false;
            }
          );
      },
      err => {
        this.error = true;
      }
    );
  }

  ngOnDestroy() {
    this.loading = true;
    this.activationDone = false;
    this.activationFail = false;
    this.error = false;
    this.routeSubscription.unsubscribe();
    if (this.activationSubscription) {
      this.activationSubscription.unsubscribe();
    }
    this.message = '';
  }
}
