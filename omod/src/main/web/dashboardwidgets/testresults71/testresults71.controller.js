export default class TestResults71Controller {
    constructor($filter, openmrsRest, widgetsCommons) {
        'ngInject';

        Object.assign(this, { $filter, openmrsRest, widgetsCommons });
    }
    
    $onInit() {
        // Max age of obs to display
        this.maxAgeInDays = undefined;

        // Concept info
        this.concept = {};

        // Chart data
        this.series = [];
        this.labels = [];
        this.data = [[]];
        this.obs = [];
        this.conceptDict=[];
        this.selectedId;
        
        this.options =  {
        		    scales: {
        		      yAxes: [
        		        {
        		          id: 'y-axis-0',
        		          type: 'linear',
        		          display: true,
        		          position: 'right'
        		        }
        		      ]
        		    },
            		annotation: {
            			annotations: [
            			              {
            			                drawTime: "afterDatasetsDraw",
            			                id: "hline",
            			                type: "line",
            			                mode: "horizontal",
            			                scaleID: "y-axis-0",
            			                value: 149,
            			                borderColor: "black",
            			                borderWidth: 5
            			              }]
            		    }

        		  };

        this.config.concept_names = this.config.concept_names.replace(/\s/g,'');
        this.config.concepts = this.config.concepts.replace(/\s/g,'');

        let conceptNames = this.config.concept_names.split(",");
        let c = this.config.concepts.split(",");
        for(let i=0; i<conceptNames.length; i++){
        	this.conceptDict.push([c[i],conceptNames[i]]);
        }
        
        this.openmrsRest.setBaseAppPath("/coreapps");

        // Set default maxResults if not defined
        if (angular.isUndefined(this.config.maxResults)) {
            this.config.maxResults = 4;
        }
        // Parse maxAge to day count
        this.maxAgeInDays = this.widgetsCommons.maxAgeToDays(this.config.maxAge);

        this.openmrsRest.list('obs',{ patient: this.config.patientUuid, v: 'full', limit: this.config.maxResults, concept: this.config.conceptId }).then((resp) => {
            const obss = resp.results;
            this.obs = obss;
            if (obss.length > 0) {
                // Set concept to display
                this.concept = obss[0].concept;
                this.series.push(this.concept.display);
                for (let i = 0; i < obss.length; i++) {
                    let obs = obss[i];
                    // Show numeric concepts only
                    if (obs.concept.datatype.display == 'Numeric') {
                        // Don't add obs older than maxAge
                        if (angular.isUndefined(this.maxAgeInDays) || this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= this.maxAgeInDays) {
                            // Add obs data for chart display
                            var date = this.$filter('date')(new Date(obs.obsDatetime), this.config.dateFormat);
                            this.labels.unshift(date);
                            this.data[0].unshift(obs.value);
                        }
                    }
                }
            }
        })
    }
    
    selected(id){
    	console.log("Selected " + this.selectedId);
    	this.labels = [];
    	this.data = [[]];
    	this.series = [];
    	this.openmrsRest.list('obs',{ patient: this.config.patientUuid, v: 'full', limit: this.config.maxResults, concept: this.selectedId }).then((resp) => {
            console.log(resp.results);
    		const obss = resp.results;
            this.obs = obss;
            if (obss.length > 0) {
                // Set concept to display
                this.concept = obss[0].concept;
                this.series.push(this.concept.display);
                for (let i = 0; i < obss.length; i++) {
                    let obs = obss[i];
                    // Show numeric concepts only
                    if (obs.concept.datatype.display == 'Numeric') {
                        // Don't add obs older than maxAge
                        if (angular.isUndefined(this.maxAgeInDays) || this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= this.maxAgeInDays) {
                            // Add obs data for chart display
                            var date = this.$filter('date')(new Date(obs.obsDatetime), this.config.dateFormat);
                            this.labels.unshift(date);
                            this.data[0].unshift(obs.value);
                            console.log(i);
                        }
                    }
                }
                console.log(this.series);
            }
        })        
    }
}