import * as mongoose from 'mongoose';
import { SchemaDefinition, SchemaDefinitionType } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';
import { DefinitionsFactory } from './definitions.factory';

export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export class SchemaFactory {
  static createForClass<
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
    TClass extends any = any,
    TDocument extends mongoose.Document = TClass extends mongoose.Document
      ? TClass
      : mongoose.Document<TClass>,
  >(target: Type<TClass>): mongoose.Schema<TDocument> {
    const schemaDefinition = DefinitionsFactory.createForClass(target);
    const schemaMetadata =
      TypeMetadataStorage.getSchemaMetadataByTarget(target);
    return new mongoose.Schema<TDocument>(
      schemaDefinition as SchemaDefinition<SchemaDefinitionType<TDocument>>,
      schemaMetadata && schemaMetadata.options,
    );
  }
}
