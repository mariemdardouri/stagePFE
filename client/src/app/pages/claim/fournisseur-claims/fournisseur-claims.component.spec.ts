import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurClaimsComponent } from './fournisseur-claims.component';

describe('FournisseurClaimsComponent', () => {
  let component: FournisseurClaimsComponent;
  let fixture: ComponentFixture<FournisseurClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FournisseurClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FournisseurClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
