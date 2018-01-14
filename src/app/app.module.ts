/* Angular Imports */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
/* Kendo Module Imports */
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerModule } from '@progress/kendo-angular-dateinputs';
/* Component Imports */
import { AppComponent } from './app.component';
import { ExpenseGridComponent } from './expense.grid.component';
import { CategoryGridComponent } from './category.grid.component';
import { RecurringExpenseGridComponent } from './recurring-expense.grid.component';
import { CalculateComponent } from './calculate.component';
/* Service Imports */
import { ExpenseService } from './shared/services/expense.service';
import { PersonService } from './shared/services/person.service';
import { CategoryService } from './shared/services/category.service';
import { RecurringExpenseService } from './shared/services/recurring-expense.service';
import { FrequencyService } from './shared/services/frequency.service';
import { CalculateService } from './shared/services/calculate.service';
/* Config Imports */
import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
    declarations: [
        AppComponent, ExpenseGridComponent, CategoryGridComponent,
        RecurringExpenseGridComponent, CalculateComponent
    ],
    imports: [
        HttpModule, BrowserModule, BrowserAnimationsModule,
        ReactiveFormsModule, GridModule, DropDownsModule,
        TabStripModule, ButtonsModule, DatePickerModule
    ],
    providers: [
        ExpenseService, PersonService, CategoryService,
        RecurringExpenseService, FrequencyService,
        CalculateService,
        { provide: APP_CONFIG, useValue: AppConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}