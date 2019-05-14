import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RegistrationComponent} from "./registration/registration.component";
import {LoginComponent} from "./login/login.component";
import {ProfileComponent} from "./profile/profile.component";
import {GuestGuard} from "./guards/guest.guard";
import {UserGuard} from "./guards/user.guard";
import {SettingsComponent} from "./settings/settings.component";
import {AddressComponent} from "./address/address.component";
import {CategoriesComponent} from "./categories/categories.component";
import {AddProductComponent} from "./add-product/add-product.component";
import {SellerGuard} from "./guards/seller.guard";
import {MyProductsComponent} from "./my-products/my-products.component";
import {CategoryComponent} from "./category/category.component";
import {ProductComponent} from "./product/product.component";
import {SearchComponent} from "./search/search.component";
import {CartComponent} from "./cart/cart.component";
import {OrdersComponent} from "./orders/orders.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  
  {
    path:'search',
    component: SearchComponent
  },
  {
    path:'cart',
    component: CartComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'categories/:id',
    component: CategoryComponent
  },
  {
    path: 'product/:id',
    component: ProductComponent
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    component:LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/settings',
    component: SettingsComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/address',
    component: AddressComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/orders',
    component: OrdersComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/addproduct',
    component: AddProductComponent,
    canActivate: [UserGuard]
  },
  {
    path: 'profile/myproducts',
    component: MyProductsComponent,
    canActivate: [UserGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
