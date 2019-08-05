import { User } from "./../../models/user.model";
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, AfterViewInit {

  user: User;
  @ViewChild('modalBtn', {static: false}) modalBtn: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    (<HTMLButtonElement>this.modalBtn.nativeElement).click();
  }

}
