import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public usesignin = true;
  public usereset = false;
  public useotp = false;
  public usenewpwd = false;
  public commethod = 'SMS';
  public username = '';
  public cellno = '';
  public newpwd3 = '';
  public newpwd4 = '';
  public temptoken = '';
  public otpin = '';
  public password = '';
  private messagesubscription: Subscription;
  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.currentUserValue
      ? this.authService.currentUserValue.username
      : '';
    this.cellno = this.authService.currentUserValue
      ? this.authService.currentUserValue.cellno
      : '';
    this.messagesubscription = this.authService.getMessage().subscribe(x => {
      this.newpwd4 = x;
      this.newpwd3 = this.newpwd3;
    });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.messagesubscription.unsubscribe();
  }
  /* ************************************************************* */
  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.signinUser(email, password);
  }
  /* ************************************************************* */
  onResetRequest() {
    this.newpwd3 = '';
    this.newpwd4 = '';
    if (this.username.indexOf('@') < 3 || this.username.length < 6) {
      this.newpwd3 = 'Incomplete User Email';
      return;
    }
    if (this.commethod === 'SMS' && this.cellno.length < 10) {
      this.newpwd3 = 'Incomplete Cellno';
      return;
    }
    this.authService
      .requestOTP(this.username, this.commethod, this.cellno)
      .subscribe(data => {
        if (data.ServicesList instanceof Array) {
          this.temptoken = JSON.parse(
            data.ServicesList[0].JsonsetJstext
          ).TEMPTOKEN;
          if (this.temptoken && this.temptoken.length > 20) {
            this.onSelect('otp');
            this.newpwd4 =
              'An One-Time Password has been sent to your ' + this.commethod;
          }
        }
      });
  }
  /* ************************************************************* */
  onOTPSend() {
    this.authService
      .confirmOTP(this.username, this.otpin, this.temptoken)
      .subscribe(data => {
        this.temptoken = data;
        this.onSelect('newpwd');
      });
  }
  /* ************************************************************* */
  onNewPassword(form: NgForm) {
    this.newpwd4 = '';
    if (!form.value.password4 || form.value.password4.length < 6) {
      this.newpwd4 = 'Password must be at least 6 char long';
      return;
    }
    if (form.value.password4 !== form.value.password3) {
      this.newpwd4 = 'Passwords must be equal';
      return;
    }
    this.authService.updatePassword(
      this.username,
      form.value.password4,
      this.temptoken
    );
  }
  /* ************************************************************* */
  onRadioChange(typeofcom: string) {
    this.commethod = typeofcom;
  }
  /* ************************************************************* */
  onSelect(sectionof) {
    switch (sectionof) {
      case 'reset': {
        this.usesignin = false;
        this.usereset = true;
        this.useotp = false;
        this.usenewpwd = false;
        break;
      }
      case 'signin': {
        this.usesignin = true;
        this.usereset = false;
        this.useotp = false;
        this.usenewpwd = false;
        break;
      }
      case 'otp': {
        this.usesignin = false;
        this.usereset = false;
        this.useotp = true;
        this.usenewpwd = false;
        break;
      }
      case 'newpwd': {
        this.newpwd4 = '';
        this.usesignin = false;
        this.usereset = false;
        this.useotp = false;
        this.usenewpwd = true;
        break;
      }
    }
  }
  /* ************************************************************* */
}
