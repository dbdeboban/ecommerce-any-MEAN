import { Injectable } from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {RestApiService} from "./rest-api.service";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class DataService{
  user: any;
  message = '';
  messageType = 'danger';
  cartItems = 0;

  constructor(
    private rest: RestApiService,
    private toastr: ToastrService
  ) {

  }

  async getProfile(){
    try {
      if (localStorage.getItem('token')){
        const data = await this.rest.get('api/accounts/profile');
        this.user = data['user'];
      }
    } catch(error){
      this.toastr.error(error, "Error");
    }
  }

  getCart(){
    const cart = localStorage.getItem('cart');
    return cart? JSON.parse(cart) : [];
  }

  addToCart(item: string) {
    const cart:any = this.getCart();
    if(cart.find(data => JSON.stringify(data) === JSON.stringify(item))){
      return false;
    } else {
      cart.push(item);
      this.cartItems++;
      localStorage.setItem('cart', JSON.stringify(cart));
      return true;
    }
  }
  clearCart() {
    this.cartItems = 0;
    localStorage.setItem('cart','[]');
  }

  removeFromCart(item: string) {
    let cart: any = this.getCart();
    if(cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      cart = cart.filter(data => JSON.stringify(data) !== JSON.stringify(item));
      this.cartItems--;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
}
