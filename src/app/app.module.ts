import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './shared/auth/request.interceptor';
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
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { EditEmailComponent } from './profile/edit-email/edit-email.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { LeftSidebarComponent } from './home/left-sidebar/left-sidebar.component';
import { CustomPaginationComponent } from './pagination/components/custom-pagination/custom-pagination.component';
import { ProductComponent } from './product/product.component';
import { ReviewsComponent } from './product/reviews/reviews.component';

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
    PasswordResetComponent,
    ProfileComponent,
    EditProfileComponent,
    EditEmailComponent,
    MainComponent,
    HeaderComponent,
    LeftSidebarComponent,
    CustomPaginationComponent,
    ProductComponent,
    ReviewsComponent
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
