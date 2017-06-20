import {Injectable} from '@angular/core';

@Injectable()
export class VenuesTreeViewService {

    constructor() { }

    loadVenues() {
        return [
            {
                id: "d79a61c0-54f1-11e7-933b-27af3148f6e5",
                name: "Hakkasan Miami",
                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                children: [
                    {
                        name: "Touch",
                        content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                        children: [
                            {
                                name: "A",
                                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            },
                            {
                                name: "B",
                                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            }
                        ]
                    }
                ],
                _rev: 0
            },
            {
                id: "d79a61c0-11e7-933b-27af3148f6e5",
                name: "Citizens Miami",
                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                children: [
                    {
                        name: "Touch",
                        content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                        children: [
                            {
                                name: "A",
                                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            },
                            {
                                name: "B",
                                content_id: "a21d2630-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            }
                        ]
                    },
                    {
                        name: "Deli",
                        children: [
                            {
                                name: "A",
                                content_id: "a68c4020-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            },
                            {
                                name: "B",
                                content_id: "a68c4020-550b-11e7-ac75-612b6c01e03d",
                                hasChildren: false
                            }
                        ]
                    }
                ],
                _rev: 0
            }
        ]
    }
}
