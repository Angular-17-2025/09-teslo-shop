import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/slug-pattern';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
  styles: ``
})
export class FormErrorLabel {

  control = input.required<AbstractControl>();

  get errorMessage() {
    const errors: ValidationErrors = this.control().errors || {};
    console.log("Errors: ", errors);
    return this.control().touched &&
           Object.keys(errors).length > 0
            ? FormUtils.getTextError(errors) //This comes from our custom FormUtils
            : null
  }

}
