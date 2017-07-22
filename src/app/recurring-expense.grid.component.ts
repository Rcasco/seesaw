import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { RecurringExpenseService } from './shared/services/recurring-expense.service';
import { PersonService } from './shared/services/person.service';
import { FrequencyService } from './shared/services/frequency.service';

@Component({
  selector: 'recurring-expense-grid',
  templateUrl: './shared/templates/recurring-expense.grid.template.html'
})
export class RecurringExpenseGridComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public formGroup: FormGroup;
    public people: any[];
    public frequencies: any[];   

    private editedRowIndex: number;

    constructor(private recurringExpenseService: RecurringExpenseService,
                private personService: PersonService,
                private frequencyService: FrequencyService) {
    }

    public ngOnInit(): void {
        this.view = this.recurringExpenseService.map(data => process(data, this.gridState));
        this.recurringExpenseService.read();
        this.getPeople();
        this.getFrequencies();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.recurringExpenseService.read();
    }

    protected addHandler({sender}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(0),
            'name': new FormControl("", Validators.required),
            'amount': new FormControl("", Validators.required),
            'covered': new FormControl(true),
            'personId': new FormControl(1),
            'frequencyId': new FormControl(1)
        });

        sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(dataItem.id),
            'name': new FormControl(dataItem.name, Validators.required),
            'amount': new FormControl(dataItem.amount, Validators.required),
            'covered': new FormControl(dataItem.covered),
            'personId': new FormControl(dataItem.personId),
            'frequencyId': new FormControl(dataItem.frequencyId)
        });

        this.editedRowIndex = rowIndex;

        sender.editRow(rowIndex, this.formGroup);
    }

    protected cancelHandler({sender, rowIndex}) {
        this.closeEditor(sender, rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
        grid.closeRow(rowIndex);
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
        const product: any = formGroup.value;

        this.recurringExpenseService.save(product, isNew);

        sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.recurringExpenseService.remove(dataItem);
    }

    public getPerson(id: number): any {
        return this.people.find(x => x.id === id);
    }

    public getPeople(): any {
        return this.personService.getAllPeople()
            .subscribe(res => this.people = res);
    }

    public getFrequency(id: number): any {
        return this.frequencies.find(x => x.id === id);
    }

    public getFrequencies(): any {        
        return this.frequencyService.getAllFrequencies()
            .subscribe(res => this.frequencies = res);
    }
}

