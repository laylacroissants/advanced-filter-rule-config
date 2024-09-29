import { Component } from '@angular/core';
import { RuleService } from '../services/rule.service';
import { FieldService } from '../services/field.service';
import { Subscription } from 'rxjs';
import { Field, Rule } from '../model';

@Component({
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrl: './rule-list.component.scss'
})
export class RuleListComponent {

  sideBarVisible: boolean = true;
  rules: Rule[] = [];
  selectedRule: any[] = []
  fields: Field[] = [];
  selectedField: any[] = []

  private rulesSubscription: Subscription | undefined;
  private fieldsSubscription: Subscription | undefined;

  constructor(private ruleService: RuleService,
    private fieldService: FieldService
  ) { }

  ngOnInit(): void {
    // Subscribe to rules observable to get real-time updates
    this.rulesSubscription = this.ruleService.rules$.subscribe(rules => {
      this.rules = rules;
    });

    // Subscribe to fields observable to get real-time updates
    this.fieldsSubscription = this.fieldService.fields$.subscribe(fields => {
      this.fields = fields;
    });
  }

  getFieldClass(fieldType: string): string {
    switch(fieldType) {
      case 'text':
        return 'pi pi-align-justify text-sm';
      case 'number':
        return 'pi pi-dollar text-sm';
      case 'boolean':
        return 'pi pi-check text-sm';
      default:
        return '';
    }
  }

  toggleSidebar() {
    this.sideBarVisible = !this.sideBarVisible;
  }

  addNewRule() {
    this.ruleService.setSelectedRule(null);  // Signal to display an empty form for a new rule
    this.fieldService.showRuleForm();
  }

  onFilterRuleSelectionChange(event: any) {
    if (event && event.length) {
      const selectedRule = event[0]; // Get the selected rule from the event
      const index = this.rules.findIndex(rule => rule.name === selectedRule.name); // Find the index of the selected rule
      this.loadRule(index); // Load the rule using the index
    }
  }


  // Load selected rule and pass it to the service
  loadRule(index: number) {
    const selectedRule = this.rules[index];
    console.log(selectedRule)
    this.ruleService.setSelectedRule({ ...selectedRule, index });  // Add the index for later updates
    this.fieldService.showRuleForm(); // Show the rule form when a rule is selected
  }


  onFieldRuleSelectionChange(event: any) {
    if (event && event.length) {
      const selectedField = event[0]; // Get the selected rule from the event
      const index = this.fields.findIndex(field => field.fieldName === selectedField.fieldName); // Find the index of the selected rule
      this.loadField(index); // Load the rule using the index
    }
  }

  loadField(index: number) {
    const selectedField = this.fields[index];
    this.fieldService.setSelectedField({ field: selectedField, index });
    this.fieldService.showFieldConfig()
  }

  addNewField() {
    this.fieldService.setSelectedField(null); // Signal to clear the form in FieldConfigComponent
    this.fieldService.showFieldConfig()
  }

  removeField(index: number) {
    this.fieldService.removeField(index);
    this.fields = this.fieldService.getFields(); // Update local list after removal
  }

  
  ngOnDestroy(): void {
    // Unsubscribe from observables to avoid memory leaks
    if (this.rulesSubscription) {
      this.rulesSubscription.unsubscribe();
    }
    if (this.fieldsSubscription) {
      this.fieldsSubscription.unsubscribe();
    }
  }
}
