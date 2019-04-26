import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RestApiService} from "../services/rest-api.service";
import {DataService} from "../services/data.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";

  constructor(
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
  }

  async login(){
    const data = await this.rest.post('api/accounts/login',
      {
        email: this.email,
        password: this.password
      });
    if(data['success']){
      localStorage.setItem('token', data['token']);
      this.toastr.success(data['message'], "Success");
      await this.data.getProfile();
      this.router.navigate(['/']);
    }
    else{
      this.toastr.error(data['message'], "Error");
    }
  }
}
