const { stringFormat } = require('../common/util')
const { transaction } = require('../daos/common')
const applyDao = require('../daos/apply')

exports.apply = async function (ctx) {
    const form = ctx.request.body;
    const token = await ctx.verify();
    const ret = await applyDao.apply({ ...form, from_id: token.uid });
    if (!ret.affectedRows) {
        return ctx.body = {
            code: 2,
            message: '申请失败'
        };
    }
    ctx.body = {
        code: 0,
        message: '申请成功',
        data:ret.insertId
    };
}

exports.accept = async function (ctx) {
    const { id, friend_id } = ctx.request.body;
    const token = await ctx.verify();
    const ret = await transaction([
        ['update apply set status = 1 where id = ? and to_id = ?', [id, token.uid]],
        stringFormat("replace into user_friend values ('$1','$2'),('$2','$1')", token.uid, friend_id)
    ]);
    if (!ret[0].affectedRows || !ret[1].affectedRows) {
        return ctx.body = {
            code: 2,
            message: '添加好友失败'
        };
    }
    ctx.body = {
        code: 0,
        message: '添加好友成功'
    };
}

exports.acceptGroup = async function (ctx) {
    const { id, group_id, user_id } = ctx.request.body;
    const ret = await transaction([
        ['update `apply` set status = 1 where id = ?', [id]],
        ['replace into `user_group` values (?,?)', [user_id, group_id]]
    ]);
    if (!ret[0].affectedRows || !ret[1].affectedRows) {
        return ctx.body = {
            code: 2,
            message: '加入群组失败'
        };
    }
    ctx.body = {
        code: 0,
        message: '加入群组成功'
    };
}

exports.reject = async function (ctx) {
    const { id } = ctx.request.body;
    const token = await ctx.verify();
    const ret = await applyDao.reply([{ status: 2 }, id, token.uid]);
    if (!ret.affectedRows) {
        return ctx.body = {
            code: 2,
            message: '操作失败'
        };
    }
    ctx.body = {
        code: 0,
        message: '操作成功'
    };
}