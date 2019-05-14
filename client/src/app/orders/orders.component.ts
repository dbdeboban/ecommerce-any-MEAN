import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';
import { DataService } from '../services/data.service';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders:any =[];
  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    const data = await this.rest.get("api/accounts/orders");
    this.orders = data['orders'];
    console.log(data);
  }

}
