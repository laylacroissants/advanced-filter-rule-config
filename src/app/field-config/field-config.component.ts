import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FieldService } from '../services/field.service'; // Create this service to manage fields
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-field-config',
  templateUrl: './field-config.component.html',
  styleUrls: ['./field-config.component.scss']
})
export class FieldConfigComponent {
  fieldForm: FormGroup;
  selectedFieldSubscription: Subscription | undefined;
  selectedFieldIndex: number | null = null;
  displayWarning: boolean = false; // modal visibility control

  constructor(private fb: FormBuilder, private fieldService: FieldService) {
    this.fieldForm = this.fb.group({
      fieldName: ['', Validators.required],
      fieldType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Subscribe to selected field changes
    this.selectedFieldSubscription = this.fieldService.selectedField$.subscribe((fieldData) => {
      if (fieldData) {
        this.selectedFieldIndex = fieldData.index;
        this.fieldForm.patchValue(fieldData.field); // Load field data into the form
      } else {
        this.selectedFieldIndex = null;
        this.fieldForm.reset(); // Clear form if no field is selected
      }
    });
  }

  saveField() {
    if (this.fieldForm.valid) {
      const updatedField = this.fieldForm.value;
      const fields = this.fieldService.getFields();

      const duplicate = fields.some((field, index) => 
        field.fieldName === updatedField.fieldName && index !== this.selectedFieldIndex);

      if (duplicate) {
        this.displayWarning = true;
        return; 
      }

      if (this.selectedFieldIndex !== null) {
        this.fieldService.updateField(this.selectedFieldIndex, updatedField);
      } else {
        this.fieldService.addField(updatedField);
      }
      this.fieldForm.reset();
      this.selectedFieldIndex = null; // Reset selected field index after saving
    }
  }

  initiateNewField() {
    this.fieldForm.reset(); // Clear form values
    this.selectedFieldIndex = null; // Clear selected field index
    this.fieldService.setSelectedField(null); // Clear selected field in the service
  }

  // Method to go back to the rule form
  cancel() {
    this.fieldService.showRuleForm(); // Show the rule form
    this.fieldForm.reset();
    this.selectedFieldIndex = null; // Exit edit mode
    this.fieldService.setSelectedField(null);
  }

  ngOnDestroy(): void {
    // Unsubscribe from observable to prevent memory leaks
    if (this.selectedFieldSubscription) {
      this.selectedFieldSubscription.unsubscribe();
    }
  }

  closeWarning() {
    this.displayWarning = false;
  }
}
