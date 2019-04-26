import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  products: any;
  isLoading = false;
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.data.user)
      await this.data.getProfile();
    if (!this.data.user.isSeller){
      this.toastr.warning('You can\'t access that page');
      this.router.navigate(['/']);
    }
    this.isLoading = true;
    const data = await this.rest.get('api/seller/products');

    data['success'] ?
      (this.products = data['products']) :
      this.toastr.error("Can't load products");
    this.isLoading = false;
  }

}
