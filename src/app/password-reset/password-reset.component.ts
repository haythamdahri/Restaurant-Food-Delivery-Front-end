import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import Swal from "sweetalert2";
import { UserService } from "./../shared/user.service";
import { AuthService } from "./../shared/auth/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs";

export enum PageMode {
  RESET,
  SEND_TOKEN
}

@Component({
  selector: "app-password-reset",
  templateUrl: "./password-reset.component.html",
  styleUrls: ["./password-reset.component.css"]
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sendTokenSUbscription: Subscription;
  @ViewChild("passwordResetBtn")
  passwordResetBtn: ElementRef;
  passwordResetError = false;
  passwordResetSuccess = false;
  message = "";
  routeSubscription: Subscription;
  tokenCheckSubscription: Subscription;
  pageMode = PageMode.SEND_TOKEN;
  resetMode = PageMode.RESET;
  sendTokenMode = PageMode.SEND_TOKEN;
  invalidToken = false;
  token = "";
  loading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private titleService: Title,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.titleService.setTitle("Password reset");
    this.routeSubscription = this.route.params.subscribe(params => {
      this.token = params.token;
      if (this.token) {
        this.pageMode = PageMode.RESET;
        this.form = new FormGroup({
          password: new FormControl("", [
            Validators.minLength(4),
            Validators.maxLength(150),
            Validators.required
          ]),
          passwordConfirm: new FormControl("", [
            Validators.minLength(4),
            Validators.maxLength(150),
            Validators.required,
            this.passwordConfirmValidator.bind(this)
          ])
        });
        this.tokenCheckSubscription = this.userService
          .checkPasswordResetToken(this.token)
          .subscribe(
            data => {
              this.loading = false;
              if (!data.status) {
                this.invalidToken = true;
                this.message = data.message;
              }
            },
            err => {
              this.loading = false;
              this.invalidToken = true;
              this.passwordResetError = true;
              this.message = 'An error occurred, please try again!'
            }
          );
      } else {
        this.loading = false;
        this.pageMode = PageMode.SEND_TOKEN;
        this.form = new FormGroup({
          email: new FormControl(
            "",
            [Validators.required],
            [this.checkEmail.bind(this)]
          )
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.sendTokenSUbscription) {
      this.sendTokenSUbscription.unsubscribe();
    }
    this.passwordResetBtn = null;
    this.passwordResetError = false;
    this.passwordResetSuccess = false;
    this.message = "";
    this.routeSubscription.unsubscribe();
    this.pageMode = PageMode.SEND_TOKEN;
    this.token = "";
    this.loading = true;
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

  checkEmail(control: FormControl) {
    return this.authService.checkEmailExisting(control.value);
  }

  onSendPasswordToken() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: "error",
        title: "Invalid Email"
      });
    } else {
      (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending ...';
      (<HTMLButtonElement>this.passwordResetBtn.nativeElement).setAttribute(
        "disabled",
        "true"
      );
      this.sendTokenSUbscription = this.userService
        .sendPasswordResetToken(this.form.controls.email.value)
        .subscribe(
          data => {
            (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
              '<i class="fas fa-share-square"></i> Reset';
            (<HTMLButtonElement>(
              this.passwordResetBtn.nativeElement
            )).setAttribute("disabled", "true");
            this.message = data.message;
            if (data.status) {
              this.passwordResetSuccess = true;
              this.passwordResetError = false;
            } else {
              this.passwordResetSuccess = false;
              this.passwordResetError = true;
            }
          },
          err => {
            this.message = "An error occurred, please try again";
            (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
              '<i class="fas fa-share-square"></i> Reset';
            (<HTMLButtonElement>(
              this.passwordResetBtn.nativeElement
            )).setAttribute("disabled", "true");
            // set error mode
            this.passwordResetError = true;
          }
        );
    }
  }

  onResetPassword() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: "error",
        title: "Invalid Password"
      });
    } else {
      (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Setting new password ...';
      (<HTMLButtonElement>this.passwordResetBtn.nativeElement).setAttribute(
        "disabled",
        "true"
      );
      this.sendTokenSUbscription = this.userService
        .resetPassword(this.token, this.form.controls.password.value)
        .subscribe(
          data => {
            (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
              '<i class="fas fa-share-square"></i> Reset';
            (<HTMLButtonElement>(
              this.passwordResetBtn.nativeElement
            )).setAttribute("disabled", "true");
            this.message = data.message;
            if (data.status) {
              this.passwordResetSuccess = true;
              this.passwordResetError = false;
            } else {
              this.passwordResetSuccess = false;
              this.passwordResetError = true;
            }
          },
          err => {
            this.message = "An error occurred, please try again";
            (<HTMLButtonElement>this.passwordResetBtn.nativeElement).innerHTML =
              '<i class="fas fa-share-square"></i> Reset';
            (<HTMLButtonElement>(
              this.passwordResetBtn.nativeElement
            )).setAttribute("disabled", "true");
          }
        );
    }
  }
}
