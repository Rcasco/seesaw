import { Observable } from 'rxjs/Rx';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

import { CategoryService } from './shared/services/category.service';

@Component({
  selector: 'category-grid',
  templateUrl: './shared/templates/category.grid.template.html'
})
export class CategoryGridComponent implements OnInit {
    public view: Observable<GridDataResult>;
    public gridState: State = {
        sort: [],
        skip: 0,
        take: 10
    };
    public formGroup: FormGroup;
    public categories: any[];

    private editedRowIndex: number;

    constructor(private categoryService: CategoryService) {
    }

    public ngOnInit(): void {
        this.view = this.categoryService.map(data => process(data, this.gridState));
        this.categoryService.read();
    }

    public onStateChange(state: State) {
        this.gridState = state;

        this.categoryService.read();
    }

    protected addHandler({sender}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(0),
            'name': new FormControl("", Validators.required)
        });

        sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
        this.closeEditor(sender);

        this.formGroup = new FormGroup({
            'id': new FormControl(dataItem.id),
            'name': new FormControl(dataItem.name, Validators.required)
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

        this.categoryService.save(product, isNew);

        sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.categoryService.remove(dataItem);
    }
}

