import { Component, ViewChild , ElementRef } from '@angular/core';
import { MaterielService } from '../../services/materiel.service';
import {FormControl,FormGroup,FormsModule,ReactiveFormsModule,Validators,} from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination'; 
import { FilterPipe } from '../../filter.pipe';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-fournisseur',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    QRCodeModule,
    NgxPaginationModule,
    FilterPipe,
  ],
  templateUrl: './fournisseur.component.html',
  styleUrl: './fournisseur.component.css',
})
export class FournisseurComponent {
[x: string]: any;
  qrCodeData: { [key: string]: string } = {};
  selectedLotData: string = ''; 
  file!: File;
  materielList: any[] = [];
  lotNumbers: number[] = [];
  materielForm!: FormGroup;
  selectedMateriel: any = {};
  p: number = 1;
  searchText: string = '';
  @ViewChild('qr', { static: false })qr!:ElementRef;
  lots: any;
  selectedLot: string = '';

  constructor(
    private materielService: MaterielService,
    private http: HttpClient,
    private toast: ToastrService,
    
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.getMaterielByFournisseur();
    this.getLotNumbers();
  }

  setForm(): void {
    this.materielForm = new FormGroup({
      categorie: new FormControl('', [Validators.required]),
      nature: new FormControl('', [Validators.required]),
      numSerie: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(20),
      ]),
      numLot: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {
    console.log(this.materielForm.value);
    this.materielService.addMateriel(this.materielForm.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.success) {
          this.toast.success(resp.message);
          this.getMaterielByFournisseur();
        } else {
          this.toast.error(resp.message);
        }
      },
      error: (err) => {
        console.log(err);
        if (err.status === 500) {
          this.toast.error("Erreur lors de l'ajout du matériel");
        }
      },
    });
  }
  getMaterielByFournisseur(): void {
    this.materielService.getMaterielByFournisseur().subscribe(
      (data: any[]) => {
        console.log(data, 'data');
        this.materielList = data;
        console.log(data, 'materielList');
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  getLotNumbers(): void {
    this.materielService.getLotNumbers().subscribe(
      (data: number[]) => {
        this.lotNumbers = data;
      },
      (error) => {
        console.error('Error fetching lot numbers:', error);
      }
    );
  }
  
  editMateriel(materiel: any): void {
    this.selectedMateriel = materiel;
  }

  updateMateriel(): void {
    if (this.selectedMateriel) {
      this.materielService.updateMateriel(this.selectedMateriel).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getMaterielByFournisseur();
            this.selectedMateriel = {};
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la mise à jour du materiel');
          }
        },
      });
    }
  }

  openDeleteModal(materiel: any): void {
    this.selectedMateriel = materiel;
  }

  deleteMateriel(): void {
    if (this.selectedMateriel) {
      this.materielService.deleteMateriel(this.selectedMateriel).subscribe({
        next: (resp: any) => {
          if (resp.success) {
            this.toast.success(resp.message);
            this.getMaterielByFournisseur();
          } else {
            this.toast.error(resp.message);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du materiel:', err);
          if (err.status === 500) {
            this.toast.error('Erreur lors de la suppression du materiel');
          }
        },
      });
    }
  }
  downloadqr():void{
    const qr=this.qr.nativeElement.querySelector('canvas');
    if(qr){
     qr.toBlob((blob:Blob)=>{
       saveAs(blob,'qrcode.png');
     });
    }
    }
  onFileChange(event: any): void {
    this.file = event.target.files[0];
    this.updateFileName(event);
  }
  uploadCSV() {
    const formData = new FormData();
    formData.append('file', this.file);
    console.log(formData);
    this.http.post('http://localhost:3000/api/materiel/uploadCSV', formData).subscribe(
      (response:any) => {
        console.log('File uploaded successfully');
        console.log(response);
        this.toast.success(response.message);
        this.getMaterielByFournisseur();
        
      },
      (error) => {
        console.log(error);
        console.error('Error uploading CSV:', error);
      }
    );
  }
  openQrModal(lot: string): void {
    this.selectedLot = lot;
    this.generateQRCodeForSelectedLot();
  }
  getMaterielList(): any[] {
    if (this.selectedLotData) {
      const data = JSON.parse(this.selectedLotData);
      return data.materiels;
    }
    return [];
  }
  getStringifiedData(data: any[]): string {
    return JSON.stringify(data);
  }
  generateQRCodeForSelectedLot(): void {
    if (this.materielList) {
      const lots = this.materielList.reduce((acc, current) => {
        const lot = current.numLot;
        if (!acc[lot]) {
          acc[lot] = [];
        }
        acc[lot].push(current);
        return acc;
      }, {});
  
      const selectedLotMaterials = lots[this.selectedLot];
      const selectedLotData = {
        lot: this.selectedLot,
        materiels: selectedLotMaterials.map((materiel: { categorie: any; nature: any; numSerie: any; numLot:any; createdAt: any; }) => ({
          categorie: materiel.categorie,
          nature: materiel.nature,
          numSerie: materiel.numSerie,
          numLot: materiel.numLot,
          createdAt: materiel.createdAt
        }))
      };
  
      this.selectedLotData = JSON.stringify(selectedLotData);
    }
  }
  getUniqueNumInvs(): string[] {
    return [...new Set(this.materielList.map(materiel => materiel.numInv))];
  }
  

  updateFileName(event: any): void {
    const input = event.target;
    const fileName = input.files.length ? input.files[0].name : 'Aucun fichier choisi';
    const fileNameElement = document.getElementById('fileName');
    if (fileNameElement) {
      fileNameElement.textContent = fileName;
    }
  }
}

