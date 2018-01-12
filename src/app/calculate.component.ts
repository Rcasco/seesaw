import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CalculateService } from './shared/services/calculate.service';
import { PersonService } from './shared/services/person.service';

@Component({
  selector: 'calculate-component',
  templateUrl: './shared/templates/calculate.component.html'
})
export class CalculateComponent {
    constructor(private calculateService: CalculateService,
                private personService: PersonService) {
    }

    public ngOnInit(): void {
        this.calculateExpenses();
        this.getPeople();
    }

    calculateStart = new FormGroup ({
      name: new FormControl()
    });
    public startDate: Date = new Date();
    public endDate: Date = new Date();

    private calculations;
    private total;
    public people: any[];

    protected clickHandler() {
        this.calculateExpenses();
    }

    public calculateExpenses(): any {
        return this.calculateService.calculateExpenses(this.startDate, this.endDate)
            .subscribe(res => 
            {
                this.calculations = res.perPersonCalculations;
                this.total = res.totalExpenses;
            });
    }

    public getPerson(id: number): any {
        if(this.people == null) {
            return "";
        }
        return this.people.find(x => x.id === id);
    }

    public getPeople(): any {
        return this.personService.getAllPeople()
            .subscribe(res => this.people = res);
    }

    public divideIndividualExpenses(person) {
        if(this.calculations == null) {
            return "";
        }
        let expenses = this.calculations.filter(function(calculation) {
            return person.id === calculation.personId;
        });
        return expenses[0].total / (this.people.length);
    }

    public calculateDebt(person, otherPerson) {
        if(this.calculations == null) {
            return "";
        }
        let personExpenses = this.calculations.filter(function(calculation) {
            return person.id === calculation.personId;
        });
        let otherPersonExpenses = this.calculations.filter(function(calculation) {
            return otherPerson.id === calculation.personId;
        });
        let difference: number = (personExpenses[0].total / 2) - (otherPersonExpenses[0].total / 2);
        return difference < 0 ? Math.abs(difference) : 0;
    }

    public getEveryoneButMe(me: any) {
        return this.people.filter(function(person) {
            return person.id !== me.id;
        });
    }

    public getFirstPersonNotMe(me: any) {
        return this.people.filter(function(person) {
            return person.id !== me.id;
        })[0];
    }
}
