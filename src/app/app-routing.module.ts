import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthenticatedGuard } from "./shared/auth/authenticated-guard.service";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { AccountActivationComponent } from "./account-activation/account-activation.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./shared/auth/auth-guard.service";
import { CartComponent } from "./cart/cart.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { MainComponent } from "./main/main.component";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'products/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent, canActivate: [AuthGuard]
  },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'contact-us', component: ContactUsComponent
  },
  {
    path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'signup', component: SignupComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'activate-account/:token', component: AccountActivationComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'reset-password', component: PasswordResetComponent, canActivate: [AuthenticatedGuard]
  },
  {
    path: 'reset-password/:token', component: PasswordResetComponent
  },
  {
    path: '404', component: NotFoundComponent
  },
  {
    path: '**', redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
