const uuid = require("uuid").v4
const utils = require("../../utils/response")
const errorCodes = require("../../errorCodes")

const createCart = async (context) => {
    const { db } = context

    const resp = await db.cart.create({
        id: uuid(),
    })

    return utils.createResp(resp.dataValues, 201)
}

const getCart = async (context, cartId) => {
    const { db } = context

    const respCart = await db.cart.findOne({ where: { id: cartId } })
    const respItems = await db.cartItem.findAll({ where: { cartId: cartId } })

    if (respCart !== null && typeof respCart.dataValues !== "undefined") {
        const items = respItems.map((item) => {
            return {
                type: "cartItem",
                id: item.dataValues.id,
                quantity: item.dataValues.quantity,
                productId: item.dataValues.productId,
            }
        })
        const responseData = { type: "cart", ...respCart.dataValues, items }

        return utils.createResp(responseData, 200)
    } else if (respCart === null) {
        return utils.createErrorResp(
            [{ message: "Cart not found", code: errorCodes.CART_NOT_FOUND }],
            400
        )
    } else {
        return utils.createInternalServerError()
    }
}

module.exports = {
    createCart,
    getCart,
}
