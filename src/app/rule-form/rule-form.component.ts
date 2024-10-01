import { Component, effect, Injectable, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RuleService } from '../services/rule.service';
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService 
  ) {
    this.ruleForm = this.fb.group({
      name: ['', Validators.required],
      rules: this.fb.array([this.createSubRule()])
    });

    effect(() => {
      const ruleList = this.ruleService.ruleList();
      const selectedRule = this.ruleService.selectedRule();

      if (selectedRule) {
        this.ruleIndex = ruleList.findIndex(r => r === selectedRule);
        this.selectedRule = selectedRule;
        this.loadRule(selectedRule);
      }
    });
  }

  ngOnInit() {
    this.ruleForm.reset();
    this.ruleService.rules$.subscribe(rules => {
      this.ruleList = rules; // subscribe to update dropdown options when new rules are saved
    });

    this.ruleForm.setControl('rules', this.fb.array([this.createSubRule()]));    
  }
  ngOnDestroy() {}
  
  get rules(): FormArray {
    return this.ruleForm.get('rules') as FormArray;
  }

  applyFilter() {
    console.log(this.selectedRule)
  }

  loadRule(rule: Rule) {
    this.ruleForm.patchValue({ name: rule.name });
    this.rules.clear();
    rule.rules.forEach((subRule: any) => {
      const subRuleForm = this.fb.group({
        field: [subRule.field, Validators.required],
        fieldType: [{ value: subRule.fieldType, disabled: true }, Validators.required],
        condition: [subRule.condition, Validators.required],
        value: [subRule.value],
        startValue: [subRule.startValue],
        endValue: [subRule.endValue],
        operator: [subRule.operator || 'AND', Validators.required]
      });
      this.rules.push(subRuleForm);
    });
  }

  createSubRule(): FormGroup {
    return this.fb.group({
      field: ['', Validators.required],
      fieldType: [{ value: '', disabled: true }, Validators.required], 
      condition: [''],
      value: [''], 
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

    if (this.ruleIndex !== null) { //update current selected rule
      this.ruleService.updateRule(this.ruleIndex, ruleFormValue);
      this.selectedRule = ruleFormValue;
      this.ruleService.setSelectedRule(this.selectedRule)
      this.showSuccessUpdate()
      
    } else { // very first rule and new rule
      this.ruleService.saveRule(ruleFormValue);
      this.selectedRule = ruleFormValue; 
      this.ruleIndex = this.ruleList.length - 1
      this.ruleService.setSelectedRule(this.selectedRule)
      this.showSuccessSave()
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

  showSuccessSave() {
    this.messageService.add({ severity: 'success', summary: 'Saved', detail: `Successfully Saved New Rule: ${this.ruleForm.get('name')?.value}`  });
  }
  showSuccessUpdate() {
    this.messageService.add({ severity: 'info', summary: 'Updated', detail: `Successfully Updated Rule: ${this.ruleForm.get('name')?.value}`  });
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
