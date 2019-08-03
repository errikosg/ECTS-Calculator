import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private signupForm: FormGroup;
  private submitted = false;
  private loading = false;
  private pass_notmatched = false;
  private exists = false;
  title='ECTS Calculator';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private auth_service: AuthenticationService,
    private user_service: UserService,
    private snackBar: MatSnackBar
  ) {
      if (this.auth_service.currUserValue) {      //current user set, redirect to main page
        this.router.navigate(['/']);
      }
    }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  submit(){
    this.submitted = true;
    if(this.signupForm.invalid)
      return

    //check if passwords are matching
    if(this.signupForm.controls.password.value !== this.signupForm.controls.password2.value){
      this.pass_notmatched = true;
      return
    }
    this.pass_notmatched = false;

    //check is email exists
    this.loading = true;
    this.auth_service.checkUser(this.signupForm.controls.email.value).pipe(first()).subscribe(
      data => {
        if(JSON.stringify(data).length > 2){    //given json
          this.exists = true;
          this.loading = false;
        }
        else{
          this.exists = false;
          this.loading = false;

          //console.log(this.createUser())
          this.user_service.createUser(this.createUser()).subscribe(result => {
            this.openSnackBar();
            this.router.navigate(['/login']);
          });
        }
      }
    )
  }

  openSnackBar() {
    this.snackBar.open('Signed up successsfully!', 'OK', {
      duration: 3000
    });
  }

  private createUser(): User{
   var user = {
      id:0,
      email: this.signupForm.controls.email.value,
      password: this.signupForm.controls.password.value,
      ects: 0,
      mo: 0,
      course_count: 0
    };
    return user;
  }
}
