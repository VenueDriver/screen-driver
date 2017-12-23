import * as _ from 'lodash';
import {ContentService} from "../content.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TestBed} from "@angular/core/testing";
import {ApiService} from "../../shared/services/api.service";
import {SpinnerService} from "../../shared/spinner/spinner.service";
import {DataLoadingMonitorService} from "../../shared/services/data-loading-monitor/data-loading-monitor.service";
import {ContentFixture} from "./fixtures/content.fixture";
import {Observable} from "rxjs/Observable";

describe('Service: ContentService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
            ],
            providers: [
                ContentService,
                ApiService,
                SpinnerService,
                HttpClient,
                DataLoadingMonitorService,
            ]
        });

        this.contentService = TestBed.get(ContentService);
        this.apiService = TestBed.get(ApiService);
    });

    describe('getContent()', () => {

        describe('when called', () => {
            it('should call GET /api/content', () => {
                spyOn(this.apiService, 'get');

                this.contentService.getContent();

                expect(this.apiService.get).toHaveBeenCalledWith('/api/content');
            });

            it('should return observable of content list', () => {
                const contentList = ContentFixture.getContentList(3);
                spyOn(this.apiService, 'get').and.returnValue(Observable.of(contentList));

                this.contentService.getContent().subscribe((response) => {
                    expect(response.length).toBe(3);
                    expect(response[0].id).toBe(contentList[0].id);
                    expect(response[1].id).toBe(contentList[1].id);
                    expect(response[2].id).toBe(contentList[2].id);
                });
            });
        });

        describe('when called and server respond with an error', () => {
            it('should return observable with an error', () => {
                spyOn(this.apiService, 'get').and.returnValue(Observable.throw({status: 403, error: 'ERROR'}));

                this.contentService.getContent().subscribe(
                    (response) => {
                        expect(response).toBeNull();
                    },
                    (error) => {
                        expect(error).toEqual({status: 403, error: 'ERROR'});
                    }
                );
            });
        });

    });

    describe('createContent()', () => {

        describe('when called with content', () => {
            const content = ContentFixture.getContent();
            const createContent = _.clone(content);
            createContent.id = 'contentId';

            it('should call POST /api/content with content', () => {
                spyOn(this.apiService, 'post');

                this.contentService.createContent(content);

                expect(this.apiService.post).toHaveBeenCalledWith('/api/content', content);
            });

            it('should return observable of created content', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(createContent));

                this.contentService.createContent(content).subscribe((response) => {
                    expect(response).toEqual(createContent);
                });
            });
        });

        describe('when called with content and server respond with an error', () => {
            it('should return observable with an error', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.throw({status: 403, error: 'ERROR'}));

                this.contentService.createContent(ContentFixture.getContent()).subscribe(
                    (response) => {
                        expect(response).toBeNull();
                    },
                    (error) => {
                        expect(error).toEqual({status: 403, error: 'ERROR'});
                    }
                );
            });
        });

    });

    describe('updateContent()', () => {

        describe('when called with content', () => {
            const content = ContentFixture.getContent('contentId');

            it('should call PUT /api/content/contentId with content', () => {
                spyOn(this.apiService, 'put');

                this.contentService.updateContent(content);

                expect(this.apiService.put).toHaveBeenCalledWith('/api/content/contentId', content);
            });

            it('should return observable of updated content', () => {
                spyOn(this.apiService, 'post').and.returnValue(Observable.of(content));

                this.contentService.updateContent(content).subscribe((response) => {
                    expect(response).toEqual(content);
                });
            });
        });

        describe('when called with content and server respond with an error', () => {
            it('should return observable with an error', () => {
                spyOn(this.apiService, 'put').and.returnValue(Observable.throw({status: 403, error: 'ERROR'}));

                this.contentService.updateContent(ContentFixture.getContent()).subscribe(
                    (response) => {
                        expect(response).toBeNull();
                    },
                    (error) => {
                        expect(error).toEqual({status: 403, error: 'ERROR'});
                    }
                );
            });
        });

    });

    describe('pushContentUpdateEvent', () => {

        describe('when called', () => {
            it('contentUpdate be triggered with undefined', () => {
                this.contentService.pushContentUpdateEvent();

                this.contentService.getContentUpdateSubscription().subscribe((result) => {
                    expect(result).toBeUndefined();
                });
            });
        });

    });

});
