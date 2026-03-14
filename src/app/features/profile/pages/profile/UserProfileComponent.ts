import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserProfileComponent implements OnInit {
  profile: any;
  editMode = false;
  selectedFile: File | null = null;

  loading = true;

  editForm;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.editForm = this.fb.group({
      username: [''],
      bio: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true; // ✅ start loading
    this.cdr.markForCheck();
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false; // ✅ stop loading
        this.cdr.detectChanges(); // Force view update immediately
        this.editForm.patchValue({
          username: res.username,
          bio: res.bio,
        });
        this.cdr.detectChanges(); // Force view update after form patch
      },
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

    formData.append('data', JSON.stringify(this.editForm.value));

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.authService.updateProfile(formData).subscribe({
      next: () => {
        this.editMode = false;
        this.loadProfile();
      },
    });
  }

  get firstName(): string {
    return this.profile?.username?.split(' ')[0] || '';
  }
}
