import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements
 OnInit {

  dish: Dish;
  leadership: Leader;
  dishErrMess: string
  promotions: Promotion;

  constructor(private dishService: DishService,
    private leaderService: LeaderService,
    private promotionService: PromotionService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish()
      .subscribe(dish => this.dish = dish,
        errMess => this.dishErrMess = <any>errMess);
    this.promotionService.getFeaturedPromotion()
    .subscribe(promotion => this.promotions = promotion);
    this.leaderService.getFeaturedLeader()
    .subscribe(leader => this.leadership = leader);
  }

}
