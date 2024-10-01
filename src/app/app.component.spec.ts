import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RuleFormComponent } from './rule-form/rule-form.component';  // Import dependent components
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';  // Import PrimeNG dependencies
import { TableModule } from 'primeng/table';  // For p-table
import { MessageService } from 'primeng/api';
import { TradeViewComponent } from './trade-view/trade-view.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        TradeViewComponent,
        RuleFormComponent  // Declare dependent components here
      ],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        DropdownModule,
        TableModule
      ],
      providers: [MessageService]  // Add required services here
    }).compileComponents();
  });

  it('should create the component', () => {
    expect(AppComponent).toBeTruthy();
  });

});
