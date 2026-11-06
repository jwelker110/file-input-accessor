import {ChangeDetectionStrategy, Component} from '@angular/core';

import {FileFormComponent} from './components/file-form/file-form.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FileFormComponent]
})
export class AppComponent {
    title = 'FileInputAccessorDemo';
}
