import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {RestApiService} from "../services/rest-api.service";
import {ToastrService} from "ngx-toastr";
import {NgSpinKitModule} from 'ng-spin-kit';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  currentSettings: any;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private toastr: ToastrService
  ) { }

  async ngOnInit() {
    try {
      if (!this.data.user){
        this.data.getProfile();
      }
      this.currentSettings = Object.assign({
        newPwd: '',
        pwdConfirm: ''
      }, this.data.user);
    }
    catch(error){
      this.toastr.error(error, 'Error');
    }
  }

  async update(){

    if(this.currentSettings['name'] == this.data.user.name && !this.currentSettings['newPwd']){
      this.toastr.warning("Nothing to save.", "Warning");
      return;
    }

    if (this.currentSettings['newPwd'] !== this.currentSettings['pwdConfirm']){
      this.toastr.error('New password and Confirm password didn\'t matched.', 'Error');
      return;
    }

    try{
      const data = await this.rest.post('api/accounts/profile', {
        name: this.currentSettings['name'],
        newPassword: this.currentSettings['newPwd'],
      });
      data['success'] ?
        (this.data.getProfile(), this.toastr.success(data['message'], 'Success'))
        : this.toastr.error(data['message'], "Error");
    }
    catch (error){
      this.toastr.error(error, "Error");
    }
  }
}
