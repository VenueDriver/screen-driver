const DEFAULT_NAME = 'spinner';

export class SpinnerName {

    static getName(entity: any = {}, spinnerPrefix: string = '') {
        if (!entity || !entity.id) return DEFAULT_NAME;

        let spinnerName = `${DEFAULT_NAME}-${entity.id}`;

        return spinnerPrefix ? `${spinnerPrefix}-${spinnerName}` : spinnerName
    }
}
