import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styles: ``
})
export class LoginPage {

  fb = inject(FormBuilder);
  formSubmited = signal<Boolean>(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login(){
    this.formSubmited.set(true);
    if(this.loginForm.invalid){
      return ;
    }
  }

  getControlErrors(control_name: string, display_name: string): string[] {

    const control = this.loginForm?.get(control_name);

    if (control?.errors) {
      return Object.keys(control.errors)
                   .map( (errorKey: string) => {
                     return this.getErrorMessage(errorKey, control.errors?.[errorKey], display_name)
                   });
    }
    return [];
  }

  private getErrorMessage(errorKey: string, errorValue: any, display_name: string): string {
    const errorMessages: { [key: string]: (errorValue: any) => string } = {
      'required': () => `${display_name} is required`,
      'minlength': () => `${display_name} must be at least ${errorValue.requiredLength} characters long`,
      'differentPW': () => errorValue
    };
    return errorMessages[errorKey] ? errorMessages[errorKey](errorValue) : `Unknown error: ${errorKey}`;
  }

}
