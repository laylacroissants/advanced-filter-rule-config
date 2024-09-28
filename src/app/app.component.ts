import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FieldService } from './services/field.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'filter-rule-config-application';
  showFieldConfig: boolean = false;
  showRuleForm: boolean = true;

  constructor(private fieldService: FieldService) {}

  ngOnInit(): void {
    // Subscribe to visibility states
    this.fieldService.showFieldConfig$.subscribe(visible => {
      this.showFieldConfig = visible;
    });

    this.fieldService.showRuleForm$.subscribe(visible => {
      this.showRuleForm = visible;
    });
  }
}
