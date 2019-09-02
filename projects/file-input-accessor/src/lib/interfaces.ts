import {ReplaySubject} from 'rxjs';

export interface ICustomFile extends File {
    errors?: {
        imageWidth?: boolean,
        imageHeight?: boolean,
        maxWidth?: boolean,
        maxHeight?: boolean,
        minWidth?: boolean,
        minHeight?: boolean,
        fileSize?: boolean,
        fileType?: boolean,
        fileExt?: boolean
    };
    imgSrc?: string;
    imgHeight?: number;
    imgWidth?: number;
    isImg?: boolean;
    imgLoadReplay?: ReplaySubject<[Event, ProgressEvent]>;
    textContent?: string;
    textLoadReplay?: ReplaySubject<ProgressEvent>;
}