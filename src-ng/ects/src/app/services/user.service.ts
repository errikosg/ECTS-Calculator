import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = 'http://localhost:3000/users';
  getUsers$: Subject<User[]>;

  constructor(private httpClient: HttpClient) {
    this.getUsers$ = new Subject();
  }

  //get all users!
  getUsers(): Observable<User[]>{
    this.httpClient.get<User[]>(this.userUrl).subscribe(val => {
      this.getUsers$.next(val);
    })
    return this.getUsers$;
  }

  //get a specific user
  getUser(id: number): Observable<User>{
    return this.httpClient.get<User>(this.userUrl + "/" + id);
  }

  //create a new user
  createUser(user: User):Observable<User>{
    return this.httpClient.post<User>(this.userUrl, user).pipe(
      tap(val => this.getUsers())
    );
  }

  //update a user
  updateUser(user: User): Observable<User>{
    return this.httpClient.put<User>(this.userUrl + "/" + user.id, user).pipe(
      tap(val => this.getUsers())
    );
  }

  //delete user
  deleteUser(user: User): Observable<User>{
    return this.httpClient.delete<User>(this.userUrl + "/" + user.id).pipe(
      tap(val => this.getUsers())
    );
  }
}
