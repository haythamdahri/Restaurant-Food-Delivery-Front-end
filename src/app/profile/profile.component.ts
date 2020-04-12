import { UserService } from "./../shared/user.service";
import { Order } from "./../models/order.model";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { User } from "../models/user.model";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User = new User();
  editedUser: User = null;
  userOrders: Array<Order>;
  errorOrders = false;
  errorUser = false;
  ordersSubscription: Subscription;
  userSubscription: Subscription;
  loadingUser = false;
  loadingOrders = false;
  loadingImage = "../../assets/img/loading.gif";
  imageSubscription: Subscription;
  @ViewChild("fileUpload") fileBtn: ElementRef;
  @ViewChild("resetPasswordBtn")
  resetPasswordBtn: ElementRef;
  uploadingImage = false;
  uploadProgress = 0;
  ts: number;
  editedEmail;

  constructor(private userService: UserService, private titleService: Title) {}

  ngOnInit() {
    // Set page title
    this.titleService.setTitle("Profile");
    // Initialize fields
    this.editedEmail = null;
    this.editedUser = null;
    this.ts = Date.now();
    this.user.image.file = this.loadingImage;
    this.loadingOrders = true;
    this.loadingUser = true;
    this.ordersSubscription = this.userService.getUserOrdersHistory().subscribe(
      (data) => {
        this.userOrders = data;
        this.loadingOrders = false;
      },
      (err) => {
        this.errorOrders = true;
      }
    );
    this.userSubscription = this.userService
      .getAuthenticatedUserDetails()
      .subscribe(
        (data) => {
          this.user = data;
          // Update page title
          this.titleService.setTitle(this.user.username);
          this.loadingUser = false;
        },
        (err) => {
          this.errorUser = true;
        }
      );
  }

  onFileUpload(event) {
    this.uploadProgress = 0;
    this.uploadingImage = true;
    const oldImage = this.user.image;
    this.user.image.file = this.loadingImage;
    const formData = new FormData();
    formData.append("image", event.target.files[0], event.target.files[0].name);
    this.imageSubscription = this.userService
      .updateUserImage(formData)
      .subscribe(
        (response) => {
          if (
            typeof response["status"] === "string" ||
            response["status"] instanceof String
          ) {
            this.uploadProgress = response["message"];
          } else {
            // Update user is status true
            if (response["status"] == true && response["user"]) {
              this.user = response["user"];
              this.ts = Date.now();
              // User message
              const Toast = Swal.mixin({
                toast: true,
                position: "bottom-left",
                showConfirmButton: false,
                timer: 3000,
              });
              Toast.fire({
                type: response["status"] == true ? "success" : "error",
                title: response["message"].toString(),
              });
            }
          }
        },
        (err) => {
          // Hide uploading progress bar
          this.uploadingImage = false;
          this.uploadProgress = 0;
          this.user.image = oldImage;
          const Toast = Swal.mixin({
            toast: true,
            position: "bottom-left",
            showConfirmButton: false,
            timer: 3000,
          });
          Toast.fire({
            type: "error",
            title: "An error occurred, please try again",
          });
        },
        () => {
          // Hide uploading progress bar
          this.uploadingImage = false;
          this.uploadProgress = 0;
        }
      );
  }

  // Trigger button click event
  onTriggerImageSelect() {
    (<HTMLButtonElement>this.fileBtn.nativeElement).click();
  }

  ngOnDestroy() {
    if( this.userSubscription != null ) {
      this.userSubscription.unsubscribe();
    }
    if( this.ordersSubscription != null ) {
      this.ordersSubscription.unsubscribe();
    }
    this.user = null;
    this.userOrders = null;
    this.errorOrders = false;
    this.errorUser = false;
    this.loadingOrders = true;
    this.loadingUser = true;
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }

  // On start editing profile
  onProfileStartEdit() {
    this.editedUser = this.editedUser != null ? null : this.user;
    this.editedEmail = null;
  }

  // On start editing email
  onEmailStartEdit() {
    this.editedEmail = this.editedEmail != null ? null : this.user.email;
    this.editedUser = null;
  }

  // On reset password
  onResetPassword() {
    (<HTMLButtonElement>this.resetPasswordBtn.nativeElement).innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending';
    (<HTMLButtonElement>this.resetPasswordBtn.nativeElement).setAttribute(
      "disabled",
      "true"
    );
    this.userService.sendPasswordResetToken(this.user.email).subscribe(
      (data) => {
        Swal.fire(
          "Reset password",
          data.message,
          data.status ? "success" : "error"
        );
        (<HTMLButtonElement>this.resetPasswordBtn.nativeElement).innerHTML =
          '<i class="fas fa-key"></i> Reset Password';
        (<HTMLButtonElement>(
          this.resetPasswordBtn.nativeElement
        )).removeAttribute("disabled");
      },
      (err) => {
        const Toast = Swal.mixin({
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
        });
        Toast.fire({
          type: "error",
          title: "An error occurred, please try again",
        });
        (<HTMLButtonElement>this.resetPasswordBtn.nativeElement).innerHTML =
          '<i class="fas fa-key"></i> Send Password Reset Email';
        (<HTMLButtonElement>(
          this.resetPasswordBtn.nativeElement
        )).removeAttribute("disabled");
      }
    );
  }
}
