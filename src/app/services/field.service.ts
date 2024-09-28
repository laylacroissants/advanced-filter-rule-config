import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private fieldsSubject = new BehaviorSubject<any[]>([]);
  fields$ = this.fieldsSubject.asObservable();

  private selectedFieldSubject = new BehaviorSubject<any>(null);
  selectedField$ = this.selectedFieldSubject.asObservable();

  // Add separate visibility subjects for both forms
  private showFieldConfigSubject = new BehaviorSubject<boolean>(false);
  private showRuleFormSubject = new BehaviorSubject<boolean>(true);

  showFieldConfig$ = this.showFieldConfigSubject.asObservable();
  showRuleForm$ = this.showRuleFormSubject.asObservable();

  constructor() {
    const storedFields = localStorage.getItem('fields');
    if (storedFields) {
      this.fieldsSubject.next(JSON.parse(storedFields));
    }
  }

  getFields() {
    return this.fieldsSubject.getValue();
  }

  addField(field: any) {
    const fields = [...this.getFields(), field]; // Create a new array with the new field
    this.fieldsSubject.next(fields); // Emit the new array reference to update subscribers
    localStorage.setItem('fields', JSON.stringify(fields)); // Save the new fields array to localStorage
  }

  updateField(index: number, updatedField: any) {
    const fields = this.getFields().slice(); // Create a copy of the fields array
    fields[index] = updatedField; // Update the field at the specified index
    this.fieldsSubject.next(fields); // Emit the updated fields array with a new reference
    localStorage.setItem('fields', JSON.stringify(fields)); // Save to localStorage
  }

  removeField(index: number) {
    const fields = this.getFields();
    fields.splice(index, 1);
    this.fieldsSubject.next(fields);
    localStorage.setItem('fields', JSON.stringify(fields));
  }

  // Methods to control form visibility
  showFieldConfig() {
    this.showFieldConfigSubject.next(true);
    this.showRuleFormSubject.next(false);
  }

  showRuleForm() {
    this.showFieldConfigSubject.next(false);
    this.showRuleFormSubject.next(true);
  }

  setSelectedField(field: any) {
    this.selectedFieldSubject.next(field); 
  }
}
