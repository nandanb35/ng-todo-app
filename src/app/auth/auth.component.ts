import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  login = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  async onSubmit() {
    console.log(this.form.value);
    const { email, password } = this.form.value;

    if (this.login) {
      this.authService.loginUser(email, password).subscribe({
        next: (res: any) => {
          this.toastr.success('', 'Login sucess');
          console.log(res.headers);
        },
        error: (err) => {
          this.toastr.error('', 'Unable to Login');
        },
      });
    } else {
      this.authService.registerUser(email, password).subscribe({
        next: (res: any) => {
          this.toastr.success('', 'Registration sucess');
        },
        error: (err) => {
          this.toastr.error('', 'Unable to Register');
        },
      });

      this.toggleMode();
    }
  }

  toggleMode() {
    this.login = !this.login;
  }

  ngOnDestroy(): void {}
}
