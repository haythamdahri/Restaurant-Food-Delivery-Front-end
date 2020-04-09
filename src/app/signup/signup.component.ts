import { Router } from '@angular/router';
import { AuthService } from './../shared/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../shared/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  signUpSubscription: Subscription;
  signUpError = false;
  registered = false;
  @ViewChild('signupBtn', {static: false}) signUpBtn: ElementRef;

  constructor(
    private titleService: Title,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Sign up - Create new account');
    this.form = new FormGroup({
      email: new FormControl(
        '',
        [Validators.email, Validators.required],
        [this.checkNewEmail.bind(this)]
      ),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]),
      password: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.required
      ]),
      passwordConfirm: new FormControl('', [
        Validators.minLength(4),
        Validators.maxLength(150),
        Validators.required,
        this.passwordConfirmValidator.bind(this)
      ])
    });
  }

  ngOnDestroy() {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
    this.signUpError = false;
    this.registered = false;
  }

  passwordConfirmValidator(control: FormControl): { [s: string]: boolean } {
    let confirmedPassword = control.value;
    if (
      this.form &&
      this.form.controls.password.touched &&
      confirmedPassword != this.form.controls.password.value
    ) {
      return { passwordConfirmIsForbidden: true };
    }
    // null for valid value
    return null;
  }

  checkNewEmail(control: FormControl) {
    return this.authService.checkEmailValidity(control.value);
  }

  // Sign up
  onSingUp() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        title: 'Invalid sign up data'
      });
    } else {
      console.log(this.form.value.password);
      (<HTMLButtonElement>this.signUpBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sign Up';
      (<HTMLButtonElement>this.signUpBtn.nativeElement).setAttribute('disabled', 'true');
      this.userService
        .register(
          this.form.value
        )
        .subscribe(
          user => {
            console.log(user);
            // User success message
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-left',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: 'success',
              title: 'Your account has been created successfully'
            });
            this.signUpError = false;
            this.registered = true;
            (<HTMLButtonElement>this.signUpBtn.nativeElement).innerHTML =
              '<i class="far fa-save"></i> Sign Up';
            (<HTMLButtonElement>this.signUpBtn.nativeElement).setAttribute('disabled', 'false');
          },
          err => {
            this.signUpError = true;
            this.registered = false;
            (<HTMLButtonElement>this.signUpBtn.nativeElement).innerHTML =
              '<i class="far fa-save"></i> Sign Up';
            (<HTMLButtonElement>this.signUpBtn.nativeElement).setAttribute('disabled', 'false');
          }
        );
    }
  }
}
