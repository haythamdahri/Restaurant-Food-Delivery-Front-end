import { UserService } from "./../../shared/user.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "./../../shared/auth/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-email",
  templateUrl: "./edit-email.component.html",
  styleUrls: ["./edit-email.component.css"]
})
export class EditEmailComponent implements OnInit {
  @Input() email: string = null;
  @Output() emailUpdate: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  @ViewChild("saveBtn") saveBtn: ElementRef;
  updateEmailSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(
        this.email,
        [Validators.email, Validators.required],
        [this.checkNewEmail.bind(this)]
      )
    });
  }

  checkNewEmail(control: FormControl) {
    return this.authService.checkEmailValidity(control.value);
  }

  onEditEmail() {
    if (this.form.invalid) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 3000
      });
      Toast.fire({
        type: "error",
        title: "Invalid sign up data"
      });
    } else {
      if (
        this.authService.getAuthenticatedUser().email ===
        this.form.controls.email.value
      ) {
        this.email = null;
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          type: "success",
          title: "Email has not been changed"
        });
        // Emit update email event
        this.emailUpdate.emit(true);
      } else {
        // Prompt user for email change before proceed
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want really to change your email, your session will be lost until confirming your new email",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText:
            '<i class="far fa-check-circle"></i> Yes, change it and logout!',
          cancelButtonText: '<i class="far fa-times-circle"></i> No, cancel'
        }).then(result => {
          if (result.value) {
            this.processEmailupdate();
          }
        });
      }
    }
  }

  processEmailupdate() {
    (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving';
    (<HTMLButtonElement>this.saveBtn.nativeElement).setAttribute(
      "disabled",
      "true"
    );
    this.updateEmailSubscription = this.userService
      .updateUserEmail(this.form.controls.email.value)
      .subscribe(
        data => {
          if (data.status) {
            Swal.fire("Email sent", data.message, "success");
            this.email = null;
            this.authService.logout();
            this.router.navigateByUrl("/login");
          } else {
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-left",
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              type: "error",
              title: "An error occurred, please try again"
            });
          }
          (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML =
            '<i class="far fa-save"></i> Save';
          (<HTMLButtonElement>this.saveBtn.nativeElement).removeAttribute(
            "disabled"
          );
        },
        err => {
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: "error",
            title: "An error occurred, please try again"
          });
          (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML =
            '<i class="far fa-save"></i> Save';
          (<HTMLButtonElement>this.saveBtn.nativeElement).removeAttribute(
            "disabled"
          );
        },
        () => {
          // Emit update email event
          this.emailUpdate.emit(true);
        }
      );
  }
}
