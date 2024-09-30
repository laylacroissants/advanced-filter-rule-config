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
  constructor() {}

  ngOnInit(): void {
    
  }
}
