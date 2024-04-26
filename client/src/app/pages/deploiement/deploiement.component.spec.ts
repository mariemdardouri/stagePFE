import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploiementComponent } from './deploiement.component';

describe('DeploiementComponent', () => {
  let component: DeploiementComponent;
  let fixture: ComponentFixture<DeploiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeploiementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeploiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
