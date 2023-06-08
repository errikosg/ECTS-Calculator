import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { DisplayCourse } from '../model/displayCourse';

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private gradeUrl = 'http://localhost:3000/grades';
  courseGrade$ = new Subject<DisplayCourse>();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService
    ) { }

  updateGrade(course_id: number, course:DisplayCourse): Observable<any>{
    let user_id = this.authService.currUserValue.id
    let grade = course.grade
    return this.httpClient.put<any>(this.gradeUrl+"/"+user_id, {user_id, course_id, grade});
  }
}
