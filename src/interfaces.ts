import {ReplaySubject} from 'rxjs/ReplaySubject';

export interface ICustomFile extends File {
    errors?: {[key: string]: any};
    imgSrc?: string;
    imgHeight?: number;
    imgWidth?: number;
    isImg?: boolean;
    imgLoadReplay?: ReplaySubject<[Event, ProgressEvent]>;
    textContent?: string;
    textLoadReplay?: ReplaySubject<[Event, ProgressEvent]>;
}