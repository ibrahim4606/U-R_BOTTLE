const Joi = require("joi");

const schemas = {
  userSchema: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),

  aiDesignSchema: Joi.object({
    user: Joi.string().hex().length(24).optional(),
    title: Joi.string().min(2).max(100).optional(),
    BrandType: Joi.string().optional(),
    colorTheme: Joi.string().optional(),
    outputSlogan: Joi.array().items(Joi.string()).optional(),
    description: Joi.string().max(500).optional(),
    image: Joi.string().uri().optional(),
  }),

  cartSchema: Joi.object({
    template: Joi.string().optional(),

    bottleVolume: Joi.string().required(),

    title: Joi.string().trim().required(),

    BrandType: Joi.string().required(),

    colorTheme: Joi.string().required(),

    description: Joi.string().required(),

    // logo handled by multer → optional here
    logo: Joi.any().optional(),

    slogan: Joi.string().allow("").optional(),

    units: Joi.number().min(1).required(),

    perUnitPrice: Joi.alternatives().try(Joi.number(), Joi.string()).required(),

    TotalPrice: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  }),

  contactSchema: Joi.object({
    user: Joi.string().hex().length(24).optional(),
    name: Joi.string().min(2).max(50).optional(),
    number: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    email: Joi.string().email().optional(),
    complaint: Joi.string().max(1000).optional(),
  }),

  labelSchema: Joi.object({
    bottleVolume: Joi.string()
      .valid("100ml", "250ml", "500ml", "1L")
      .required(),
    title: Joi.string().min(2).max(50).required(),
    BrandType: Joi.string().required(),
    colorTheme: Joi.string().min(3).max(30).required(),
    slogan: Joi.string().allow(null, "").optional(),
    description: Joi.string().min(10).max(500).required(),
    basePrice: Joi.number().min(1).required(),
  }),

  orderSchema: Joi.object({
    orderNumber: Joi.string().optional(),
    user: Joi.string().hex().length(24).optional(),
    items: Joi.array().items(
      Joi.object({
        title: Joi.string().optional(),
        logo: Joi.string().optional(),
        BrandType: Joi.string().optional(),
        bottleVolume: Joi.string().optional(),
        units: Joi.number().min(1).optional(),
        perUnitPrice: Joi.number().min(0).optional(),
        TotalPrice: Joi.number().min(0).optional(),
      }),
    ),
    shippingDetails: Joi.object({
      fullName: Joi.string().required(),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      pincode: Joi.number().required(),
    }).required(),
  }),

  reviewSchema: Joi.object({
    name: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }),

  saveAiSchema: Joi.object({
    user: Joi.string().hex().length(24).optional(),
    Slogans: Joi.array().items(Joi.string()).optional(),
  }),
};

module.exports = schemas;
