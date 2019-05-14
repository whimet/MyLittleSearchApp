import Database from "../src/database";

describe('Database', () => {
    const userEntity = 'Users';
    const ticketsEntity = 'Ticket';
    const firstUser = {
        _id: 1,
        name: 'Francisca Rasmussen',
        created_at: '2016-04-15T05:19:46 -10:00',
    };
    const secondUser = {_id: 2, tags: ['Foxworth']};
    const firstTicket = {_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b', description: ''};
    let db: Database;

    beforeAll(() => {
        db = new Database([{
            name: userEntity,
            records: [firstUser, secondUser]
        }, {name: ticketsEntity, records: [firstTicket]}]);
    });

    describe('searchableEntities', () => {
        it('should expose search terms', () => {
            expect(db.searchableEntities).toEqual([{name: userEntity, terms: ['_id', 'name', 'created_at', 'tags']}, {
                name: ticketsEntity,
                terms: ['_id', 'description']
            }]);
        });

        it('should work with empty collection', () => {
            expect(new Database([]).searchableEntities).toEqual([]);
        });
    });

    [
        {
            entityName: userEntity,
            term: '_id',
            value: 1,
            results: [firstUser]
        },
        {
            entityName: userEntity,
            term: '_id',
            value: '1',
            results: [firstUser]
        },
        {
            entityName: userEntity,
            term: 'name',
            value: 'Francisca Rasmussen',
            results: [firstUser]
        },
        {
            entityName: userEntity,
            term: 'tags',
            value: 'Foxworth',
            results: [secondUser]
        },
        {
            entityName: ticketsEntity,
            term: 'description',
            value: '',
            results: [firstTicket]
        },
        {
            entityName: 'invalidEntity',
            term: '_id',
            value: 1,
            results: []
        },
    ].forEach(({entityName, term, value, results}) =>
        it(`should search ${entityName} by term ${term} and value ${value} and got ${results}`, () => {
            expect(db.search(entityName, term, value)).toEqual(results);
        }));
});
