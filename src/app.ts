import * as inquirer from "inquirer";
import ZendeskSearch from "./zendesk_search";
import {readJson} from "./util";
import {answersHandler, questions} from './questions_builder';

const zendeskSearch = new ZendeskSearch([
    {name: 'Users', records: readJson('./data/users.json')},
    {name: 'Tickets', records: readJson('./data/tickets.json')},
    {name: 'Organizations', records: readJson('./data/organizations.json')}
]);

inquirer.prompt(questions(zendeskSearch)).then((answers: any) => console.log(answersHandler(zendeskSearch)(answers)));
