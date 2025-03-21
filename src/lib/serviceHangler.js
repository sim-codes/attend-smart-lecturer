import { AxiosError } from "axios";

export class ServiceHandler {
    static async execute(serviceCall) {
        try {
            const response = await serviceCall();
            return { success: true, data: response.data };
        } catch (error) {
            const errorResponse = this.handleError(error);
            return { success: false, error: errorResponse };
        }
    }

    static handleError(error) {
        if (error instanceof AxiosError) {
            return {
                message: error.response?.data?.message || error.message,
                code: error.response?.status?.toString(),
                details: error.response?.data,
            }
        }

        if (error instanceof Error) {
            return {
                message: error.message,
                code: "UNKNOWN_ERROR",
            }
        }

        return {
            message: "An unexpected error occurred",
            code: "UNKNOWN_ERROR",
        }
    }
}
