const { Router } = require("express")
const router = new Router()
const MaterialOrderTable = require("../material_order/table")
const validationMiddleware = require("../middlewares/validation-middleware")
const { checkIsManager } = require("../middlewares/route-middleware")

router.get("/", (req, res, next) => {
    MaterialOrderTable.get()
        .then((response) => {
            res.json(response)
        })
        .catch((error) => next(error))
})

router.post("/current", (req, res, next) => {
    const { id } = req.body

    MaterialOrderTable.getByUserId(id)
        .then((response) => {
            res.json(response)
        })
        .catch((error) => next(error))
})

router.post("/create", [checkIsManager, validationMiddleware.createMaterialOrder], (req, res, next) => {
    const { description, project_id, items, userId } = req.body

    MaterialOrderTable.create(description, project_id, userId, items)
        .then(({ result }) => {
            if (result.success) {
                res.status(201).json({ success: true, message: 'Хүсэлтийг хадгаллаа' })
            } else {
                res.status(500).json({ success: false, message: 'Хүсэлтийг хадгалж чадсангүй', error: result })
            }
        }).catch((error) => next(error))
})

router.put("/update", [checkIsManager, validationMiddleware.updateMaterialOrder], (req, res, next) => {
    const { id, description, project_id, items, userId } = req.body

    MaterialOrderTable.update(id, description, project_id, userId, items)
        .then(({ result }) => {
            if (result.success) {
                res.status(202).json({ success: true, message: 'Хүсэлтийг заслаа.' })
            } else {
                res.status(500).json({ success: false, message: 'Хүсэлтийг засч чадсангүй', error: result })
            }
        }).catch((error) => next(error))
})

router.delete("/delete/:id", [checkIsManager], (req, res, next) => {
    const { id } = req.params

    MaterialOrderTable.delete(id)
        .then(({ result }) => {
            if (result.success) {
                res.status(204).json(null)
            } else {
                res.status(500).json({ success: false, message: 'Хүсэлтийг устгаж чадсангүй' })
            }
        }).catch((error) => next(error))
})

router.delete("/material/delete/:id", [checkIsManager], (req, res, next) => {
    const { id } = req.params

    MaterialOrderTable.deleteMaterial(id)
        .then(({ result }) => {
            if (result.success) {
                res.status(204).json(null)
            } else {
                res.status(500).json({ success: false, message: 'Материалыг устгаж чадсангүй' })
            }
        }).catch((error) => next(error))
})

module.exports = router