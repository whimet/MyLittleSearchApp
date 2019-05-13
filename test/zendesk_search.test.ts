import ZendeskSearch from "../src/zendesk_search";

describe('ZendeskSearch', () => {
    const userEntity = 'Users';
    const ticketsEntity = 'Tickets';
    const firstUser = {
        _id: 1,
        name: 'Francisca Rasmussen'
    };
    const secondUser = {_id: 2, tags: ['Foxworth']};
    let zendeskSearch: ZendeskSearch;

    beforeEach(() => {
        zendeskSearch = new ZendeskSearch([{
            name: userEntity,
            records: [firstUser, secondUser]
        }, {name: ticketsEntity, records: [{_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b'}]}]);
    });

    [
        {
            index: '1',
            entityName: userEntity
        },
        {
            index: '2',
            entityName: ticketsEntity
        },
        {
            index: '0',
            entityName: undefined
        },
        {
            index: 'a',
            entityName: undefined
        }
    ].forEach(({index, entityName}) =>
        test(`entity name at index ${index} should be ${entityName}`, () => {
            expect(zendeskSearch.getEntityName(index)).toEqual(entityName);
        }));

    test('should get entity index prompt', () => {
        expect(zendeskSearch.getEntityIndexPrompt()).toEqual('Select 1)Users or 2)Tickets');
    });

    test('should get entity indexes', () => {
        expect(zendeskSearch.getEntityIndexes()).toEqual(['1', '2']);
    });

    [
        {
            index: '1',
            terms: ['_id', 'name', 'tags']
        },
        {
            index: '2',
            terms: ['_id']
        },
        {
            index: '0',
            terms: []
        },
    ].forEach(({index, terms}) =>
        test(`search terms at index ${index} should be ${terms}`, () => {
            expect(zendeskSearch.getSearchTerms(index)).toEqual(terms);
        }));

    test('should get searchable fields', () => {
        expect(zendeskSearch.getSearchableFields())
            .toEqual(`-----------------------------\nSearch ${userEntity} with\n_id\nname\ntags\n-----------------------------\nSearch ${ticketsEntity} with\n_id`);
    });

    [
        {
            index: '1',
            term: '_id',
            value: '1',
            results: [firstUser]
        },
        {
            index: '1',
            term: '_id',
            value: '0',
            results: `Searching ${userEntity.toLowerCase()} for _id with a value of 0\nNo results found`
        },
    ].forEach(({index, term, value, results}) =>
        test(`search term ${term} with value ${value} at index ${index} should be ${results}`, () => {
            expect(zendeskSearch.search(index, term, value)).toEqual(results);
        }));

});
