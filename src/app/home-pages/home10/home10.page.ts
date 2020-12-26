import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppEventsService } from 'src/providers/app-events/app-events.service';
import { LoadingService } from 'src/providers/loading/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home10',
  templateUrl: './home10.page.html',
  styleUrls: ['./home10.page.scss'],
})
export class Home10Page implements OnInit {
  segments = "sale"//first segment by default 
  //for product slider after banner
  sliderConfig = {
    slidesPerView: this.config.productSlidesPerPage,
    spaceBetween: 0
  }

  constructor(
    public nav: NavController,
    public config: ConfigService,
    public appEventsService: AppEventsService,
    public loading: LoadingService,
    public shared: SharedDataService,
    public router: Router,
  ) {
  }
  openCategoryPage() {
    this.nav.navigateForward(this.config.currentRoute + "/" + this.config.getCurrentCategoriesPage() + "/0/0");
  }
  openProducts(value) {
    this.nav.navigateForward(this.config.currentRoute + "/products/0/0/" + value);
  }
  ngOnInit() {
  }
  ionViewDidEnter() {
    this.shared.hideSplashScreen();
  }
  ionViewWillEnter() {
    if (!this.config.appInProduction) {
      this.config.productCardStyle = "22";
    }
  }
  doRefresh(event) {
    this.loading.show();
    this.shared.onStart();
    setTimeout(() => {
      this.loading.hide();
    }, 2000);
    event.target.complete();
  }
  openSubCategories(parent) {
    let count = 0;
    for (let value of this.shared.allCategories) {
      if (parent.id == value.parent_id) count++;
    }
    if (count != 0)
      this.router.navigateByUrl(this.config.currentRoute + "/categories/" + parent.id + "/" + parent.name);
    else
      this.router.navigateByUrl(this.config.currentRoute + "/products/" + parent.id + "/" + parent.name + "/newest");
  }

  getCategoriesWithParentId(parentId) {
    const cat = [];
    for (let value of this.shared.allCategories) {
      if (value.parent_id == parentId) { cat.push(value); }
    }
    return cat;
  }

  getCategories() {
    const category = [];
    for (let value of this.shared.allCategories) {
      if (value.categories_id === 44 || value.categories_id === 22 || value.categories_id === 21 || value.categories_id === 61) {
        category.push(value);
      }
    }
    return category;
  }
}
