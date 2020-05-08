import joi from '../../lib/joi';
import {
  CarpetType,
  CarpetSupplier,
  CarpetMaterial,
  Branch,
  CarpetKnot,
  CarpetColor
} from '../../common/enums';
import { CarpetLocation } from '../../common/enums/CarpetLocation';

const ADD_CARPET = joi.object({
  width: joi.number().required(),
  length: joi.number().required(),
  pricePerSquareMeter: joi.number().required(),
  imageUrl: joi.string().trim(),
  branch: joi
    .string()
    .trim()
    .valid(...Object.values(Branch))
    .required(),
  supplier: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetSupplier))
    .required(),
  type: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetType))
    .required(),
  location: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetLocation)),
  knot: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetKnot))
    .required(),
  color: joi.object({
    primary: joi.array().items(
      joi
        .string()
        .trim()
        .valid(...Object.values(CarpetColor))
    ),
    secondary: joi
      .string()
      .trim()
      .required()
  }),
  material: joi
    .string()
    .trim()
    .required()
    .when('type', {
      is: CarpetType.Classic,
      then: joi.valid(
        CarpetMaterial.Wool,
        CarpetMaterial.WoolAndSilk,
        CarpetMaterial.WoolAndBamboSilk,
        CarpetMaterial.Silk
      ),
      otherwise: joi.when('type', {
        is: CarpetType.Contemporary,
        then: joi.valid(
          CarpetMaterial.WoolAndBamboSilk,
          CarpetMaterial.WoolAndSilk
        ),
        otherwise: joi.when('type', {
          is: CarpetType.Modern,
          then: joi.valid(
            CarpetMaterial.WoolAndBamboSilk,
            CarpetMaterial.WoolAndSilk,
            CarpetMaterial.WoolAndSariSilk,
            CarpetMaterial.Silk
          ),
          otherwise: joi.valid(
            CarpetMaterial.WoolAndViscose,
            CarpetMaterial.WoolAndBamboSilk
          )
        })
      })
    })
});

const UPDATE_CARPET = joi.object({
  width: joi.number(),
  length: joi.number(),
  pricePerSquareMeter: joi.number(),
  finalPricePerSquareMeter: joi.number(),
  imageUrl: joi.string().trim(),
  supplier: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetSupplier)),
  type: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetType)),
  location: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetLocation)),
  knot: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetKnot)),
  color: joi.object({
    primary: joi.array().items(
      joi
        .string()
        .trim()
        .valid(...Object.values(CarpetColor))
    ),
    secondary: joi.string().trim()
  }),
  material: joi
    .string()
    .trim()
    .when('type', {
      is: CarpetType.Classic,
      then: joi.valid(
        CarpetMaterial.Wool,
        CarpetMaterial.WoolAndSilk,
        CarpetMaterial.WoolAndBamboSilk
      ),
      otherwise: joi.when('type', {
        is: CarpetType.Contemporary,
        then: joi.valid(
          CarpetMaterial.WoolAndBamboSilk,
          CarpetMaterial.WoolAndSilk
        ),
        otherwise: joi.when('type', {
          is: CarpetType.Modern,
          then: joi.valid(
            CarpetMaterial.WoolAndBamboSilk,
            CarpetMaterial.WoolAndSilk,
            CarpetMaterial.WoolAndSariSilk
          ),
          otherwise: joi.when('type', {
            is: CarpetType.Kilim,
            then: joi.valid(
              CarpetMaterial.Wool,
              CarpetMaterial.Cotton,
              CarpetMaterial.WoolAndCotton
            ),
            otherwise: joi.when('type', {
              is: CarpetType.Platonic,
              then: joi.valid(CarpetMaterial.Wool, CarpetMaterial.Viscose),
              otherwise: joi.valid(CarpetMaterial.WoolAndViscose)
            })
          })
        })
      })
    })
});

const SELL_CARPET = joi.object({
  finalPricePerSquareMeter: joi.number().required(),
  client: joi.objectId().required()
});

export { ADD_CARPET, UPDATE_CARPET, SELL_CARPET };
