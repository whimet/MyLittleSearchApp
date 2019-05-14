import Loki from 'lokijs';
import {EntityCollection, EntityMetadata, SearchableEntity, TermMetadata} from './model'
import {clone, cloneWithProperties} from "./util";
import EntityMetadataBuilder from "./entity_metadata_builder";

export default class Database {
    private db: LokiConstructor;
    private entityMetadata: EntityMetadata[];

    constructor(collections: EntityCollection[]) {
        this.db = new Loki('');
        this.entityMetadata = new EntityMetadataBuilder(collections).build();
        this.addToDb(collections);
    }

    public get searchableEntities(): SearchableEntity[] {
        return this.entityMetadata.map(c => ({name: c.name, terms: c.terms.map(p => p.name)}));
    }

    public search(entityName: string, term: string, value: any): any[] {
        const collection = this.db.getCollection(entityName);
        if (collection == null) {
            return [];
        }

        const query = this.buildQuery(entityName, term, value);
        return collection.find(query).map(o => this.copyWithEntityTerms(entityName, o));
    }

    private buildQuery(entityName: string, term: string, value: any) {
        const isArray = this.isArray(entityName, term);
        const subQuery = isArray ? {'$contains': value} : {'$aeq': value};
        return {[term]: subQuery};
    }

    private addToDb(collections: EntityCollection[]) {
        collections.forEach(c => {
            const collection = this.db.addCollection(c.name);
            collection.insert(c.records.map(r => clone(r)));
        });
    }

    private copyWithEntityTerms(entityName: string, obj: any): any {
        const entityTerms = this.getEntityTerms(entityName);
        return cloneWithProperties(obj, entityTerms);
    }

    private getEntityTerms(entityName: string): string[] {
        const terms = this.getEntityTermMetadata(entityName);
        return terms.map(t => t.name);
    }

    private isArray(entityName: string, term: string) {
        return this.getTermType(entityName, term) === 'Array';
    }

    private getTermType(entityName: string, term: string) {
        const terms = this.getEntityTermMetadata(entityName);
        const termMetadata = terms.find(t => t.name === term);
        return termMetadata && termMetadata.type;
    }

    private getEntityTermMetadata(entityName: string): TermMetadata[] {
        const metadata = this.entityMetadata.find(c => c.name === entityName);
        return metadata && metadata.terms || [];
    }
}
