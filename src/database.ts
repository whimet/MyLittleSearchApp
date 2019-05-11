import Loki from 'lokijs';

interface Collection {
    name: string,
    records: any[]
}

interface SearchTerm {
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
            c.records.forEach(r => collection.insert(r));
        });
    }

    public get searchTerms(): SearchTerm[] {
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

    search(collectionName: string, property: string, value: any): any {
        const collection = this.db.getCollection(collectionName);
        const isArray = this.isArray(collectionName, property);
        const queryValue = isArray ? {'$contains': value} : value;
        return collection.find({[property]: queryValue});
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
