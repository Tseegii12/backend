const pool = require("../databasePool")
const globalQuery = require("../global_query/globalQuery")
var format = require("pg-format")
const table_name = "requests"

class RequestTable {

    static index() {
        return new Promise((resolve, reject) => {
            pool.query("SELECT requests.*, json_agg(json_build_object('id', users.id, 'name', users.name)::jsonb) as users\n" +
                "FROM requests\n" +
                "INNER JOIN request_users as ru ON requests.id = ru.request_id\n" +
                "INNER JOIN users ON ru.user_id = users.id\n" +
                "group by requests.id", [], (error, result) => {
                if (error) return reject(error)

                resolve(result.rows)
            })
        })
    }

    static getByUserId(userId) {
        return new Promise((resolve, reject) => {
            pool.query("select requests.*, json_agg(json_build_object('id', rr.id, 'content', rr.content, 'created_at', rr.created_at)::jsonb) as replies\n" +
                "from requests\n" +
                "left join request_replies as rr on requests.id = rr.request_id \n" +
                "where cast(rr.creator->>'id' as integer) = " + userId + "\n" +
                "group by requests.id", [], (error, result) => {
                if (error) return reject(error)

                if (result.rows && result.rows.length > 0) {
                    resolve(result.rows)
                } else {
                    pool.query("select requests.*\n" +
                        "from requests\n" +
                        "inner join request_users ru on requests.id = ru.request_id \n" +
                        "inner join users on ru.user_id = users.id \n" +
                        "where ru.user_id = " + userId + "\n" +
                        "group by requests.id", [], (error, result) => {
                        if (error) return reject(error)

                        resolve(result.rows)
                    })
                }
            })
        })
    }

    static getUserRequest(requestIds) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT * FROM requests WHERE id IN(${requestIds})`, [], (error, result) => {
                if (error) return reject(error)

                resolve(result.rows)
            })
        })
    }

    static insertUserRequest({ content, request_id, creator }) {
        return new Promise((resolve, reject) => {
            let id = request_id
            globalQuery.checkExist({ id, table_name })
                .then((data) => {
                    if (data.length > 0) {
                        this.insertRequestReply({content, request_id, creator })
                            .then((result) => {
                                resolve(result)
                            }).catch((error) => reject(error))
                    } else {
                        resolve({ result: { success: false, message: id + " ID-тай хүсэлт олдсонгүй" } })
                    }
                })
            })
    }

    static insertRequestReply({ content, request_id, creator }) {
        return new Promise((resolve, reject) => {
            pool.query("INSERT INTO request_replies(content, request_id, creator) VALUES ($1, $2, $3)", [content, request_id, creator], (error, result) => {
                if (error) return reject(error)
                resolve({ result: { success: true, message: "Хүсэлтийг хадгаллаа" }  })
            })
        })
    }

    static getLastRequest() {
        return new Promise((resolve, reject) => {
            pool.query("SELECT id FROM requests ORDER BY id DESC LIMIT 1", [], (error, result) => {
                if (error) return reject(error)
                resolve(result.rows)
            })
        })
    }

    static insert({ content, creator }) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO requests(content, creator) VALUES($1, $2)`, [content, creator], (error, result) => {
                if (error) return reject(error)
                resolve({ result: { success: true, message: "Хүсэлтийг хадгаллаа" }  })
            })
        })
    }

    static insertUser({ data }) {
        return new Promise((resolve, reject) => {
            pool.query(
                format(
                    "INSERT INTO request_users(request_id, user_id) VALUES %L",
                    data
                ),
                [],
                (error, response) => {
                    if (error) return reject({ success: false, message: 'Хүсэлтийг устгаж чадсангүй', error: error })

                    resolve({ result: { success: true, message: "Хүсэлтийг хадгаллаа" }  })
                }
            )
        })
    }

    static update({ id, content, creator, users_data }) {
        return new Promise((resolve, reject) => {
            globalQuery.checkExist({ id, table_name })
                .then((data) => {
                    if (data.length > 0) {
                        pool.query(`UPDATE requests SET content = $1, creator = $2 WHERE id = $3`, [content, creator, id], (error, result) => {
                            if (error) return reject(error)

                            let data = users_data

                            this.deleteUsers({ id })
                                .then(({ result }) => {
                                    this.insertUser({ data })
                                        .then((result) => {
                                            resolve(result)
                                        }).catch((error) => reject(error))
                                }).catch((error) => reject(error))

                            resolve({ result: { success: true, message: id + " ID-тай хүсэлтийг заслаа" } })
                        })
                    } else {
                        resolve({ result: { success: false, message: id + " ID-тай хүсэлт олдсонгүй" } })
                    }
                })
        })
    }

    static delete({ id }) {
        return new Promise((resolve, reject) => {
            globalQuery.checkExist({ id, table_name })
                .then((data) => {
                    if (data.length > 0) {
                        this.deleteUsers({ id })
                            .then(({ result }) => {
                                if (result.success) {
                                    this.deleteReplies({ id })
                                        .then(({ result }) => {
                                            if (result.success) {
                                                pool.query("DELETE FROM requests WHERE id = $1", [id], (error, result) => {
                                                    if (error) return reject(error)

                                                    resolve({ result: { success: true, message: "Хүсэлтийг устгалаа" } })
                                                })
                                            }
                                        }).catch((error) => reject(error))
                                }
                            })
                            .catch((error) => reject(error))
                    } else {
                        resolve({ result: { success: false, message: id + " ID-тай хүсэлт олдсонгүй" } })
                    }
                })
                .catch((error) => reject(error))
        })
    }

    static deleteReply(id) {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM request_replies WHERE id = $1", [id], (error, result) => {
                if (error) return reject(error)

                resolve({ result: { success: true, message: 'Устгалаа' } })
            })
        })
    }

    static deleteUsers({ id }) {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM request_users WHERE request_id = $1", [id], (error, result) => {
                if (error) return reject(error)

                resolve({ result: { success: true, message: 'Хүсэлтийг устгалаа' } })
            })
        })
    }

    static deleteReplies({ id }) {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM request_replies WHERE request_id = $1", [id], (error, result) => {
                if (error) return reject(error)

                resolve({ result: { success: true, message: 'Хүсэлтийг устгалаа' } })
            })
        })
    }
}

module.exports = RequestTable