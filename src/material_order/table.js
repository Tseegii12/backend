const pool = require("../databasePool")
var format = require("pg-format")
const moment = require("moment")
const table_name = "material_orders"

class MaterialOrderTable {

    static get() {
        return new Promise((resolve, reject) => {
            pool.query("SELECT mo.id, mo.description, mo.created_at, mo.updated_at, mo.status, users.name as manager_name, mo.project_id, project.name as project_name, " +
                "json_agg(json_build_object('id', item.id, 'material_id', item.material_id, 'material_name', m.name, 'amount', item.amount)) as materials " +
                "FROM material_orders as mo INNER JOIN users ON mo.manager_id = users.id " +
                "INNER JOIN project ON mo.project_id = project.id " +
                "INNER JOIN material_order_items as item ON mo.id = item.order_id " +
                "INNER JOIN material as m ON item.material_id = m.id " +
                "GROUP BY mo.id, users.id, project.id", [], (error, response) => {
                if (error) return reject(error)

                resolve(response.rows)
            })
        })
    }

    static getByUserId(userId) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT mo.id, mo.description, mo.created_at, mo.updated_at, mo.status, mo.project_id, project.name as project_name, 
                COALESCE(json_agg(json_build_object('id', item.id, 'material_id', item.material_id, 'material_name', m.name, 'material_code', m.code, 'amount', item.amount)) FILTER (WHERE item.id IS NOT NULL), '[]') as materials
                FROM material_orders as mo INNER JOIN users ON mo.manager_id = users.id
                INNER JOIN project ON mo.project_id = project.id
                LEFT JOIN material_order_items as item ON mo.id = item.order_id
                LEFT JOIN material as m ON item.material_id = m.id WHERE mo.manager_id = $1 
                GROUP BY mo.id, users.id, project.id`, [userId], (error, response) => {
                if (error) return reject(error)

                resolve(response.rows)
            })
        })
    }

    static create(description, project_id, manager_id, items) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO material_orders(description, project_id, manager_id) VALUES($1, $2, $3) returning id", [description, project_id, manager_id], (error, response) => {
                if (error) return reject(error)
                    if (items && items.length > 0) {
                        var newItems = []
                        items.map(item => {
                            var innerData = []
                            innerData.push(item.amount)
                            innerData.push(item.material_id)
                            innerData.push(response.rows[0].id)
                            newItems.push(innerData)
                        })
                        this.insertMaterial(newItems)
                            .then((res) => {
                                resolve(res)
                            }).catch((error) => console.log(error))
                    }
                resolve({ result: { success: true } })
            })
        })
    }

    static update(id, description, project_id, manager_id, items) {
        return new Promise((resolve, reject) => {
            pool.query("UPDATE material_orders SET description=$1, project_id=$2, updated_at=$3 WHERE id=$4 and manager_id=$5", [description, project_id, moment(), id, manager_id], (error, response) => {
                if (error) return reject(error)

                pool.query("SELECT id FROM material_orders WHERE id=$1", [id], (err, res) => {
                    if (err) return reject(err)

                    let order = res.rows[0]

                    if (order) {
                        if (items && items.length > 0) {
                            var newItems = []
                            items.map(item => {
                                var innerData = []
                                innerData.push(item.amount)
                                innerData.push(item.material_id)
                                innerData.push(order.id)
                                newItems.push(innerData)
                            })
                            this.deleteMaterials(id, reject)

                            this.insertMaterial(newItems)
                                .then((res) => {
                                    resolve(res)
                                }).catch((error) => reject(error))
                        }
                        resolve({ result: { success: true } })

                    } else {
                        resolve({ result: { success: false, message: id + ' ID-тай материалын хүсэлт олдсонгүй.' } })
                    }
                })
            })
        })
    }

    static insertMaterial(items) {
        return new Promise((resolve, reject) => {
            pool.query(format("INSERT INTO material_order_items(amount, material_id, order_id) VALUES %L", items), [], (error, result) => {
                if (error) return reject(error)

                resolve({ result: { success: true } })
            })
        })
    }

    static deleteMaterials(orderId, reject) {
        pool.query("DELETE FROM material_order_items WHERE order_id=$1", [orderId], (error, response) => {
            if (error) reject(error)
        })
    }

    static deleteMaterial(materialId) {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM material_order_items WHERE id=$1", [materialId], (error, response) => {
                if (error) return reject(error)

                resolve({ result: { success: true, message: 'Материалыг устгалаа.' } })
            })
        })
    }

    static delete(orderId) {
        return new Promise((resolve, reject) => {
            this.deleteMaterials(orderId, reject)

            pool.query("DELETE FROM material_orders WHERE id=$1", [orderId], (error, response) => {
                if (error) reject(error)

                resolve({ result: { success: true, message: 'Материалын хүсэлтийг устгалаа.' } })
            })
        })
    }
}

module.exports = MaterialOrderTable