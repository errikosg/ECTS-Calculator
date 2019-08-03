import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { TotalService } from 'src/app/services/total.service';
import { Grade } from 'src/app/model/grade';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title='ECTS Calculator';
  private ob_grade: Grade;
  private gen_grade: Grade;
  private el_grade: Grade;
  private lab_grade: Grade;
  private other_grade: Grade;
  private bc_grade: Grade;
  total_grade: number = 0;
  total_ects: number=0;
  total_courses: number=0;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private totalService: TotalService
  ) {
      this.ob_grade = new Grade();
      this.gen_grade = new Grade();
      this.bc_grade = new Grade();
      this.el_grade = new Grade();
      this.lab_grade = new Grade();
      this.other_grade = new Grade();

      this.totalService.ob_grades$.subscribe(data => {
        this.ob_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
      this.totalService.gen_grades$.subscribe(data => {
        this.gen_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
      this.totalService.el_grades$.subscribe(data => {
        this.el_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
      this.totalService.lab_grades$.subscribe(data => {
        this.lab_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
      this.totalService.bc_grades$.subscribe(data => {
        this.bc_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
      this.totalService.other_grades$.subscribe(data => {
        this.other_grade = data;
        this.calculateTotal();
        this.calculateEcts();
        this.calculateCourseCount();
      })
    }

  ngOnInit() {
  }

  calculateTotal(){
    this.total_grade = (this.ob_grade.grade+this.gen_grade.grade+this.el_grade.grade+this.lab_grade.grade+this.bc_grade.grade+this.other_grade.grade) / (this.ob_grade.ects+this.gen_grade.ects+this.el_grade.ects+this.lab_grade.ects+this.bc_grade.ects+this.other_grade.ects)
  }

  calculateEcts(){
    this.total_ects = this.ob_grade.ects+this.gen_grade.ects+this.lab_grade.ects+this.bc_grade.ects+this.el_grade.ects+this.other_grade.ects;
  }

  calculateCourseCount(){
    this.total_courses = this.ob_grade.course_count+this.gen_grade.course_count+this.lab_grade.course_count+this.bc_grade.course_count+this.el_grade.course_count+this.other_grade.course_count;
  }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public scroll(id: string){
    var elem = document.getElementById(id);
    elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
}
