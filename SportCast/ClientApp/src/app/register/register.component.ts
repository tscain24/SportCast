import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService, RegisterRequest } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  loading = false;
  error = '';
  success = '';
  readonly maxDate = new Date();

  form = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    dateOfBirth: [null as Date | null, [Validators.required, minimumAgeValidator(13)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  submit(): void {
    this.error = '';
    this.success = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const rawValue = this.form.getRawValue();
    const dateValue = rawValue.dateOfBirth;
    const payload: RegisterRequest = {
      firstname: rawValue.firstname ?? '',
      lastname: rawValue.lastname ?? '',
      email: rawValue.email ?? '',
      password: rawValue.password ?? '',
      dateOfBirth: dateValue instanceof Date ? dateValue.toISOString().split('T')[0] : '',
    };
    this.auth.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = `Welcome, ${res.firstname}! Account created.`;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 409 ? 'Email already in use' : 'Registration failed. Please try again.';
      },
    });
  }
}

function minimumAgeValidator(minAge: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!(value instanceof Date)) {
      return null;
    }

    const today = new Date();
    const cutoff = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return value > cutoff ? { minAge: true } : null;
  };
}
