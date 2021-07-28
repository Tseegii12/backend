const validator = require("../helpers/validate")

const createMaterialOrder = (req, res, next) => {
    const validationRule = {
        "description": "required",
        "project_id": "required|numeric",
        "items.*.material_id": "numeric",
        "items.*.amount": "numeric"
    };

    validator(req.body, validationRule, {
        required: ':attribute шаардлагатай.',
        numeric: ':attribute бүхэл тоо байх ёстой'
    }, (err, status) => {
        if (!status) {
            res.status(422)
                .json({
                    success: false,
                    message: "Validation failed",
                    data: err
                })
        } else {
            next();
        }
    })
}

const updateMaterialOrder = (req, res, next) => {
    const validationRule = {
        "id": "required|numeric",
        "description": "required|string",
        "project_id": "required|numeric",
        "items.*.material_id": "numeric",
        "items.*.amount": "numeric"
    };

    validator(req.body, validationRule, {
        required: ':attribute шаардлагатай.',
        numeric: ':attribute бүхэл тоо байх ёстой'
    }, (err, status) => {
        if (!status) {
            res.status(422)
                .json({
                    success: false,
                    message: "Validation failed",
                    data: err
                })
        } else {
            next();
        }
    })
}

module.exports = {
    createMaterialOrder,
    updateMaterialOrder
}