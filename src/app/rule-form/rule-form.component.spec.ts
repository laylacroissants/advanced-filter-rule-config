import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RuleFormComponent } from './rule-form.component';
import { RuleService } from '../services/rule.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';  // PrimeNG Button
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserModule } from '@angular/platform-browser';
import { SidebarModule } from 'primeng/sidebar';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';

describe('RuleFormComponent', () => {
  let component: RuleFormComponent;
  let fixture: ComponentFixture<RuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RuleFormComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MultiSelectModule,
        ReactiveFormsModule,
        SidebarModule,
        ButtonModule,
        OrderListModule,
        DialogModule,
        InputTextModule,
        FloatLabelModule,
        DropdownModule,
        CardModule,
        TableModule,
        DropdownModule,
        CommonModule,
        FormsModule,
        ToastModule,
        SelectButtonModule
      ],
      providers: [RuleService, MessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with default values', () => {
    const form = component.ruleForm;
    expect(form).toBeTruthy();
  
    // Test the main form control for 'name'
    expect(form.controls['name'].value).toBe(null);  // Expect 'name' to be empty string as default
  
    // Access the sub-rule in the form array 'rules'
    const subRuleForm = (form.controls['rules'] as FormArray).at(0) as FormGroup;
  
    // Test each field in the first sub-rule
    expect(subRuleForm.controls['field'].value).toBe('');
    expect(subRuleForm.controls['condition'].value).toBe('');
    expect(subRuleForm.controls['operator'].value).toBe('AND');  // Default to 'AND'
    expect(subRuleForm.controls['fieldType'].value).toBe('');
    expect(subRuleForm.controls['value'].value).toBe('');
  
    // Ensure that there is exactly one sub-rule in the form array by default
    expect(component.rules.length).toBe(1);
  });

  it('should add a sub-rule when addSubRule() is called', () => {
    const initialLength = component.rules.controls.length;
    component.addSubRule();
    fixture.detectChanges();
    expect(component.rules.controls.length).toBe(initialLength + 1);
  });

  it('should remove a sub-rule when deleteSubRule() is called', () => {
    component.addSubRule();
    const initialLength = component.rules.controls.length;
    component.deleteSubRule(0);
    fixture.detectChanges();
    expect(component.rules.controls.length).toBe(initialLength - 1);
  });

  it('should validate form as invalid when no rule name is provided', () => {
    component.ruleForm.get('name')?.setValue('');
    expect(component.ruleForm.invalid).toBeTrue();
  });

  it('should open the save dialog when openSaveDialog() is called', () => {
    component.openSaveDialog();
    expect(component.showSaveDialog).toBeTrue();
  });
});