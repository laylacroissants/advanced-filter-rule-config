import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RuleService } from '../services/rule.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FieldService } from '../services/field.service';
import { Field, Rule } from '../model';

@Injectable()
@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss']
})
export class RuleFormComponent implements OnInit {
  @Input() fields: Field[] = [];

  ruleList: Rule[] = []
  selectedRule: Rule | undefined
  ruleForm: FormGroup;
  ruleIndex: number | null = null;
  showSaveDialog: boolean = false;
  initialSelectedRule = new BehaviorSubject<any>(undefined)

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
  ) {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      rules: this.fb.array([this.createSubRule()])
    });
  }

  ngOnInit() {
    this.ruleForm.reset();
    this.ruleService.rules$.subscribe(rules => {
      this.ruleList = rules; // Update dropdown options when new rules are saved
    });

    this.ruleForm.setControl('rules', this.fb.array([this.createSubRule()]));
    // Subscribe to the selected rule observable
    this.ruleService.selectedRule$.subscribe(rule => {
      if (rule) {
        this.ruleIndex = this.ruleList.findIndex(r => r === rule); 
        this.selectedRule = rule
        this.ruleForm.patchValue(rule);

        this.rules.clear();

      // Loop through each sub-rule and add it to the form array
        rule.rules.forEach((subRule: any) => {
          console.log(subRule.field)
          const subRuleForm = this.fb.group({
            field: [subRule.field, Validators.required],
            fieldType: [{ value: subRule.field.fieldType, disabled: true }, Validators.required],
            condition: [subRule.condition, Validators.required],
            value: [subRule.value],
            startValue: [subRule.startValue],
            endValue: [subRule.endValue],
            operator: [subRule.operator || 'AND', Validators.required]
          });
          this.rules.push(subRuleForm); // Add each sub-rule to the form array
        });
      }
    });
    
  }
  ngOnDestroy() {}
  

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

  openSaveDialog() {
    this.showSaveDialog = true;
  }

  saveAsRule() {
    this.ruleIndex = null
    this.openSaveDialog()
  }

  saveRule() {
    if (this.ruleForm.invalid) {
      // Prevent saving if the form is invalid
      alert('Please enter a valid rule name.');
      return;
    }

    const ruleFormValue = this.ruleForm.value;
    
    // Temporarily enable fieldType controls to include their values in form value
    ruleFormValue.rules.forEach((subRule: any, index: number) => {
      const fieldTypeControl = this.rules.at(index).get('fieldType');
      if (fieldTypeControl) {
        fieldTypeControl.enable({ emitEvent: false });
        subRule.fieldType = fieldTypeControl.value; 
        fieldTypeControl.disable({ emitEvent: false }); 
      }
    });

    if (this.ruleIndex !== null) {
      console.log("this is updating")
      this.ruleService.updateRule(this.ruleIndex, ruleFormValue);
      this.selectedRule = ruleFormValue;
    } else { // very first one and new rule
      console.log("this is a new rule or very furst one")
      this.ruleService.saveRule(ruleFormValue);
      this.selectedRule = ruleFormValue; 
      this.ruleIndex = this.ruleList.length - 1
    }

    this.showSaveDialog = false;  
  }

  deleteRule() {
    this.ruleForm.reset();
    this.ruleForm.setControl('rules', this.fb.array([this.createSubRule()]));
    if (this.ruleIndex !== null) {
      this.ruleService.clearRule(this.ruleIndex);
      this.selectedRule = undefined
      this.ruleIndex = null
    }
  }

  onFieldChange(index: number) {
    const selectedField = this.rules.at(index).get('field')?.value;
    const fieldType = this.fields.find(field => field.fieldName === selectedField.fieldName)?.fieldType;
    if (fieldType) {
      this.rules.at(index).get('fieldType')?.setValue(fieldType);
    }
  }
  onRuleSelect(event: any) {
    const selectedRule = event.value; 
    this.ruleService.setSelectedRule(selectedRule);
  }

  getConditionOptions(fieldType: string): any[] {
    if (fieldType === 'number') {
      return this.numberConditions;
    } else if (fieldType === 'text') {
      return this.textConditions;
    } else if (fieldType === 'boolean') {
      return []; 
    } else {
      return this.defaultConditions; 
    }
  }
}
