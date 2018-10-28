import angular from 'angular';
import openmrsApi from '@openmrs/angularjs-openmrs-api';
import commons from './../dashboardwidgets.services';
import { TestResults71Component } from './testresults71.component';

export default angular.module("openmrs-contrib-dashboardwidgets.testresults71", [ openmrsApi, commons ])
	.component(TestResults71Component.selector, TestResults71Component).name;