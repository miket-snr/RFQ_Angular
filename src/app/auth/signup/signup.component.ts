import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MustMatch } from '../must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private messagesubscription: Subscription;
  public messagetxt = '';
  public success = false;
  public failure = false;
  public emailvar = '';
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.messagesubscription = this.authService.getMessage().subscribe(x => {
      this.messagetxt = x;
      if (this.messagetxt.indexOf('Error') >= 0) {
        this.success = false;
        this.failure = true;
      } else {
        this.success = true;
        this.failure = false;
      }
    });
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        company: ['', Validators.required],
        // password: ['', [Validators.required, Validators.minLength(6)]],
        //  confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
        cellno: ['']
      }
      // ,
      // {
      //   validator: MustMatch('password', 'confirmPassword')
      // }
    );
  }

  ngOnDestroy() {
    this.messagesubscription.unsubscribe();
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.authService.signupUser(
      this.registerForm.value.email,
      this.registerForm.value.password,
      this.registerForm.value.company,
      this.registerForm.value.firstName,
      this.registerForm.value.lastName,
      this.registerForm.value.cellno
    );
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
}
