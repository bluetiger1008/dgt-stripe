"use strict";

import graph from "fbgraph";
import Stripe from 'stripe';
import { Response, Request, NextFunction } from "express";
import { UserDocument } from "../models/User";

const stripe = new Stripe('sk_test_shIITIcHkGCReXXxcnu7VkXv00D8MkHMhN', {
    apiVersion: '2020-08-27',
});
/**
 * List of API examples.
 * @route GET /api
 */
export const getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

/**
 * Facebook API example.
 * @route GET /api/facebook
 */
export const getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserDocument;
    const token = user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
    const params: Stripe.CustomerCreateParams = {
      description: 'test customer',
    };
  
    const customer: Stripe.Customer = await stripe.customers.create(params);
  
    res.send(customer);
};

export const createCharge = async (req: Request, res: Response, next: NextFunction) => {
    const params: Stripe.ChargeCreateParams = {
      amount: 2000,
      currency: 'usd',
      source: 'tok_amex',
      description: 'My First Test Charge (created for API docs)',
    };
  
    const charge: Stripe.Charge = await stripe.charges.create(params);
  
    res.send(charge);
};