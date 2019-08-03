import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Grade } from '../model/grade';

@Injectable({
  providedIn: 'root'
})
export class TotalService {

  private ob_grades = new Subject<Grade>();
  ob_grades$ = this.ob_grades.asObservable();

  private gen_grades = new Subject<Grade>();
  gen_grades$ = this.gen_grades.asObservable();

  private el_grades = new Subject<Grade>();
  el_grades$ = this.el_grades.asObservable();

  private bc_grades = new Subject<Grade>();
  bc_grades$ = this.bc_grades.asObservable();

  private lab_grades = new Subject<Grade>();
  lab_grades$ = this.lab_grades.asObservable();

  private other_grades = new Subject<Grade>();
  other_grades$ = this.other_grades.asObservable();

  constructor() { }

  getObGrades(total: Grade){
    this.ob_grades.next(total);
  }

  getGenGrades(total: Grade){
    this.gen_grades.next(total);
  }

  getElGrades(total: Grade){
    this.el_grades.next(total)
  }

  getBCGrades(total: Grade){
    this.bc_grades.next(total)
  }

  getLabGrades(total: Grade){
    this.lab_grades.next(total)
  }

  getOtherGrades(total: Grade){
    this.other_grades.next(total)
  }
}
