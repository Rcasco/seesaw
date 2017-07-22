import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Headers, Http, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { APP_CONFIG, IAppConfig } from '../../app.config';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';
const CONTROLLER_NAME = 'calculate/';

@Injectable()
export class CalculateService extends BehaviorSubject<any[]> {
    constructor(private http: Http, @Inject(APP_CONFIG) private config) {
        super([]);
        this.headers = new Headers({ 'Content-Type': 'application/json',
                                     'Accept': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
        this.serviceUrl = `${config.apiEndpoint}${CONTROLLER_NAME}`;
    }

    private serviceUrl: string;
    private headers;
    private options;

    public calculateExpenses(startDate: Date, endDate: Date) {
        return this.http
            .get(`${this.serviceUrl}?startDate=${startDate.toJSON()}&endDate=${endDate.toJSON()}`)
            .map((response) => response.json());
    }
}