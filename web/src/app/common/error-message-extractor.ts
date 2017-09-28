export class ErrorMessageExtractor {

    static extractMessage(error): string {
        if (error.error) {
            return ErrorMessageExtractor.extractMessage(error.error)
        }

        if (error.message) {
            return ErrorMessageExtractor.extractMessage(error.message);
        }

        return error;
    }
}
