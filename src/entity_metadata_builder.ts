import {EntityCollection, EntityMetadata, TermMetadata} from "./model";
import {getType} from "./util";

export default class EntityMetadataBuilder {
    private collections: EntityCollection[];

    constructor(collections: EntityCollection[]) {
        this.collections = collections;
    }

    public build(): EntityMetadata[] {
        return this.collections.map(c => ({
            name: c.name,
            terms: this.getTerms(c.records)
        }));
    }

    private getTerms(records: any[]): TermMetadata[] {
        return records.reduce((allTerms, record) =>
                Object.keys(record)
                    .reduce((recordTerms, propertyName) =>
                        this.addTerm(recordTerms, propertyName, record[propertyName]), allTerms),
            []);
    }

    private addTerm(terms: TermMetadata[], name: string, value: any): TermMetadata[] {
        const result = terms.find(p => p.name === name);
        if (result == null) {
            return terms.concat([{name: name, type: getType(value)}]);
        }

        const type = getType(value);
        if (result.type !== type) {
            throw new Error(`Property '${name}' has value type '${result.type}', but now got a different type '${type}'`)
        }
        return terms;
    }
}
