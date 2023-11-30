"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (items, page, perPage) => {
    return items.slice(perPage * (page - 1), perPage * page);
};
exports.paginate = paginate;
