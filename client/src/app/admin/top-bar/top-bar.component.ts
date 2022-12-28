import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {UserDetails} from "../../shared/interfaces";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  user: UserDetails | null = null;
  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.auth.getUserDetails();
  }

  logout() {
    this.auth.logout();
  }
}
