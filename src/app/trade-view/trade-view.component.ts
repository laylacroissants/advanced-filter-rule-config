import { Component } from '@angular/core';
import { mockData } from '../mock-data';
import { Field } from '../model';
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
  tradeData: TradeData[] = []
  cols!: Column[];

  filterConfig = [
    { fieldName: 'Trade Number', fieldType: 'text', field: "tradeNumber" },
    { fieldName: 'Portfolio', fieldType: 'text', field: "portfolio" },
    { fieldName: 'Counterparty', fieldType: 'text', field: "counterparty" },
    { fieldName: 'Price', fieldType: 'number', field: "price" }
  ];

  private fieldsSubscription: Subscription | undefined;

  constructor(private fieldService: FieldService) {}

  ngOnInit() {
      this.cols = this.filterConfig.map((field: Field): Column => {
        return {
          field: field.field,       // Assign 'field' to 'field' property of Column
          header: field.fieldName   // Assign 'fieldName' to 'header' property of Column
        };
      });
    this.tradeData = mockData
  }
}
