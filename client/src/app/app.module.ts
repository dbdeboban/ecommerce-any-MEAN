import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {NgSpinKitModule} from 'ng-spin-kit';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RestApiService } from './services/rest-api.service';
import { DataService } from './services/data.service';
import { MessageComponent } from './message/message.component';
import { RegistrationComponent } from './registration/registration.component';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { GuestGuard } from './guards/guest.guard';
import { UserGuard } from './guards/user.guard';
import { SettingsComponent } from './settings/settings.component';
import { SellerGuard } from './guards/seller.guard';
import {LaddaModule} from "angular2-ladda";
import { AddressComponent } from './address/address.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddProductComponent } from './add-product/add-product.component';
import { MyProductsComponent } from './my-products/my-products.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { SearchComponent } from './search/search.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessageComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    SettingsComponent,
    AddressComponent,
    CategoriesComponent,
    AddProductComponent,
    MyProductsComponent,
    CategoryComponent,
    ProductComponent,
    SearchComponent,
    CartComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    NgSpinKitModule,
    LaddaModule,
    NgbModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      maxOpened: 5,
      newestOnTop: false
    })
  ],
  providers: [RestApiService, DataService, GuestGuard, UserGuard, SellerGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
