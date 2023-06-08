import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DisplayCourse } from 'src/app/model/displayCourse';
import { GradeService } from 'src/app/services/grade.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() displayCourses: DisplayCourse[]
  

  constructor(
    private gradeService: GradeService,
  ) { }

  ngOnInit() {
  }

  onKeyUp(course: DisplayCourse){
    this.gradeService.updateGrade(course.id, course).subscribe(data => {
      this.gradeService.courseGrade$.next(course)
    });
  }
}
