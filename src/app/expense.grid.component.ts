import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { ExpenseService } from './shared/services/expense.service';
import { PersonService } from './shared/services/person.service';
import { CategoryService } from './shared/services/category.service';
import { RecurringExpenseService } from './shared/services/recurring-expense.service';

@Component({
  selector: 'expense-grid',
  templateUrl: './shared/templates/expense.grid.template.html'
})
export class ExpenseGridComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public formGroup: FormGroup;
    public categories: any[];
    public people: any[];

    private editedRowIndex: number;

    constructor(private editService: ExpenseService,
                private personService: PersonService,
                private categoryService: CategoryService,
                private recurringExpenseService: RecurringExpenseService) {
    }

    public ngOnInit(): void {
        this.view = this.editService.map(data => process(data, this.gridState));
        this.editService.read();
        this.getCategories();
        this.getPeople();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.editService.read();
    }

    protected addHandler({sender}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(0),
            'name': new FormControl("", Validators.required),
            'amount': new FormControl("", Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,4}')])),
            'shared': new FormControl(true),
            'issuedDate': new FormControl(new Date()),
            'personId': new FormControl(1),
            'categoryId': new FormControl(""),
            'recurringExpenseId': new FormControl(""),
        });

        sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(dataItem.id),
            'name': new FormControl(dataItem.name, Validators.required),
            'amount': new FormControl(dataItem.amount, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
            'shared': new FormControl(dataItem.shared),
            'issuedDate': new FormControl(new Date(dataItem.issuedDate)),
            'personId': new FormControl(dataItem.personId),
            'categoryId': new FormControl(dataItem.categoryId),
            'recurringExpenseId': new FormControl(dataItem.recurringExpenseId)
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

        this.editService.save(product, isNew);

        sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.editService.remove(dataItem);
    }

    public getCategory(id: number): any {
        if(this.categories == null)
        {
            return "";
        }
        return this.categories.find(x => x.id === id);
    }

    public getCategories(): any {
        return this.categoryService.getAllCategories()
            .subscribe(res => this.categories = res);
    }

    public getPerson(id: number): any {
        if(this.people) {
            return this.people.find(x => x.id === id);
        }
        else {
            return "";
        }
    }

    public getPeople(): any {
        return this.personService.getAllPeople()
            .subscribe(res => this.people = res);
    }
}

