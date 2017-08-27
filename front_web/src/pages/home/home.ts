import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { WeatherServiceProvider } from '../../providers/weather-service/weather-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [WeatherServiceProvider]
})
export class HomePage {
  public weatherOslo: any;
  public weatherHere: any;

  constructor(
    public navCtrl: NavController,
    private geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public WeatherService: WeatherServiceProvider) {
      let loading = this.loadingCtrl.create({content: 'Loading...'})
      loading.present();

      this.loadWeather('59.9139','10.7522')
      .then((data) => {
        this.weatherOslo = data;
        if(!this.weatherOslo.currently.image) {
          this.showToast(`Uops, seems I couldn't find a decent enough image!`)
        }
        loading.dismiss();
      })
    }

    showWeatherHere() {
      this.geolocation.getCurrentPosition()
      .then((resp) => {
        this.loadWeather(resp.coords.latitude,resp.coords.longitude)
        .then((data) => {
          this.weatherHere = data;
          let confirm = this.alertCtrl.create({
            title: 'Do you trust me, now?',
            message: `Ok so, right now it seems that the weather is ${this.weatherHere.currently.summary} but the next days there will be ${this.weatherHere.daily.summary}`,
            buttons: [{text: 'Nope.'},{text: 'Cool!'}]
          });
          confirm.present();
        })
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    }

    showToast(message) {
      let toast = this.toastCtrl.create({
        "message": message,
        position: 'bottom',
        showCloseButton: true,
        closeButtonText: 'Ok'
      });
      toast.present();
    }

    loadWeather(latitude, longitude){
      return new Promise((resolve, reject) => {
        this.WeatherService.loadWeather(latitude, longitude)
        .then(data => {
          console.log(data);
          resolve(data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
      });
    }
  }
