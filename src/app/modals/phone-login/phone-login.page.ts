import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/providers/config/config.service';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { LoadingService } from 'src/providers/loading/loading.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { FirebasePhoneAuthService } from 'src/providers/firebase-phone-auth/firebase-phone-auth.service';
import { AppEventsService } from 'src/providers/app-events/app-events.service';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.page.html',
  styleUrls: ['./phone-login.page.scss'],
})
export class PhoneLoginPage implements OnInit {

  formData = {
    phone_number: '',
  };
  errorMessage = '';
  constructor(
    public config: ConfigService,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private navCtrl: NavController,
    public loading: LoadingService,
    public shared: SharedDataService,
    public appEventsService: AppEventsService,
    public firebasePhoneAuthService: FirebasePhoneAuthService
  ) {
    this.shared.currentOpenedModel = this;
    const loginWithPhoneNumber = this.appEventsService.subscribe("loginWithPhoneNumber");
    loginWithPhoneNumber.subscriptions.add(loginWithPhoneNumber.event.subscribe(data => {
      if (this.shared.orderDetails.guest_status == 0) {
        this.dismiss();
      }
    }));
  }
  login() {
    // if (this.config.phoneAuthWithFirebase)
    //   this.firebasePhoneAuthService.verifyPhoneNumber(this.formData.customers_telephone);
    this.loading.show();
    this.config.postHttp('sendotp', this.formData).then((response) => {
      this.loading.hide();
      this.enterThePhoneCodeReceived(this.formData.phone_number).then((data: any) => {
        if (data != null) {
          const requestBody = {
            phone_number : this.formData.phone_number,
            otp : data,
          };
          this.config.postHttp('verifyotp', requestBody).then((validateOTP: any) => {
            if (validateOTP.Success === 'True' && validateOTP.Message !== 'OTP Mismatch') {
              this.loginAfterCodeVerify(validateOTP);
            } else {
              this.shared.showAlert(data + ' ' + 'Invalid Code Please try again.');
            }
          }).catch(
            (error) => {
              this.shared.showAlert(data + ' ' + 'Invalid Code Please try again.');
              console.log(error);
            });
        }
      });
    }).catch(
      (error) => {
        this.loading.hide();
        console.log(error);
        this.shared.showAlert(error.message + ' ' + this.formData.phone_number);
      });
  }
  loginAfterCodeVerify(response) {
    const cusomerData = {
      id: response.UserId,
      phone: this.formData.phone_number,
    };
    this.shared.login(cusomerData);
    this.openHomePage();
  }

  openHomePage() {
    if (this.config.appNavigationTabs) {
      if (this.config.homePage == 1) { this.navCtrl.navigateForward('/tabs/home'); }
      if (this.config.homePage == 2) { this.navCtrl.navigateForward('/tabs/home2'); }
      if (this.config.homePage == 3) { this.navCtrl.navigateForward('/tabs/home3'); }
      if (this.config.homePage == 4) { this.navCtrl.navigateForward('/tabs/home4'); }
      if (this.config.homePage == 5) { this.navCtrl.navigateForward('/tabs/home5'); }
      if (this.config.homePage == 6) { this.navCtrl.navigateForward('/tabs/home6'); }
      if (this.config.homePage == 7) { this.navCtrl.navigateForward('/tabs/home7'); }
      if (this.config.homePage == 8) { this.navCtrl.navigateForward('/tabs/home8'); }
      if (this.config.homePage == 9) { this.navCtrl.navigateForward('/tabs/home9'); }
      if (this.config.homePage == 10) { this.navCtrl.navigateForward('/tabs/home10'); }
    } else {
      if (this.config.homePage == 1) { this.navCtrl.navigateRoot('/home'); }
      if (this.config.homePage == 2) { this.navCtrl.navigateRoot('/home2'); }
      if (this.config.homePage == 3) { this.navCtrl.navigateRoot('/home3'); }
      if (this.config.homePage == 4) { this.navCtrl.navigateRoot('/home4'); }
      if (this.config.homePage == 5) { this.navCtrl.navigateRoot('/home5'); }
      if (this.config.homePage == 6) { this.navCtrl.navigateRoot('/home6'); }
      if (this.config.homePage == 7) { this.navCtrl.navigateRoot('/home7'); }
      if (this.config.homePage == 8) { this.navCtrl.navigateRoot('/home8'); }
      if (this.config.homePage == 9) { this.navCtrl.navigateRoot('/home9'); }
      if (this.config.homePage == 10) { this.navCtrl.navigateRoot('/home10'); }
    }
  }

  async enterThePhoneCodeReceived(phoneNumber) {
    return new Promise(resolve => {
      this.shared.translateArray(['Enter Sms Code You Received on', 'Code', 'Cancel', 'ok']).then(async (res: any) => {
        const alert = await this.alertController.create({
          header: res['Enter Sms Code You Received on'] + ' ' + phoneNumber,
          inputs: [
            {
              name: 'code',
              type: 'text',
              placeholder: res.Code,
            }
          ],
          buttons: [
            {
              text: res.Cancel,
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                resolve(null);
                console.log('Confirm Cancel');
              }
            }, {
              text: res.ok,
              handler: (data) => {
                console.log(data);
                if (data.code === '') {
                  this.enterThePhoneCodeReceived(phoneNumber).then(data => {
                    resolve(data);
                  });
                } else {
                  resolve(data.code);
                }
              }
            }
          ]
        });

        await alert.present();
      });

    });

  }
  ngAfterViewInit() {
    if (this.config.phoneAuthWithFirebase)
      this.firebasePhoneAuthService.createRecaptcha();
  }
  async dismiss() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
  }

}
