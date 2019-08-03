import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './component/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './component/home/home.component';
import { SignupComponent } from './component/signup/signup.component';
import { ObligatoryComponent } from './component/courses/obligatory/obligatory.component';
import { GeneralComponent } from './component/courses/general/general.component';
import { LabsComponent } from './component/courses/labs/labs.component';
import { ElectiveComponent } from './component/courses/elective/elective.component';
import { BychoiceComponent } from './component/courses/bychoice/bychoice.component';
import { OtherComponent } from './component/courses/other/other.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ObligatoryComponent,
    GeneralComponent,
    LabsComponent,
    ElectiveComponent,
    BychoiceComponent,
    OtherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
