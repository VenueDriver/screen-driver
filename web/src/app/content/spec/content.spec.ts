import {Content} from "../content";
import {ContentFixture} from "./fixtures/content.fixture";

describe('Model: Content', () => {

    describe('constructor', () => {

       describe('when called with content', () => {
           it('should initiate new content with appropriate fields', () => {
               let content = ContentFixture.getContent('contentId');
               let initiatedContent = new Content(content);

               expect(initiatedContent).toEqual(content);
           });
       });

        describe('when called without parameters', () => {
            it('should initiate new empty content', () => {
                let initiatedContent = new Content();

                expect(initiatedContent.id).toEqual('');
                expect(initiatedContent.short_name).toEqual('');
                expect(initiatedContent.url).toEqual('');
            });
        });

    });

    describe('validate()', () => {
        const content = ContentFixture.getContent();

        describe('when URL and short name are valid', () => {
            it('should return true', () => {
                let result = Content.validate(content);

                expect(result).toBeTruthy();
            });
        });

        describe('when URL is valid and short name is invalid', () => {
            it('should return false', () => {
                content.short_name = '';

                let result = Content.validate(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when URL is invalid and short name is valid', () => {
            it('should return false', () => {
                content.url = '';

                let result = Content.validate(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when URL and short name are invalid', () => {
            it('should return false', () => {
                content.short_name = '';
                content.url = '';

                let result = Content.validate(content);

                expect(result).toBeFalsy();
            });
        });

    });

    describe('isUrlValid()', () => {

        describe('when content URL is empty', () => {
            it('should return false', () => {
                const content = ContentFixture.getContent();
                content.url = '';

                let result = Content.isUrlValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when content URL is null', () => {
            it('should return false', () => {
                const content = ContentFixture.getContent();
                content.url = null;

                let result = Content.isUrlValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when content URL is not matched pattern', () => {
            const content = ContentFixture.getContent();

            describe('when URL without domain', () => {
                it('should return false', () => {
                    content.url = 'content';

                    let result = Content.isUrlValid(content);

                    expect(result).toBeFalsy();
                });
            });

            describe('when URL with short domain', () => {
                it('should return false', () => {
                    content.url = 'content.c';

                    let result = Content.isUrlValid(content);

                    expect(result).toBeFalsy();
                });
            });
        });

        describe('when URL is not empty and matched pattern', () => {
            it('should return true', () => {
                const content = ContentFixture.getContent();

                let result = Content.isUrlValid(content);

                expect(result).toBeTruthy();
            });
        });

    });

    describe('isShortNameValid()', () => {
        const content = ContentFixture.getContent();

        describe('when short name is empty', () => {
            it('should return false', () => {
                content.short_name = '';

                let result = Content.isShortNameValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when short name is null', () => {
            it('should return false', () => {
                content.short_name = null;

                let result = Content.isShortNameValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when short name contains 3 characters', () => {
            it('should return false', () => {
                content.short_name = 'xxx';

                let result = Content.isShortNameValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when short name contains 3 characters with space', () => {
            it('should return false', () => {
                content.short_name = 'xxx ';

                let result = Content.isShortNameValid(content);

                expect(result).toBeFalsy();
            });
        });

        describe('when short name is not empty and contains 4 characters', () => {
            it('should return true', () => {
                content.short_name = 'name';

                let result = Content.isShortNameValid(content);

                expect(result).toBeTruthy();
            });
        });

    });

    describe('getShortUrl()', () => {
        const content = ContentFixture.getContent();

        describe('when URL is empty', () => {
            it('should return empty string', () => {
                content.url = '';

                let result = Content.getShortUrl(content, 50);

                expect(result).toBe('');
            });
        });

        describe('when URL length is shorter then max length', () => {
            it('should return original string', () => {
                content.url = 'content.com';

                let result = Content.getShortUrl(content, 16);

                expect(result).toBe(content.url);
            });
        });

        describe('when URL length is equal to max length', () => {
            it('should return original string', () => {
                content.url = 'very-very-very-long-content-url.com';

                let result = Content.getShortUrl(content, 35);

                expect(result).toBe(content.url);
            });
        });

        describe('when URL length is longer then max length by 2 characters', () => {
            it('should return original string', () => {
                content.url = 'very-very-very-long-content-url.com';

                let result = Content.getShortUrl(content, 33);

                expect(result).toBe(content.url);
            });
        });

        describe('when URL length is longer then max length by 5 characters', () => {
            it('should return original string', () => {
                content.url = 'very-very-very-very-long-content-url.com';

                let result = Content.getShortUrl(content, 30);

                expect(result).toBe('very-very-very-very-long-...l.com');
            });
        });

    });

});
