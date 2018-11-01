export default class TestResults71Controller{
    constructor($filter, openmrsRest, widgetsCommons) {
        'ngInject';

        Object.assign(this, { $filter, openmrsRest, widgetsCommons });
    }
    
    $postLink(){
    	console.log("post link");
    }
    
    $onInit() {
    	this.multiArray=[];
        this.fetchConcepts();
    	
        // Max age of obs to display
        this.maxAgeInDays = undefined;

        // Concept info
        this.concept = {};

        this.metaDataDict={};
        // Chart data
        this.series = [];
        this.labels = [];
        this.data = [[]];
        this.obs = [];
        this.conceptDict=[];
        this.selectedId;
        this.daysAgo=1000;
        this.options={};
        /*this.options =  {
        		    scales: {
        		      yAxes: [],
        		      xAxes: []
        		    },
        		    annotation: {
        		    	annotations: []
        		    }
        		  };*/
        // Parse maxAge to day count
        this.maxAgeInDays = this.widgetsCommons.maxAgeToDays(this.config.maxAge);

        /*this.config.concept_names = this.config.concept_names.replace(/\s/g,'');
        this.config.concepts = this.config.concepts.replace(/\s/g,'');

        let conceptNames = this.config.concept_names.split(",");
        let c = this.config.concepts.split(",");
        for(let i=0; i<conceptNames.length; i++){
        	this.conceptDict.push([c[i],conceptNames[i]]);
        }*/
       /* 
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
        })*/
    }
    
    selected(){
    	this.$postLink();
    	console.log("Selected " + this.selectedId);
    	console.log("days: "+this.daysAgo);
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
                        if (angular.isUndefined(this.maxAgeInDays) || (this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= this.maxAgeInDays)) {
                            if(this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= parseInt(this.daysAgo)){
	                        	// Add obs data for chart display
	                            var date = this.$filter('date')(new Date(obs.obsDatetime), this.config.dateFormat);
	                            this.labels.unshift(date);
	                            this.data[0].unshift(obs.value);
	                            console.log(i);
                            }
                        }
                    }
                }
                console.log(this.series);
            }
        })        
    }
    
    clicked(){
    	console.log("Selected " + this.multiArray);
    	this.labels = [];
    	this.data = [[]];
    	this.series = [];
    	this.options={};
    	console.log(this.multiArray.length);
    	for(let i=0; i<this.multiArray.length; i++){
	    	this.openmrsRest.list('obs',{ patient: this.config.patientUuid, v: 'full', limit: this.config.maxResults, concept: this.multiArray[i] }).then((resp) => {
	            console.log(resp.results);
	    		const obss = resp.results;
	            this.obs = obss;
	            if (obss.length > 0) {
                	this.labels=[];
	                // Set concept to display
	                this.concept = obss[0].concept;
	                this.series.push(this.concept.display);
	                for (let j = 0; j < obss.length; j++) {
	                    let obs = obss[j];
	                    // Show numeric concepts only
	                    if (obs.concept.datatype.display == 'Numeric') {
	                        // Don't add obs older than maxAge
	                        if (angular.isUndefined(this.maxAgeInDays) || (this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= this.maxAgeInDays)) {
	                            if(this.widgetsCommons.dateToDaysAgo(obs.obsDatetime) <= parseInt(this.daysAgo)){
		                        	// Add obs data for chart display
		                            var date = this.$filter('date')(new Date(obs.obsDatetime), this.config.dateFormat);
		                            this.labels.unshift(date);
		                            this.data[i].unshift(obs.value);
		                            console.log("Data["+i+"]["+j+"] = "+this.data[i][j]);
	                            }
	                        }
	                    }
	                }
	                console.log("DATA: "+this.data.length);
	                if(angular.equals(this.options,{})){
	                	this.options.scales={};
	                	this.options.scales.yAxes=[];
	                }
	                this.options.scales.yAxes.push({scaleLabel:{display:true,labelString:this.concept.display+(this.metaDataDict[this.concept.uuid]) +' ('+this.metaDataDict[this.concept.uuid].unit+')'},id:'y-axis-1',type:'linear',display:true,position:(i === 1 ? 'left' : 'right')});
	                console.log(this.series);
	                if( ('hiAbs' in this.metaDataDict[this.concept.uuid]) && this.metaDataDict[this.concept.uuid].hiAbs != null){
	                	if(angular.equals(this.options,{})){
		                	this.options.annotation={};
		                	this.options.annotation.annotations=[];
	                	}
	                	this.options.annotation.annotations.push({type:'line',mode:'horizontal',scaleID:(i===1 ? 'y-axis-0' : 'y-axis-1'),value:this.metaDataDict[this.concept.uuid].hiAbs,borderColor:'red',borderWidth:2});
	            	}
			    	if( ('lowAbs' in this.metaDataDict[this.concept.uuid]) && this.metaDataDict[this.concept.uuid].lowAbs != null){
			    		if(angular.equals(this.options,{})){
		                	this.options.annotation={};
		                	this.options.annotation.annotations=[];
	                	}
			    		this.options.annotation.annotations.push({type:'line',mode:'horizontal',scaleID:(i==1 ? 'y-axis-0' : 'y-axis-1'),value:this.metaDataDict[this.concept.uuid].hiAbs,borderColor:'red',borderWidth:2});
		        	}
	        }        
    	})
    	}
		if(!(angular.equals(this.options,{}))){
			this.options.xAxes=[];
	        this.options.xAxes.push({scaleLabel:{display:true, labelString:'Date of Obs'}});
		}
    }
    
    onTimePeriodSelected(){
    	console.log("days: "+this.daysAgo);
    	this.series=[];
    	this.labels=[];
    	this.data=[[]];
    	if (this.obs.length > 0) {
            // Set concept to display
            this.concept = this.obs[0].concept;
            this.series.push(this.concept.display);
            for (let i = 0; i < this.obs.length; i++) {
                let obss = this.obs[i];
                // Show numeric concepts only
                if (obss.concept.datatype.display == 'Numeric') {
                    // Don't add obs older than maxAge
                    if (angular.isUndefined(this.maxAgeInDays) || (this.widgetsCommons.dateToDaysAgo(obss.obsDatetime) <= this.maxAgeInDays)) {
                    	if(this.widgetsCommons.dateToDaysAgo(obss.obsDatetime) <= parseInt(this.daysAgo)){
	                        // Add obs data for chart display
	                        var date = this.$filter('date')(new Date(obss.obsDatetime), this.config.dateFormat);
	                        this.labels.unshift(date);
	                        this.data[0].unshift(obss.value);
	                        console.log(i);
                    	}
                    }
                }
            }
        }
    }
    
    fetchConcepts() {
        this.concepts = this.getConfigConceptsAsArray(this.config.concepts);
        console.log(this.concepts);
        console.log("concept.unit: "+this.concepts[i].units);
        for(let i = 0; i < this.concepts.length; i++) {
            this.openmrsRest.getFull("concept/" + this.concepts[i], {v: 'custom:(uuid,display,names:(display,conceptNameType)'}).then((concept) => {
                console.log("concept.unit: "+concept.units);
            	this.metaDataDict[concept.uuid]={'hiAbs':concept.hiAbsolute,'lowAbs':concept.lowAbsolute,'unit':concept.units};
                let index = this.concepts.indexOf(concept.uuid);
                this.concepts[index] = this.getConceptWithShortName(concept);
                if(concept.datatype.display == 'Numeric'){
                	this.conceptDict.push([concept.uuid,concept.name.display]);
                }
            });
        }
        console.log("MetaDataDict: " + this.metaDataDict);
    }
    
    getConfigConceptsAsArray(commaDelimitedConcepts) {
        return commaDelimitedConcepts.replace(" ", "").split(",");
    }

    getConceptWithShortName(concept) {
        angular.forEach(concept.names, (name) => {
            if(name.conceptNameType == 'SHORT'){
                concept.display = name.display;
            }
        });
        return concept;
    }
}