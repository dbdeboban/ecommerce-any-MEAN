import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {Toast, ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  product = {
    name:'',
    price: 0,
    categoryId: '',
    description: '',
    product_picture: null
  };
  categories: any;

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

    try {
      const data = await this.rest.get('api/categories');
      data['success'] ?
        (this.categories = data['categories']) :
        this.toastr.error("Can't load categories");
    } catch (error){
      this.toastr.error('Can\'t connect to server. Please check your internet connection.')
    }
  }

  fileChange(event: any){
    this.product.product_picture = event.target.files[0];
  }

  async saveProduct(){
    this.isLoading = true;
    const form = new FormData();
    for(const key in this.product){
      if (this.product.hasOwnProperty(key)){
        if (key == 'product_picture'){
          if(this.product.product_picture)
            form.append('product_picture', this.product.product_picture, this.product.product_picture.name);
          else
            form.append('product_picture', null, null);
        }
        else{
          form.append(key, this.product[key]);
        }
      }
    }
    const data = await this.rest.post("api/seller/products", form);
    this.isLoading = false;
    data['success'] ?
      (this.toastr.success(data['message']), this.router.navigate(['/profile/myproducts'])) :
      this.toastr.error(data['message'], 'error');
  }
}
