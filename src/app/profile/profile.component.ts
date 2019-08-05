import { UserService } from './../shared/user.service';
import { Order } from './../models/order.model';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
  loadingUser = false;
  loadingOrders = false;
  loadingImage = '../../assets/img/loading.gif';
  imageSubscription: Subscription;
  @ViewChild('fileUpload', { static: false }) fileBtn: ElementRef;
  uploadingImage = false;
  uploadProgress = 0;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.user.image = this.loadingImage;
    this.loadingOrders = true;
    this.loadingUser = true;
    this.ordersSubscription = this.userService.getUserOrdersHistory().subscribe(
      data => {
        this.userOrders = data;
        this.loadingOrders = false;
      },
      err => {
        this.errorOrders = true;
      }
    );
    this.userSubscription = this.userService
      .getAuthenticatedUserDetails()
      .subscribe(
        data => {
          this.user = data;
          this.loadingUser = false;
        },
        err => {
          this.errorUser = true;
        }
      );
  }

  onFileUpload(event) {
    this.uploadProgress = 0;
    this.uploadingImage = true;
    const oldImage = this.user.image;
    this.user.image = this.loadingImage;
    let formData = new FormData();
    formData.append(
      'image',
      event.target.files[0],
      (<File>event.target.files[0]).name
    );
    this.imageSubscription = this.userService
      .updateUserImage(formData)
      .subscribe(
        response => {
          console.log(response);
          if (
            typeof response['status'] === 'string' ||
            response['status'] instanceof String
          ) {
            this.uploadProgress = response['message'];
          } else {
            // Hide uploading progress bar
            this.uploadingImage = false;
            this.uploadProgress = 0;
            // Update user is status true
            if (response['status'] == true && response['user']) {
              this.user = response['user'];
              // User message
              const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-left',
                showConfirmButton: false,
                timer: 3000
              });
              Toast.fire({
                type: response['status'] == true ? 'success' : 'error',
                title: response['message'].toString()
              });
            }
          }
        },
        err => {
          // Hide uploading progress bar
          this.uploadingImage = false;
          this.uploadProgress = 0;
          this.user.image = oldImage;
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'error',
            title: 'An error occurred, please try again'
          });
        }
      );
  }

  // Trigger button click event
  onTriggerImageSelect() {
    (<HTMLButtonElement>this.fileBtn.nativeElement).click();
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
    if (this.imageSubscription) {
      this.imageSubscription.unsubscribe();
    }
  }
}
