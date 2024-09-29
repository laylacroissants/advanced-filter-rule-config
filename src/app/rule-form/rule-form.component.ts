import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RuleService } from '../services/rule.service';
import { Subscription } from 'rxjs';
import { FieldService } from '../services/field.service';
import { Field } from '../model';

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit {
  @Input() fields: Field[] = [];
  ruleForm: FormGroup;
  private selectedRuleSubscription: Subscription | undefined;
  private fieldsSubscription: Subscription | undefined;
  ruleIndex: number | null = null;
  showForm: boolean = false;  // Track whether to show the form

  numberConditions = [
    { label: 'Is', value: 'is' },
    { label: 'Greater Than', value: 'greaterThan' },
    { label: 'Less Than', value: 'lessThan' },
    { label: 'Range', value: 'range' }
  ];

  textConditions = [
    { label: 'Is', value: 'is' },
    { label: 'Contains', value: 'contains' },
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Not Contains', value: 'notContains' }
  ];

  defaultConditions = [
    { label: 'Is', value: 'is' }, // Default condition
  ];

  booleanValues = [
    { label: 'True', value: true },
    { label: 'False', value: false }
  ];

  operatorOptions = [
    { label: 'AND', value: 'AND' },
    { label: 'OR', value: 'OR' }
  ];

  constructor(
    private fb: FormBuilder, 
    private ruleService: RuleService, 
    private fieldService: FieldService // Inject FieldService
  ) {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      rules: this.fb.array([this.createSubRule()])
    });
  }

  ngOnInit() {

    this.selectedRuleSubscription = this.ruleService.selectedRule$.subscribe(rule => {
      if (rule === null) {
        this.showForm = true;
        this.ruleForm.reset();
        this.ruleIndex = null;
        this.ruleForm.setControl('rules', this.fb.array([this.createSubRule()]));
      } else if (rule) {
        this.showForm = true;
        this.ruleIndex = rule.index;
        this.ruleForm.setControl('rules', this.fb.array([]));
        this.ruleForm.patchValue({
          name: rule.name
        });
        rule.rules.forEach((subRule: any) => {
          this.rules.push(this.fb.group(subRule));
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.selectedRuleSubscription) {
      this.selectedRuleSubscription.unsubscribe();
    }
    if (this.fieldsSubscription) {
      this.fieldsSubscription.unsubscribe();
    }
  }

  get rules(): FormArray {
    return this.ruleForm.get('rules') as FormArray;
  }

  createSubRule(): FormGroup {
    return this.fb.group({
      field: ['', Validators.required],
      fieldType: [{ value: '', disabled: true }, Validators.required], // Disabled because it will be auto-filled
      condition: [''],
      value: [''], // This will be used for single value conditions like "greater than" and "less than"
      startValue: [''], // For range start
      endValue: [''], // For range end
      operator: ['AND']
    });
  }

  addSubRule() {
    this.rules.push(this.createSubRule());
  }

  deleteSubRule(index: number) {
    this.rules.removeAt(index);
  }

  saveRule() {
    const ruleFormValue = this.ruleForm.value;
  
    // Temporarily enable fieldType controls to include their values in form value
    ruleFormValue.rules.forEach((subRule: any, index: number) => {
      const fieldTypeControl = this.rules.at(index).get('fieldType');
      if (fieldTypeControl) {
        fieldTypeControl.enable({ emitEvent: false }); // Enable temporarily
        subRule.fieldType = fieldTypeControl.value; // Manually set the value in form value
        fieldTypeControl.disable({ emitEvent: false }); // Disable again to keep UI state
      }
    });
  
    if (this.ruleIndex !== null) {
      this.ruleService.updateRule(this.ruleIndex, ruleFormValue);
    } else {
      this.ruleService.saveRule(ruleFormValue);
    }
    this.ruleForm.reset();
  }


  clearRule() {
    this.ruleForm.reset();
    this.ruleForm.setControl('rules', this.fb.array([this.createSubRule()]));
    if (this.ruleIndex !== null) {
      this.ruleService.clearRule(this.ruleIndex);
    }
  }

  onFieldChange(index: number) {
    const selectedField = this.rules.at(index).get('field')?.value;
    const fieldType = this.fields.find(field => field.fieldName === selectedField.fieldName)?.fieldType;
    if (fieldType) {
      this.rules.at(index).get('fieldType')?.setValue(fieldType);
    }
  }

  getConditionOptions(fieldType: string): any[] {
    if (fieldType === 'number') {
      return this.numberConditions;
    } else if (fieldType === 'text') {
      return this.textConditions;
    } else if (fieldType === 'boolean') {
      return []; // Empty array for boolean as no condition is needed
    } else {
      return this.defaultConditions; // Default conditions
    }
  }
}
