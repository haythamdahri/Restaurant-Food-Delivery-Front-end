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
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  loginSubscription: Subscription;
  loginError = false;
  @ViewChild('loginBtn') loginBtn: ElementRef;

  constructor(private authService: AuthService, private router: Router, private titleService: Title) {}

  ngOnInit() {
    // Set page title
    this.titleService.setTitle('Login');
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
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid login data'
      });
    } else {
      (<HTMLButtonElement>this.loginBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Login';
      (<HTMLButtonElement>this.loginBtn.nativeElement).setAttribute('disabled', 'true');
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
              position: 'top-end',
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
            (<HTMLButtonElement>this.loginBtn.nativeElement).innerHTML =
              '<i class="fas fa-sign-in-alt"></i> Login';
            (<HTMLButtonElement>this.loginBtn.nativeElement).setAttribute('disabled', 'true');
          }
        );
    }
  }
}
