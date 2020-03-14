import joi from '../../lib/joi';
import {
  CarpetType,
  CarpetSupplier,
  CarpetMaterial,
  Branch
} from '../../common/enums';

const GET_CARPETS_BY_BRANCH = joi.object({
  branch: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Branch))
    .required()
});

const ADD_CARPET = joi.object({
  size: joi.number().required(),
  pricePerSquareMeter: joi.number().required(),
  imageUrl: joi.string().trim(),
  branch: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Branch))
    .required(),
  supplier: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(CarpetSupplier))
    .required(),
  type: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(CarpetType))
    .required(),
  material: joi.when('type', {
    is: CarpetType.Classic,
    then: joi
      .string()
      .trim()
      .valid([
        CarpetMaterial.Wool,
        CarpetMaterial.WoolAndSilk,
        CarpetMaterial.WoolAndBamboSilk
      ])
      .required(),
    otherwise: joi.when('type', {
      is: CarpetType.Contemporary,
      then: joi
        .string()
        .trim()
        .valid([CarpetMaterial.WoolAndBamboSilk, CarpetMaterial.WoolAndSilk])
        .required(),
      otherwise: joi.when('type', {
        is: CarpetType.Modern,
        then: joi
          .string()
          .trim()
          .valid([
            CarpetMaterial.WoolAndBamboSilk,
            CarpetMaterial.WoolAndSilk,
            CarpetMaterial.WoolAndSariSilk
          ])
          .required(),
        otherwise: joi
          .string()
          .trim()
          .valid([CarpetMaterial.WoolAndViscose])
          .required()
      })
    })
  })
});

const UPDATE_CARPET = joi.object({
  size: joi.number(),
  pricePerSquareMeter: joi.number(),
  imageUrl: joi.string().trim(),
  branch: joi
    .string()
    .trim()
    .uppercase()
    .valid(...Object.values(Branch)),
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
  material: joi.when('type', {
    is: CarpetType.Classic,
    then: joi
      .string()
      .trim()
      .valid([
        CarpetMaterial.Wool,
        CarpetMaterial.WoolAndSilk,
        CarpetMaterial.WoolAndBamboSilk
      ]),
    otherwise: joi.when('type', {
      is: CarpetType.Contemporary,
      then: joi
        .string()
        .trim()
        .valid([CarpetMaterial.WoolAndBamboSilk, CarpetMaterial.WoolAndSilk]),
      otherwise: joi.when('type', {
        is: CarpetType.Modern,
        then: joi
          .string()
          .trim()
          .valid([
            CarpetMaterial.WoolAndBamboSilk,
            CarpetMaterial.WoolAndSilk,
            CarpetMaterial.WoolAndSariSilk
          ]),
        otherwise: joi
          .string()
          .trim()
          .valid([CarpetMaterial.WoolAndViscose])
      })
    })
  })
});

export { ADD_CARPET, GET_CARPETS_BY_BRANCH, UPDATE_CARPET };
