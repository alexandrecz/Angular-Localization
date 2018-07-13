import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
          }
      })
      ],
      providers: [
        TranslateService
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as validCultureList '[].length > 0'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.validCultureList).length > 0;
  }));

  it(`should set only a valid culture('US'& 'DE')`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const expectedCulture = '';
    if(window.localStorage !== undefined){
      if(window.localStorage.getItem('culture') !== null){
        return JSON.parse(window.localStorage.getItem('culture'));
      }
    }else{
        const cookie = document.cookie.split('; ').find(x => x.startsWith('culture='));
        if (cookie) {
          return JSON.parse(cookie.split('=')[1]);
        }
    }

    app.resolveCulture('us');
    expect(expectedCulture).toEqual('us');

    app.resolveCulture('de');
    expect(expectedCulture).toEqual('de');

    app.resolveCulture('pt');
    expect(expectedCulture).toEqual('us');

    app.resolveCulture('');
    expect(expectedCulture).toEqual('us');

  }));

});
