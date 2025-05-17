import { City } from '../../../types/rentalOffer.js';
import { ParamsDictionary } from 'express-serve-static-core';

export type ParamCity =
  | {
      city: City;
    }
  | ParamsDictionary;
