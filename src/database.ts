import Loki from 'lokijs';

interface Collection {
    name: string,
    records: any[]
}

interface SearchableEntity {
    name: string,
    terms: string[]
}

interface CollectionMetadata {
    name: string,
    properties: PropertyMetadata[]
}

interface PropertyMetadata {
    name: string,
    type: string
}

function clone(obj: any): any {
    return Object.assign({}, obj);
}

export default class Database {
    private collections: Collection[];
    private db: LokiConstructor;
    private collectionsMetadata: CollectionMetadata[];

    constructor(collections: Collection[]) {
        this.collections = collections;
        this.db = new Loki('example.db');

        this.collectionsMetadata = this.collections.map(c => ({
            name: c.name,
            properties: this.getProperties(c.records)
        }));
        this.collections.forEach(c => {
            const collection = this.db.addCollection(c.name);
            c.records.forEach(r => collection.insert(clone(r)));
        });
    }

    public get searchableEntities(): SearchableEntity[] {
        return this.collectionsMetadata.map(c => ({name: c.name, terms: c.properties.map(p => p.name)}));
    }

    private getProperties(records: any[]): PropertyMetadata[] {
        return records.reduce((properties, record) =>
                Object.keys(record)
                    .reduce((recordProperties, propertyName) =>
                        this.addProperty(recordProperties, propertyName, record[propertyName]), properties),
            []);
    }

    private addProperty(properties: PropertyMetadata[], name: string, value: any): PropertyMetadata[] {
        const result = properties.find(p => p.name === name);
        if (result == null) {
            return properties.concat([{name: name, type: this.getType(value)}]);
        }

        const type = this.getType(value);
        if (result.type !== type) {
            throw new Error(`Property ${name} has value type '${result.type}', but got a different type '${type}'`)
        }
        return properties;
    }

    private getType(value: any): string {
        if (typeof value === 'object' && value.constructor === Array) {
            return 'Array';
        }
        return typeof value;
    }

    search(collectionName: string, property: string, value: any): any[] {
        const collection = this.db.getCollection(collectionName);
        const isArray = this.isArray(collectionName, property);
        const queryValue = isArray ? {'$contains': value} : value;
        const query = {[property]: queryValue};
        return collection.find(query).map(o => this.withoutLokiMetadata(collectionName, o));
    }

    private withoutLokiMetadata(collectionName: string, obj: any): any {
        const result = clone(obj);
        const metadata = this.collectionsMetadata.find(c => c.name === collectionName);
        if (metadata != null) {
            const propertyNames = metadata.properties.map(p => p.name);
            Object.keys(result).forEach(k => {
                if (!propertyNames.includes(k)) {
                    delete result[k];
                }
            });
        }
        return result;
    }

    private isArray(collection: string, property: string) {
        return this.getPropertyType(collection, property) === 'Array';
    }

    private getPropertyType(collection: string, key: string) {
        const collectionMetadata = this.collectionsMetadata.find(c => c.name === collection);
        const propertyMetadata = collectionMetadata && collectionMetadata.properties.find(p => p.name === key);
        return propertyMetadata && propertyMetadata.type;
    }
}
