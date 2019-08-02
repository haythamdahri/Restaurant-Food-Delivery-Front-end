import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./shared/auth/auth-guard.service";
import { CartComponent } from "./cart/cart.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { HomeComponent } from "./home/home.component";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'cart', component: CartComponent, canActivate: [AuthGuard]
  },
  {
    path: 'contact-us', component: ContactUsComponent
  },
  {
    path: 'login', component: LoginComponent
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
