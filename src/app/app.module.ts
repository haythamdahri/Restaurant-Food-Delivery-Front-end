import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RequestInterceptor } from "./shared/auth/request.interceptor";
import { CustomModule } from './custom/custom.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ContactUsComponent,
    NotFoundComponent,
    CartComponent,
    LoginComponent,
    SignupComponent,
    AccountActivationComponent,
    PasswordResetComponent
  ],
  imports: [BrowserModule, AppRoutingModule, CustomModule, LayoutModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
