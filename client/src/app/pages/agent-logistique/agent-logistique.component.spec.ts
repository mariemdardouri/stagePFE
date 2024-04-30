import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentLogistiqueComponent } from './agent-logistique.component';

describe('AgentLogistiqueComponent', () => {
  let component: AgentLogistiqueComponent;
  let fixture: ComponentFixture<AgentLogistiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentLogistiqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgentLogistiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
