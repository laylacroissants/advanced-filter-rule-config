import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeViewComponent } from './trade-view.component';
import { TableModule } from 'primeng/table';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TradeViewComponent', () => {
  let component: TradeViewComponent;
  let fixture: ComponentFixture<TradeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TradeViewComponent],
      imports: [TableModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // it('should display loading spinner when tableLoading is true', () => {
  //   component.tableLoading = true; // Trigger loading state
  //   fixture.detectChanges();  // Apply the changes
  
  //   const loadingElement = fixture.nativeElement.querySelector('.custom-spinner');
  //   expect(loadingElement).toBeTruthy();  // Check if the spinner is present
  // });

  it('should display correct number of rows in the table', () => {
    component.tradeData = [
      { tradeNumber: '001', portfolio: 'Company A Fund', counterparty: 'SG Bank', price: 1500 },
      { tradeNumber: '002', portfolio: 'Company B Assets', counterparty: 'JP Bank6', price: 2000 }
    ];
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr');
    expect(rows.length).toBe(3); // 1 header row + 2 data rows
  });

  it('should update the table data when filtered data is applied', () => {
    const mockFilteredData = [
      { tradeNumber: '001', portfolio: 'Company A Fund', counterparty: 'SG Bank', price: 1500 }
    ];
    component.tradeData = mockFilteredData;
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tr');
    expect(rows.length).toBe(2); // 1 header row + 1 data row
  });
});
