import mongoose from 'mongoose';

export interface MongooseLikeObject {
  _id: mongoose.Types.ObjectId;
  id?: string;
  toObject?: () => any;
}
export const transformReadForClient = function <T extends MongooseLikeObject>(obj: T): Partial<T> {
  if (obj.toObject) {
    // obj is a Mongoose document object.
    const transformed = obj.toObject();
    transformed.id = obj.id;
    // Delete some fields we always filter out.
    delete transformed._id;
    delete transformed.__v;
    delete transformed.isDeleted;
    return transformed;
  } else {
    // obj is a plain JS object, of the sort returned by `.lean()`.
    return {...obj, id: obj._id ? obj._id.toString() : obj.id};
  }
};
