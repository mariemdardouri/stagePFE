import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './site.component.html',
  styleUrl: './site.component.css',
})
export class SiteComponent {
  file!: File;
  constructor(private http: HttpClient) {}

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadCSV() {
    const formData = new FormData();
    formData.append('file', this.file);
    console.log(formData);
    this.http
      .post('http://localhost:3000/api/user/uploadCSV', formData)
      .subscribe(
        (response) => {
          console.log('Fichier téléchargé avec succès');
          console.log(response);
        },
        (error) => {
          console.log(error);
          console.error('Erreur lors du téléchargement du CSV:', error);
        }
      );
  }
}
