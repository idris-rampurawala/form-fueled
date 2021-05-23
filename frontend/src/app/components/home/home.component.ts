import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

import { UserService } from 'src/app/services/user.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  user: User = null;
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
    // getting user resolver data for loading component
    if (this.activatedRoute.snapshot.data.userDetails) {
      this.userService.setUserDetails(this.activatedRoute.snapshot.data.userDetails);
      this.user = this.userService.userDetails;
    } else {
      // route to error page
    }

  }

  logout(): void {
    this.submitted = true;
    this.authenticationService.logout();
  }

}
