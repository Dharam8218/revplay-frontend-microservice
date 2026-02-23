import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {

  profile: any;
  editMode = false;
  selectedFile: File | null = null;

  loading = true;

  editForm;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      displayName: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {

    this.loading = true;  // ✅ start loading

    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
         this.loading = false;  // ✅ stop loading
        this.editForm.patchValue({
          displayName: res.displayName,
          bio: res.bio
        });
      }
    });
  }

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveChanges() {

    const formData = new FormData();

    formData.append(
      'data',
      JSON.stringify(this.editForm.value)
    );

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.editMode = false;
        this.loadProfile();
      }
    });
  }
}