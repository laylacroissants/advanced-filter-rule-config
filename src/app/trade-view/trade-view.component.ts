import { Component } from '@angular/core';
import { mockData } from '../mock-data';
import { Field, Rule } from '../model';
import { FieldService } from '../services/field.service';
import { Subscription } from 'rxjs';

interface Column {
  field: string;
  header: string;
}

interface TradeData {
  tradeNumber: string
  portfolio: string,
  counterparty: string,
  price: number
}

@Component({
  selector: 'app-trade-view',
  templateUrl: './trade-view.component.html',
  styleUrl: './trade-view.component.scss'
})
export class TradeViewComponent {
  originalTradeData: TradeData[] = [];  // Store original unfiltered data
  tradeData: TradeData[] = []
  cols!: Column[];
  tableLoading: boolean = false;
  selectedFilter!: Rule;

  filterConfig = [
    { fieldName: 'Trade Number', fieldType: 'text', field: "tradeNumber" },
    { fieldName: 'Portfolio', fieldType: 'text', field: "portfolio" },
    { fieldName: 'Counterparty', fieldType: 'text', field: "counterparty" },
    { fieldName: 'Price', fieldType: 'number', field: "price" }
  ];


  constructor(private fieldService: FieldService) {}
  ngOnInit() {
      this.cols = this.filterConfig.map((field: Field): Column => {
        return {
          field: field.field,     
          header: field.fieldName  
        };
      });
    this.originalTradeData = mockData

    this.tradeData = [...this.originalTradeData];
  }

  onFilterApplied(event: { loading: boolean, filter: any }) {
    this.tableLoading = event.loading; // Set loading state
    this.selectedFilter = event.filter; // Set the selected filter
    console.log(this.selectedFilter)

    if (!event.loading) {
      this.applyFilter(); // Call your filter logic when loading finishes
    }
  }

  applyFilter() {
    // Create a deep copy of the original tradeData before filtering
    let filteredData = JSON.parse(JSON.stringify(this.originalTradeData));  // Deep copy of original data
  
    if (this.selectedFilter && this.selectedFilter.rules) {
      this.selectedFilter.rules.forEach(rule => {
        const fieldName = rule.field.field as keyof TradeData; 
        const condition = rule.condition;
        const value = rule.value;
        const startValue = rule.startValue;
        const endValue = rule.endValue;
  
        // Apply filter based on the field type
        filteredData = filteredData.filter((item: TradeData) => {
          const fieldValue = item[fieldName]; 
  
          if (typeof fieldValue === 'string') {
            if (condition === 'contains') {
              return fieldValue.toLowerCase().includes(value.toLowerCase());
            } else if (condition === 'startsWith') {
              return fieldValue.toLowerCase().startsWith(value.toLowerCase());
            } else if (condition === 'endsWith') {
              return fieldValue.toLowerCase().endsWith(value.toLowerCase());
            } else if (condition === 'is') {
              return fieldValue.toLowerCase() === value.toLowerCase();
            } else if (condition === 'notContains') {
              return !fieldValue.toLowerCase().includes(value.toLowerCase());  
            }
          } else if (typeof fieldValue === 'number') {
            const numValue = parseFloat(value);
            const start = parseFloat(startValue);
            const end = parseFloat(endValue); 
            if (condition === 'greaterThan') {
              return fieldValue > numValue;
            } else if (condition === 'lessThan') {
              return fieldValue < numValue;
            } else if (condition === 'equals') {
              return fieldValue === numValue;
            } else if (condition === 'range') {
              return fieldValue >= start && fieldValue <= end; 
            }
          }
          return false; 
        });
      });
    }
    this.tradeData = filteredData;
  }
}
