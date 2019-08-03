import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private gradeUrl = 'http://localhost:3000/grades';

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService
    ) { }

  updateGrade(course_id: number, grade: number): Observable<any>{
    var user_id = this.authService.currUserValue.id
    return this.httpClient.put<any>(this.gradeUrl+"/"+user_id, {user_id,course_id,grade});
  }
}
