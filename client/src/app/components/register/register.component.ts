import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  hide = true;
  form: FormGroup;
  errors: {email:string } = {email: ''}

  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder
    ) { 
      this.form = fb.group({
        email : new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/)]),
        password : new FormControl('', Validators.required),
        password2 : new FormControl('', Validators.required)
      })

      

    }
    
    ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.form.controls['email'].hasError('required')) {
      return 'You must enter a value';
    }

    if (this.form.controls['email'].hasError('invalid')) {
      return this.errors.email
    }

    return this.form.controls['email'].errors ? 'Not a valid email' : '';
  }

  validatePassword() {
    if (this.form.controls['password'].value !== this.form.controls['password2'].value) {
      return 'Passwords must match'
    }
    if (!this.form.controls['password'].value || this.form.controls['password'].value === '') {
      return 'You must enter a value';
    }
    if (this.form.controls['password'].hasError('required')) {
      return 'You must enter a value'
    }
    if (this.form.controls['password2'].hasError('required')) {
      return 'You must enter a value'
    }
    return ''
  }

  validateForm() : Boolean {
    const p1 = this.form.controls['password']
    const p2 = this.form.controls['password2']

    if (p1.value !== p2.value) {
      p1.setErrors({'mustMatch': true})
      p2.setErrors({'mustMatch': true})
      return false
    }

    if (!p1.value.trim()) {
      p1.setErrors({required:true})
      return false
    }

    if (!p2.value.trim()) {
      p2.setErrors({required:true})
      return false
    }

    return true
  }


  handleSubmit() {
    if (!this.validateForm()) this.form.updateValueAndValidity();

    else {
      const email = this.form.controls['email'].value;
      const password = this.form.controls['password'].value;
      this.authService.register(email, password).subscribe(data => {
        if (!data.ok) {
          this.errors.email = data.errors['general'];
          this.form.controls['email'].setErrors({invalid: true})
          this.form.updateValueAndValidity();
        }
      })
    }
  }


}
