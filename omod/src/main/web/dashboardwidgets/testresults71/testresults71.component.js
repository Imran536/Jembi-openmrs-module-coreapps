import TestResults71Controller from './testresults71.controller';
import template from './testresults71.html';

export let TestResults71Component = {
    template,
    controller: TestResults71Controller,
    selector: 'testresults71',
    bindings: {
        config: '<'
    }
};