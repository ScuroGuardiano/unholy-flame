import { AfterContentChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl } from '@angular/forms';
import firebaseAuthErrorMap from './firebase-auth-error-map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterContentChecked {

  constructor(private auth: AngularFireAuth) { }

  public cardStatus = "primary";
  public submitStatus = "primary";
  public emailStatus = "primary";
  public passwordStatus = "primary";

  public email = "";
  public password = "";
  public canSignIn = false;

  public error = ''

  @ViewChild("emailCtr") public emailCtr: FormControl | undefined;

  async signIn() {
    try {
      this.cardStatus = "info";
      const login = await this.auth.signInWithEmailAndPassword(this.email, this.password);
      this.cardStatus = "success";
      console.dir(login);
    }
    catch (err) {
      if ('code' in err) {
        this.error = firebaseAuthErrorMap[err.code] || "Uknown error";
      }
      else {
        this.error = "Uknown error";
      }
      this.cardStatus = "danger";
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.canSignIn = !this.emailCtr?.invalid && this.password !== '';
    this.emailStatus = this.emailCtr?.invalid ? this.email === '' ? "primary" : "danger" : "success";
    this.passwordStatus = this.password === '' ? "primary" : "success";
  }
}
