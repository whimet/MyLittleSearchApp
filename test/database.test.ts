import Database from "../src/database";

describe('#database', () => {
    test('should expose search terms', () => {
        const db = new Database([{
            name: 'User',
            records: [{
                _id: 1,
                name: 'Francisca Rasmussen',
                created_at: '2016-04-15T05:19:46 -10:00',
            }, {_id: 2, tags: ['Foxworth']}]
        }, {name: 'Ticket', records: [{_id: '436bf9b0-1147-4c0a-8439-6f79833bff5b', assignee_id: 24}]}]);

        expect(db.searchTerms).toEqual([{name: 'User', terms: ['_id', 'name', 'created_at', 'tags']}, {
            name: 'Ticket',
            terms: ['_id', 'assignee_id']
        }]);
    });
});
