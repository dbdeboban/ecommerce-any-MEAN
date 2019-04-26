import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    try{
      const data = await this.rest.get('api/products');
      data['success'] ?
        (this.products = data['products'])
        : this.toastr.error('Can\'t load products');
    }
    catch (error){
      this.toastr.error(error, 'Error');
    }
  }

}
