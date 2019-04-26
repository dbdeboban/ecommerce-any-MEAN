import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";
import {NgSpinKitModule} from 'ng-spin-kit';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  currentAddress: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    const data = this.rest.get("api/accounts/address");
    // if (JSON.stringify(data['address'] === '{}')){
    //   this.toastr.warning("Currently you don't have any shipping address",'');
    // }
    this.currentAddress = data['address'];

    if (!this.currentAddress){
      this.currentAddress = {
        addressLine1 : '',
        addressLine2 : ''
      }

    }
  }

  async updateAddress(){
    try{
      const res = this.rest.post('api/accounts/address', this.currentAddress);

      res['success'] ?
        (this.toastr.success(res['message']), await this.data.getProfile())
        : this.toastr.error(res['message']);
    }
    catch(error) {
      this.toastr.error(error);
    }
  }
}
