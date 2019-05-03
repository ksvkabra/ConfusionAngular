import { Component, OnInit, Input, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish'
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { state, style, animate, trigger, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 0
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  errMess: string;
  prev: string;
  next: string;
  comment: Comment;
  commentForm: FormGroup;
  dishcopy: Dish;
  visibility = 'shown';

  formErrors = {
    'author' : '',
    'rating' : '',
    'comment' : ''
  };

  validationMessages = {
    'author' : {
      'required' : 'Name is required',
      'minlength' : 'Name must be at least 2 characters long',
      'maxlength' : 'Name cannot be more that 25 characters long'
    },
    'comment': {
      'required': 'Comment is required',
    }
  };


  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    @Inject('BaseURL') private BaseURL) {
    this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.
    pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(dish => {this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility=' shown'; },
      errMess => this.errMess = <any>errMess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index-1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index+1)%this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [ Validators.required, Validators.minLength(2), Validators.maxLength(25) ] ],
      rating: 5,
      comment: ['', [ Validators.required ] ],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
    this.comment = form.value;
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; }
      ) 
    console.log(this.comment);
    this.comment = null;
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5
    });
  }
}

