import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  selectedFile: File | null = null;

  registerForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],

      bio: [''],
      gender: [''],
       role: ['USER', Validators.required]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {

  if (this.registerForm.invalid) return;

  const role = this.registerForm.value.role ?? 'USER';

  const formData = new FormData();

  formData.append(
    'user',
    JSON.stringify({
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    
      bio: this.registerForm.value.bio,
      gender: this.registerForm.value.gender
    })
  );

  if (this.selectedFile) {
    formData.append('profilePicture', this.selectedFile);
  }

  this.authService.registerUser(formData, role).subscribe({
    next: () => {

      // Auto login after registration
      const loginData = {
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (res) => {
          this.authService.saveAuthData(res);

          if (res.roles.includes('ROLE_ARTIST')) {
            this.router.navigate(['/artist']);
          } else {
            this.router.navigate(['/']);
          }
        }
      });

    },
    error: () => {
      alert('Registration failed');
    }
  });
}
}