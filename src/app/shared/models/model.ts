export class Expense {
    public id: number;
    public name: string = "";
    public shared: boolean = true;
    public unitsInStock: number;
    public issuedDate: string = new Date().toDateString();
    public person: Person = new Person();
    public category: Category = new Category();
    public sharedExpense: SharedExpense = new SharedExpense();
}

export class Person {
    public id: number;
    public name: string = "";
}

export class Category {
    public id: number;
    public name: string = "";
}

export class SharedExpense {
    public id: number;
    public name: string = "";
}