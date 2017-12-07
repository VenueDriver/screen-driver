import {EventTimeHolder} from "../../event-time/event-time.holder";

export class EventTimeHolderFixture {

    static getEventTimeHolderInstance(): EventTimeHolder {
        let eventTimeHolder = EventTimeHolder.init();
        let eventDate = new Date(2017, 0, 1);
        eventTimeHolder.value().startDate = eventDate;
        eventTimeHolder.value().endDate = eventDate;
        return eventTimeHolder;
    }
}
