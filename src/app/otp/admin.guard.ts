import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from "@angular/core";
import {Remult} from "remult";
import {Roles} from "../models/roles";


@Injectable()
export class AdminGuard implements CanActivate {


  constructor(private router: Router,
              private remult: Remult
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.remult.isAllowed(Roles.admin)) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }


}
