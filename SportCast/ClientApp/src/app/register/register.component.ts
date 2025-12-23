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
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ],
    ],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  formatDobOnBlur(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    if (digits.length !== 8) {
      return;
    }

    const month = Number(digits.slice(0, 2));
    const day = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    const candidate = new Date(year, month - 1, day);
    const isValid =
      candidate.getFullYear() === year &&
      candidate.getMonth() === month - 1 &&
      candidate.getDate() === day;

    if (!isValid) {
      return;
    }

    input.value = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    this.form.controls.dateOfBirth.setValue(candidate);
  }

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
      firstName: rawValue.firstname ?? '',
      lastName: rawValue.lastname ?? '',
      email: rawValue.email ?? '',
      password: rawValue.password ?? '',
      dateOfBirth: dateValue instanceof Date ? dateValue.toISOString().split('T')[0] : '',
    };
    this.auth.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = `Welcome, ${res.firstName}! Account created.`;
      },
      error: (err) => {
        this.loading = false;
        const errors = err?.error?.errors as string[] | undefined;
        if (err.status === 409) {
          this.error = 'Email already in use';
        } else if (errors && errors.length > 0) {
          this.error = errors[0];
        } else {
          this.error = 'Registration failed. Please try again.';
        }
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
