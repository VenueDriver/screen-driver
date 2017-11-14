import {Component, Inject} from '@angular/core';
import {AuthService} from "./auth/auth.service";
import {TitleService} from "./shared/services/title.service";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass']
})
export class AppComponent {

    title = 'app';

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                @Inject(DOCUMENT) private document: any,
                private authService: AuthService,
                private titleService: TitleService) { }

    ngOnInit() {
        this.setPageTitle();
    }

    isSidebarDisplayed(): boolean {
        return this.authService.isCurrentPath('/content');
    }

    private setPageTitle() {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.getChildRoute(this.activatedRoute))
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.data)
            .subscribe((event) => this.titleService.setTitle(this.document, event['title']));
    }

    private getChildRoute(route: ActivatedRoute) {
        while (route.firstChild) route = route.firstChild;
        return route;
    }
}
