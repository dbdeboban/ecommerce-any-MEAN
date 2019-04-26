import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastr: ToastrService
  ){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('token')){
      this.router.navigate(['/']);
      this.toastr.warning("You can't access that link.", "Unauthorized")
      return false;
    }
    return true;
  }
}
