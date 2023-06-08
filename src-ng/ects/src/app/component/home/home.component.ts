import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { DisplayCourse } from 'src/app/model/displayCourse';
import { GradeService } from 'src/app/services/grade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title='ECTS Calculator';
  obligatoryCourses: DisplayCourse[];
  generalCourses: DisplayCourse[];
  choiceCourses: DisplayCourse[];
  electiveCourses: DisplayCourse[];
  labCourses: DisplayCourse[];
  otherCourses: DisplayCourse[];
  allCourses: DisplayCourse[] = [];

  totalCourses: number = 0;
  totalEcts: number = 0;
  totalGrade: number = 0;
  totalMult: number = 0;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private courseService: CourseService,
    private gradeService: GradeService
  ) {
    }

  ngOnInit() {
    // get all courses by category
    this.courseService.getObligatory().subscribe(courses =>{
      this.obligatoryCourses = courses;
      this.calculateTotalStats(courses)
    })
    this.courseService.getGeneral().subscribe(courses =>{
      this.generalCourses = courses;
      this.calculateTotalStats(courses)
    })
    this.courseService.getBychoice().subscribe(courses =>{
      this.choiceCourses = courses;
      this.calculateTotalStats(courses)
    })
    this.courseService.getElective().subscribe(courses =>{
      this.electiveCourses = courses;
      this.calculateTotalStats(courses)
    })
    this.courseService.getLabs().subscribe(courses =>{
      this.labCourses = courses;
      this.calculateTotalStats(courses)
    })
    this.courseService.getOther().subscribe(courses =>{
      this.otherCourses = courses;
      this.calculateTotalStats(courses)
    })

    // listen to changes in single course
    this.gradeService.courseGrade$.subscribe(course => {
      this.updateTotalStats(course);
      // console.log(this.totalCourses)
    })

  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  scroll(id: string){
    var elem = document.getElementById(id);
    elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  calculateTotalStats(courses: DisplayCourse[]){
    // given an array of courses of single type, configure total stats
    for(let course of courses){
      if(course.grade >=5 && course.grade <=10){
        this.totalCourses++;
        this.totalEcts += course.ects
        this.totalMult += course.grade*course.ects
      }
      this.allCourses.push(course)
    }
    this.totalGrade = this.totalMult / this.totalEcts
  }

  updateTotalStats(singleCourse: DisplayCourse) {
    // update total stats in case a single grade is updated

    let courses=0, ects=0, mult=0;
    for(let course of this.allCourses){
      if(course.id === singleCourse.id)
        // update the changed course in central array
        course.grade = +singleCourse.grade
      if(course.grade >=5 && course.grade <=10){
        courses++;
        ects += course.ects
        mult += course.grade*course.ects
      }
    }
    // update properties with the new values
    this.totalCourses=courses;
    this.totalEcts = ects;
    this.totalMult = mult;
    this.totalGrade = this.totalMult / this.totalEcts
  }
}
