import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ToastrService} from "ngx-toastr";
import {DataService} from "../services/data.service";

@Injectable()
export class SellerGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private data: DataService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!localStorage.getItem('token')){
      this.toastr.warning("You can't access that link.", "Unauthorized");
      this.router.navigate(['/']);
      return false;
    }

    if (!this.data.user)
      this.data.getProfile();

    if(!this.data.user.isSeller){
      this.toastr.warning("You can't access that link.", "Unauthorized");
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
