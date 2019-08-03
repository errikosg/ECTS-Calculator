import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  url = "http://localhost:3000"
  currUserSubject$: BehaviorSubject<User>
  currUser$: Observable<User>

  constructor(private httpClient: HttpClient) {
    this.currUserSubject$ = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currUser$ = this.currUserSubject$.asObservable();
  }

  public get currUserValue(): User{
    return this.currUserSubject$.value;
  }

  authenticate(email: string, password: string):Observable<User> {
    return this.httpClient.post<User>(this.url + "/login", {email,password})
    .pipe(map(user => {
      // login successful if there's an id token in the response
      if (user && user.id !== undefined) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currUserSubject$.next(user);
      }
      return user;
    }));
  }

  //like authentication, just check!
  checkUser(email: string):Observable<User> {
    return this.httpClient.post<User>(this.url + "/signup", {email})
    .pipe(map(user => {
      return user;
    }));
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currUserSubject$.next(null);
  }
}
