import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { AppEventsService } from 'src/providers/app-events/app-events.service';
import { LoadingService } from 'src/providers/loading/loading.service';

@Component({
  selector: 'app-home8',
  templateUrl: './home8.page.html',
  styleUrls: ['./home8.page.scss'],
})
export class Home8Page implements OnInit {
  sliderConfig = {
    slidesPerView: 2.5,
    spaceBetween: 0
  }
  constructor(
    public nav: NavController,
    public config: ConfigService,
    public appEventsService: AppEventsService,
    public loading: LoadingService,
    public shared: SharedDataService,
  ) { }
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
      this.config.productCardStyle = "18";
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
}
