import { errorResponse } from "../utils/response";

const validate = (schema, request) => {
    const result = schema.validate(request);
    if (result.error) {
        throw new errorResponse(400, result.error.details[0].message);
    } else{
        return result.value;
    }
}

export { validate }