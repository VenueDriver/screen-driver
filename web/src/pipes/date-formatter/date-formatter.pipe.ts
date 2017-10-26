import {Pipe, PipeTransform} from "@angular/core";
import {format} from 'date-fns'

@Pipe({
    name: 'format'
})
export class DateFormatterPipe implements PipeTransform {

    transform(date: Date|string): string {
        if (typeof date === 'string' && isNaN(Date.parse(date))) {
            return "";
        }
        return format(date, 'MMM D, YYYY [at] hh:mm A');
    }
}
