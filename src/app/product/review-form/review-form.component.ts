import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Meal } from 'src/app/models/meal.model';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {

  @Input('transferedData') transferedData: {meal: Meal};
  @Output('onMealFormEnd') onMealFormEnd: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  
  constructor() { }

  ngOnInit() {
    // Init form controls
    this.form = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.minLength(25), Validators.maxLength(1500)]),
      rating: new FormControl('', [Validators.required])
    });
  }

}
