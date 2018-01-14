import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { APP_CONFIG, IAppConfig } from '../../app.config';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';
const CONTROLLER_NAME = 'expenseIt/';

@Injectable()
export class ExpenseService extends BehaviorSubject<any[]> {
    constructor(private http: Http, @Inject(APP_CONFIG) private config) {
        super([]);
        this.headers = new Headers({ 'Content-Type': 'application/json',
                                     'Accept': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
        this.serviceUrl = `${config.apiEndpoint}${CONTROLLER_NAME}`;
    }

    private data: any[] = [];
    private serviceUrl: string;
    private headers;
    private options;
    private errorMessage;
    

    public read() {
        if (this.data.length) {
            return super.next(this.data);
        }

        this.fetch()
            .do(data => this.data = data)
            .subscribe(data => {
                super.next(data);
            });
    }

    public save(data: any, isNew?: boolean) {
        const action = isNew ? CREATE_ACTION : UPDATE_ACTION;

        this.reset();

        this.createOrUpdate(action, data)
            .subscribe(() => this.read(), () => this.read());
    }

    public remove(data: any) {
        this.reset();

        this.delete(data.id)
            .subscribe(() => this.read(), () => this.read());
    }

    public resetItem(dataItem: any) {
        if (!dataItem) { return; }

        //find orignal data item
        const originalDataItem = this.data.find(item => item.id === dataItem.id);

        //revert changes
        Object.assign(originalDataItem, dataItem);

        super.next(this.data);
    }

    private reset() {
        this.data = [];
    }

    private fetch(action: string = "", data?: any): Observable<any[]>  {
        return this.http
            .get(this.serviceUrl)
            .map((response) =>             
            {
                let test = response.json() as any[];
                return test;
            });
    }

    private createOrUpdate(action: string = "", data?: any): any  {
        if(action === UPDATE_ACTION) {
           return this.http
                .put(this.serviceUrl, `${this.serializeModels(data)}`, this.options);
        }
        else {
            return this.http
                .post(this.serviceUrl, `${this.serializeModels(data)}`, this.options);
        }
    }

    private delete(id: any) {
        return this.http
                .delete(`${this.serviceUrl}${id}`, this.options);
    }

    private serializeModels(data?: any): string {
       return data ? `${JSON.stringify(data)}` : '';
    }
}
