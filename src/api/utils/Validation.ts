import joi from '../../lib/joi';

class Validation {

    validateBody(body: any, schema: joi.Schema): any {
        const { error: errors, value } = schema.validate(body, {
            stripUnknown: true
        });
        if (errors) {
            throw {
                errors,
                type: 'REQUEST_BODY',
                validationError: true
            };
        }
        return value;
    }
}

export default new Validation();