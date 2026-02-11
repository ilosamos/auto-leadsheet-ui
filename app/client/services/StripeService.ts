/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CheckoutSessionResponse } from '../models/CheckoutSessionResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StripeService {
    /**
     * Create Checkout Session
     * Create a Stripe Checkout session and redirect to it.
     * @returns CheckoutSessionResponse Successful Response
     * @throws ApiError
     */
    public static createCheckoutSessionStripeCheckoutPost({
        tier = 'low',
    }: {
        tier?: string,
    }): CancelablePromise<CheckoutSessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stripe/checkout',
            query: {
                'tier': tier,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stripe Webhook
     * Handle Stripe webhook events for Checkout completion.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static stripeWebhookStripeWebhookPost(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/stripe/webhook',
        });
    }
}
