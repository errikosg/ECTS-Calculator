import { Component, OnInit } from '@angular/core';
import { DisplayCourse } from 'src/app/model/displayCourse';
import { CourseService } from 'src/app/services/course.service';
import { GradeService } from 'src/app/services/grade.service';
import { TotalService } from 'src/app/services/total.service';
import { Grade } from 'src/app/model/grade';

@Component({
  selector: 'app-obligatory',
  templateUrl: './obligatory.component.html',
  styleUrls: ['./obligatory.component.css']
})
export class ObligatoryComponent implements OnInit {

  display_courses: DisplayCourse[];
  private total_one=0;
  private total_two=0;
  total_grade: Grade;

  constructor(
    private courseService: CourseService,
    private gradeService: GradeService,
    private totalService: TotalService
  ) {
    this.total_grade = new Grade();
  }

  ngOnInit() {
    this.getObligatory();
  }

  getObligatory(){
    this.courseService.getObligatory().subscribe(data =>{
      this.display_courses = data;
      this.sendTotal();
    })
  }

  sendTotal(){
    this.total_one=0; this.total_two=0;
    this.total_grade.course_count=0;

    this.display_courses.forEach( course => {
      if(course.grade && course.grade >= 5 && course.grade <= 10){
        this.total_one += (course.grade*course.ects)
        this.total_two += course.ects
        this.total_grade.course_count += 1
      }
    })
    this.total_grade.grade = this.total_one
    this.total_grade.ects = this.total_two
    this.totalService.getObGrades(this.total_grade);
  }

  changeEvent(course: DisplayCourse){
    if(course.grade){
      this.gradeService.updateGrade(course.id, course.grade).subscribe();
    }
    else{
      this.gradeService.updateGrade(course.id, 0).subscribe();
    }
    this.sendTotal();
  }
}
