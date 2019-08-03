import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DisplayCourse } from '../model/displayCourse';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseUrl = 'http://localhost:3000/courses';
  getObCourses$: Subject<DisplayCourse[]>;
  getGenCourses$: Subject<DisplayCourse[]>;
  getLabCourses$: Subject<DisplayCourse[]>;
  getElCourses$: Subject<DisplayCourse[]>;
  getBcCourses$: Subject<DisplayCourse[]>;
  getOthCourses$: Subject<DisplayCourse[]>;
  getUsCourses$: Subject<DisplayCourse[]>;
  private user_id: number;

  constructor(
      private httpClient: HttpClient,
      private authService: AuthenticationService
    ) {
    this.getObCourses$ = new Subject();
    this.getGenCourses$ = new Subject();
    this.getLabCourses$ = new Subject();
    this.getElCourses$ = new Subject();
    this.getBcCourses$ = new Subject();
    this.getOthCourses$ = new Subject();
    this.getUsCourses$ = new Subject();
  }

  getObligatory(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/obligatory/"+this.user_id).subscribe(val => {
      this.getObCourses$.next(val)
    })
    return this.getObCourses$;
  }

  getGeneral(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/general/"+this.user_id).subscribe(val => {
      this.getGenCourses$.next(val)
    })
    return this.getGenCourses$;
  }

  getLabs(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/labs/"+this.user_id).subscribe(val => {
      this.getLabCourses$.next(val)
    })
    return this.getLabCourses$;
  }

  getElective(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/elective/"+this.user_id).subscribe(val => {
      this.getElCourses$.next(val)
    })
    return this.getElCourses$;
  }

  getBychoice(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/bychoice/"+this.user_id).subscribe(val => {
      this.getBcCourses$.next(val)
    })
    return this.getBcCourses$;
  }

  getOther(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/other/"+this.user_id).subscribe(val => {
      this.getOthCourses$.next(val)
    })
    return this.getOthCourses$;
  }

  getUserCourses(): Observable<DisplayCourse[]>{
    this.user_id = this.authService.currUserValue.id
    this.httpClient.get<DisplayCourse[]>(this.courseUrl+"/user_courses/"+this.user_id).subscribe(val => {
      this.getUsCourses$.next(val)
    })
    return this.getUsCourses$;
  }
}
