import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from './../../shared/user.service';
import { AuthService } from './../../shared/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from './../../models/user.model';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, OnDestroy } from '@angular/core';
import { EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnDestroy {

  @Input() user: User;
  @Output() userUpdate: EventEmitter<User> = new EventEmitter<User>();
  editProfileSubscription: Subscription;
  form: FormGroup;
  @ViewChild('saveBtn') saveBtn: ElementRef;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ]),
      location: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(150)
      ])
    });
  }

  ngOnDestroy() {
    if( this.editProfileSubscription ) {
      this.editProfileSubscription.unsubscribe(); 
    }
  }

  checkNewEmail(control: FormControl) {
    return this.authService.checkEmailValidity(control.value);
  }

  onEditProfile() {
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
      (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving';
      (<HTMLButtonElement>this.saveBtn.nativeElement).setAttribute('disabled', 'true');
      this.editProfileSubscription = this.userService.saveUser(this.form.controls.username.value, this.form.controls.location.value, this.user.id).subscribe(
        (user) => {
          this.userUpdate.emit(user);
          this.user = null;
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'success',
            title: 'User data has been updated successfully'
          });
          (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML = '<i class="far fa-save"></i> Save';
          (<HTMLButtonElement>this.saveBtn.nativeElement).removeAttribute('disabled');
        },
        (err) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-left',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'error',
            title: 'An error occurred, please try again!'
          });
          (<HTMLButtonElement>this.saveBtn.nativeElement).innerHTML = '<i class="far fa-save"></i> Save';
          (<HTMLButtonElement>this.saveBtn.nativeElement).removeAttribute('disabled');
        }
      );
    }
  }
}
