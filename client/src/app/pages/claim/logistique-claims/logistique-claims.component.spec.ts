import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogistiqueClaimsComponent } from './logistique-claims.component';

describe('LogistiqueClaimsComponent', () => {
  let component: LogistiqueClaimsComponent;
  let fixture: ComponentFixture<LogistiqueClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogistiqueClaimsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogistiqueClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
