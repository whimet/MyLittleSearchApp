import {EntityCollection} from './model'
import Database from "./database";

export default class ZendeskSearch {
    private entities: EntityCollection[];
    private database: Database;

    constructor(entities: EntityCollection[]) {
        this.entities = entities;
        this.database = new Database(entities);
    }

    public getEntityName(searchEntityIndex: string) {
        const entity = this.entities[Number(searchEntityIndex) - 1];
        return entity && entity.name;
    }

    public getEntityIndexPrompt() {
        return `Select ${this.entities.map((entity, index) => `${index + 1})${entity.name}`).join(' or ')}`;
    }

    public getEntityIndexes(): string[] {
        return this.entities.map((entity, index) => `${index + 1}`);
    }

    public getSearchTerms(entityIndex: string): string[] {
        const searchableEntity = this.database.searchableEntities.find(c => c.name === this.getEntityName(entityIndex));
        return searchableEntity && searchableEntity.terms || [];
    }

    public getSearchableFields() {
        return this.database.searchableEntities
            .map(c => `-----------------------------\nSearch ${c.name} with\n${c.terms.join('\n')}`)
            .join('\n');
    }

    public search(entityIndex: string, term: string, value: string): any[] | string {
        const entityName = this.getEntityName(entityIndex);
        const results = this.database.search(entityName, term, value);

        if (results.length !== 0) {
            return results;
        }
        return `Searching ${entityName.toLowerCase()} for ${term} with a value of ${value}\nNo results found`;
    }
}
