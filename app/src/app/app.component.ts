import { Component } from '@angular/core';
import {Router, ActivationEnd} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ActionLanguage} from './helpers/ui/actionLanguage';
import { Localization } from './helpers/Localization/localization';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  validCultureList: Array<string> = ['us','de'];
  actionLeft: ActionLanguage = new ActionLanguage();
  actionRight: ActionLanguage = new ActionLanguage();
  localization: Localization = new Localization();
  localCulture: {};

  constructor(private router: Router, private translate: TranslateService) {
     this.router.events.subscribe((val) => {
        if (val instanceof ActivationEnd) {
          this.resolveCulture(val.snapshot.params['$cult']);
        }
     });
  }

  /**
   * method used to navigate to welcome page
   * according the existing culture
   * @param targetCulture
   */
  navigateTo(targetCulture) {
    this.router.navigateByUrl(`${targetCulture}/welcome`);
  }

  /**
   * method to resolve the proper culture and its language
   * @param param
   */
  resolveCulture(param:string) {
    this.localization.culture = param;

    //Fallback browsers does not support localstorage
    if(window.localStorage !== undefined){
      if(window.localStorage.getItem('culture') !== null){
        this.localCulture = JSON.parse(window.localStorage.getItem('culture'));
      }
    }else{
        const cookie = document.cookie.split('; ').find(x => x.startsWith('culture='));
        if (cookie) {
          this.localCulture = JSON.parse(cookie.split('=')[1]);
        }
    }

    //Fallback for invalid cultures => send to default `us`
    const isValidCulture = this.validCultureList.find(c => c === this.localization.culture) !== undefined;

    if(!isValidCulture && this.localCulture == null){
      this.navigateTo('us');
    }
    else if(!isValidCulture && this.localCulture != null){
      this.localization = this.localCulture as Localization;
      this.navigateTo(this.localization.culture);
    }
    else {
      this.setCulture(this.localization.culture);
    }
  }


  /**
   * method to set the current culture
   * @param culture
   */
  setCulture(culture:string) {

    switch (culture) {
      case 'us':
        this.translate.setDefaultLang(this.localization.language || 'en');
        this.actionLeft.text = 'English';
        this.actionLeft.action = 'en';
        this.actionRight.text = 'Spanish';
        this.actionRight.action = 'es';
        break;
      case 'de':
        this.translate.setDefaultLang(this.localization.language || 'de');
        this.actionLeft.text = 'German';
        this.actionLeft.action = 'de';
        this.actionRight.text = 'English';
        this.actionRight.action = 'en';
        break;
      default:
        this.translate.setDefaultLang('en');
    }

    this.setLocalizationStorage();
  }


  /**
   *method to set into storage culture and language
   *when the browser does not support localstorage
   *we put the data in the cookies
   */
  setLocalizationStorage(){
    if(window.localStorage !== undefined){
      window.localStorage.setItem('culture', JSON.stringify(this.localization));
    }else{
        document.cookie = `culture=${JSON.stringify(this.localization)}`;
    }
  }


   /**
   * method to change the current language
   * @param language
   */
  useLanguage(language: string) {
    this.translate.use(language);
    this.localization.language = language;
    this.setLocalizationStorage();
  }
}
