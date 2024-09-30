import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { OrderListModule } from 'primeng/orderlist';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { TradeViewComponent } from './trade-view/trade-view.component';
import { RuleListComponent } from './rule-list/rule-list.component';
import { RuleFormComponent } from './rule-form/rule-form.component';
import { RuleService } from './services/rule.service';
import { FieldConfigComponent } from './field-config/field-config.component';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    RuleFormComponent,
    RuleListComponent,
    FieldConfigComponent,
    TradeViewComponent
  ],  // Declare AppComponent here
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    OrderListModule,
    DialogModule,
    InputTextModule,
    FloatLabelModule,
    DropdownModule,
    CardModule,
    TableModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    ToastModule
  ],
  providers:[RuleService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {}