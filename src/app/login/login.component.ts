import { AuthService } from './../shared/auth/auth.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UserToken } from '../models/user-token.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginSubscription: Subscription;
  loginError = false;
  @ViewChild('loginBtn', { static: false }) loginBtn: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [
        Validators.minLength(2),
        Validators.maxLength(150),
        Validators.required
      ])
    });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
    this.loginError = false;
  }

  onLogin() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid login data'
      });
    } else {
      (<HTMLElement>this.loginBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Login';
      (<HTMLElement>this.loginBtn.nativeElement).attributes['disabled'] = true;
      this.authService
        .login(
          this.form.controls.email.value,
          this.form.controls.password.value
        )
        .subscribe(
          userToken => {
            // User success message
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'success',
              title: 'You are logged in successfully'
            });
            this.router.navigate(['/']);
          },
          err => {
            this.loginError = true;
            (<HTMLInputElement>this.loginBtn.nativeElement).innerHTML =
              '<i class="fas fa-sign-in-alt"></i> Login';
            (<HTMLInputElement>this.loginBtn.nativeElement).attributes[
              'disabled'
            ] = false;
          }
        );
    }
  }
}
