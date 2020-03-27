import joi from '../../lib/joi';
import {
  CarpetType,
  CarpetSupplier,
  CarpetMaterial,
  Branch
} from '../../common/enums';

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
  material: joi
    .string()
    .trim()
    .required()
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
          otherwise: joi.valid(CarpetMaterial.WoolAndViscose)
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
    .uppercase()
    .valid(...Object.values(CarpetSupplier)),
  type: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(CarpetType)),
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
          otherwise: joi.valid(CarpetMaterial.WoolAndViscose)
        })
      })
    })
});

const SELL_CARPET = joi.object({
  finalPricePerSquareMeter: joi.number().required()
});

export { ADD_CARPET, UPDATE_CARPET, SELL_CARPET };
