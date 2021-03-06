import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  hide = true;
  form: FormGroup;
  errors: {email:string, password:string } = {email: '', password: ''}

  
  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
    ) { 
      this.form = fb.group({
        email : new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/)]),
        password : new FormControl('', Validators.required),
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
    if (this.form.controls['password'].hasError('required')) {
      return 'You must enter a value'
    }
    if (this.form.controls['password'].hasError('invalid')) {
      return this.errors.password
    }

    return ''
  }

  validateForm() : Boolean {
      
    return true
  }


  handleSubmit() {
    const email = this.form.controls['email'].value;
    const password = this.form.controls['password'].value;
    this.authService.login(email, password).subscribe(data => {
      if (!data.ok) {
        this.errors.email = data.errors['general'];
        this.errors.password = data.errors['general']
        this.form.controls['email'].setErrors({invalid: true})
        this.form.controls['password'].setErrors({invalid: true})
        this.form.updateValueAndValidity();
      } else {
        this.router.navigate(['dashboard'], {state:data});
      }
    })
  
  }


}
