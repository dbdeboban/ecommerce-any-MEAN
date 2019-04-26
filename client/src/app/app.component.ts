import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  searchTerm = '';
  isCollapsed = true;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private data: DataService
    ){
    this.data.getProfile();
    this.data.cartItems = this.data.getCart().length;
  }
  ngOnInit(){
    setTimeout(()=>{
      // this.toastr.success("Success message", "Success", {closeButton:true, progressBar:true});
      // this.toastr.error("Error message", "Error", {closeButton:true, progressBar:true});
      // this.toastr.info("Info message", "Info", {closeButton:true, progressBar:true});
      // this.toastr.warning("Warning message", "Warning", {closeButton:true, progressBar:true});
    });
  }
  get token() {
    return localStorage.getItem('token');
  }

  collapse() {
    this.isCollapsed = true;
  }

  closeDropdown(dropdown) {
    dropdown.close();
  }

  logout() {
    this.data.user = {};
    this.data.cartItems=0;
    localStorage.clear();
    this.router.navigate(['']);
  }

  search() {
    if (this.searchTerm){
      this.collapse();
      this.router.navigate(['search', {query: this.searchTerm}]);
    }
  }
}
