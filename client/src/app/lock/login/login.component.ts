import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {TokenPayload} from "../../shared/interfaces";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = null;
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  constructor(private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  submit() {
    if (!this.username.getRawValue() || !this.password.getRawValue()) return;

    const credentials: TokenPayload = {
      username: this.username.getRawValue() ?? '',
      password: this.password.getRawValue() ?? ''
    };

    this.auth.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/console', 'section']);
      },
      error: (err) => {
        this.error = err;
      }
    })
  }
}
