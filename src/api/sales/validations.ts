import joi from '../../lib/joi';
import {
  Branch,
  CarpetSupplier,
  CarpetType,
  CarpetMaterial
} from '../../common/enums';

const GET_SALES = joi.object({
  min: joi.date().required(),
  max: joi.date().required()
});

const CREATE = joi.object({
  carpet: joi.objectId().required(),
  client: joi.objectId().required(),
  price: joi.number().required(),
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

const UPDATE = joi.object({
  carpet: joi.objectId(),
  branch: joi
    .string()
    .trim()
    .valid(...Object.values(Branch)),
  supplier: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetSupplier)),
  type: joi
    .string()
    .trim()
    .valid(...Object.values(CarpetType)),
  material: joi
    .string()
    .trim()
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

export { GET_SALES, CREATE, UPDATE };
