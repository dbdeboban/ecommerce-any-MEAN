import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ToastrService} from "ngx-toastr";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private router: Router,
    private toastr: ToastrService
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
    return true;
  }
}
