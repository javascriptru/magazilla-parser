module.exports = [
  {
    $id:                  "https://javascript.info/schemas/categories.json",
    type:                 "object",
    properties:           {
      id:    {type: "string"},
      title: {type: "string"},
      count: {type: "number"},
      weight:   {type: "number"}
    },
    required:             ["id", "title", "count", "weight"],
    additionalProperties: false // other properties not allowed
  }, {
    $id:                  "https://javascript.info/schemas/subcategories.json",
    type:                 "object",
    properties:           {
      id:       {type: "string"},
      title:    {type: "string"},
      count:    {type: "number"},
      weight:   {type: "number"},
      category: {type: "string"}
    },
    required:             ["id", "title", "count", "category", "weight"],
    additionalProperties: false
  }, {
    $id:                  "https://javascript.info/schemas/products.json",
    type:                 "object",
    properties:           {
      id:          {type: "string"},
      title:       {type: "string"},
      description: {type: "string"},
      quantity:    {type: "number"},
      subcategory: {type: "string"},
      status:      {type: "number"},
      images:      {
        type:        "array",
        items:       {
          type:                 "object",
          properties:           {
            source: {type: "string"},
            url:    {type: "string"}
          },
          additionalProperties: false
        },
        uniqueItems: true
      },
      price:       {type: "number"},
      discount:    {type: "number"}
    },
    required:             ["id", "title", "description", "quantity", "subcategory", "status", "images", "price"],
    additionalProperties: false
  }, {
    $id:                  "https://javascript.info/schemas/orders.json",
    type:                 "object",
    properties:           {
      id:        {type: "string"},
      products:  {
        // array of products: [ {product:..., count:...}, ... ]
        type:  "array",
        items: {
          type:                 "object",
          properties:           {
            product: {
              type: "string",
            },
            count:   {
              type: "number"
            }
          },
          required:             ["product", "count"],
          additionalProperties: false
        }
      },
      totalCost: {type: "number"},
//      createdAt: {type: "string", pattern: "^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.\d{3}Z"},
      createdAt: {type: "string", format: "date-time"},
      user:      {type: "string"},
      phone:     {type: "string"},
      delivery:  {type: "string"}
    },
    required:             ["id", "product", "count", "amount", "createdAt", "user", "phone", "delivery"],
    additionalProperties: false
  }, {
    $id:        "https://javascript.info/schemas/db.json",
    type:       "object",
    properties: {
      categories:    {
        type:  "array",
        items: {
          $ref: "https://javascript.info/schemas/categories.json",
        }
      },
      subcategories: {
        type:  "array",
        items: {
          $ref: "https://javascript.info/schemas/subcategories.json",
        }
      },
      products:      {
        type:  "array",
        items: {
          $ref: "https://javascript.info/schemas/products.json",
        }
      },
      orders:        {
        type:  "array",
        items: {
          $ref: "https://javascript.info/schemas/orders.json",
        }
      }
    }
  }
];
