import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categoryId: any;
  category: any;
  page = 1;


  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService,
    private activatedRoute : ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res.id;
      this.getProducts();
    });
  }

  get lower(){
    return 10 * (this.page -1) + 1;
  }

  get upper(){
    return Math.min(10 * this.page, this.category.totalProducts);
  }

  async getProducts(event ?: any){
    if(event){
      this.category = null;
    }
    console.log(this.categoryId);
    try {
      const data = await this.rest.get(`api/categories/${this.categoryId}?page=${this.page - 1}`);
      data['success'] ?
        this.category = data
        : this.toastr.error(data['message'], 'Error');
    }
    catch (error){
      this.toastr.error(error, 'Error');
    }
  }

}
