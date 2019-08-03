import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private submitted = false;
  private loading = false;
  private invalid = false;
  title='ECTS Calculator';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth_service: AuthenticationService
  ) {
      if (this.auth_service.currUserValue) {      //current user set, redirect to main page
        this.router.navigate(['/']);
      }
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(){
    this.submitted = true;
    if(this.loginForm.invalid)
      return

    this.loading = true;
    this.auth_service.authenticate(this.loginForm.controls.email.value, this.loginForm.controls.password.value).pipe(first()).subscribe(
      data => {
        if(JSON.stringify(data).length > 2){    //given json
          this.invalid = false;
          this.router.navigate(['/']);
        }
        else{
          this.loading = false;
          this.invalid = true;
        }
      },
      error => {
        this.loading = false;
        this.invalid = true;
      }
    )
  }
}
