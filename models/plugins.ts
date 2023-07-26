import {Document, Schema} from 'mongoose';

// Mongoose plugins for models

/**
 * Automatically manages .created and .updated on models
 * @param schema - The schema to apply the plugin to.
 */
function createdUpdatedPlugin(schema: Schema) {
  schema.add({updated: {type: Date, index: true}});
  schema.add({created: {type: Date, index: true}});

  schema.pre('save', function (next) {
    if (this.disableCreatedUpdatedPlugin === true) {
      next();
      return;
    }
    // If we aren't specifying created, use now.
    if (!this.created) {
      this.created = new Date();
    }
    // All writes change the updated time.
    this.updated = new Date();
    next();
  });
}

// By default, we will not return any document marked as isDeleted. You can still get the deleted
// documents explicitly by using .find({isDeleted: true}).
function isDeletedPlugin(schema: Schema, o: any) {
  if (o && o.disableIsDeletedPlugin) {
    return;
  }
  schema.pre('find', function () {
    const query = this.getQuery();
    // If the find doesn't specify anything about isDeleted, add it.
    if (query && query.isDeleted === undefined) {
      this.where({isDeleted: {$ne: true}});
    }
  });
}

export const plugins = {
  standardPlugins: function (schema: Schema, o: Document) {
    createdUpdatedPlugin(schema);
    isDeletedPlugin(schema, o);
  },
};
