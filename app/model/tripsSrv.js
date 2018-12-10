
app.factory("trips", function($q, $http, user) {

    var trips = {};
    var wasEverLoaded = {};
    function Trip(plainTrip) {
        this.id = plainTrip.id;
        this.name = plainTrip.name;
        this.description = plainTrip.description;
        this.highLights = plainTrip.highLights;
        this.startDate = plainTrip.startDate;
        this.endDate = plainTrip.endDate;
        this.tips = plainTrip.tips;
        debugger;
        this.duration = plainTrip.duration;
        this.imgUrl = plainTrip.imgUrl;
        this.userId = plainTrip.userId;
    }
    function getActiveUserTrips() {
        var async = $q.defer();
        var userId = user.getActiveUser().id;
        // This is a hack since we don't really have a persistant server.
        // So I want to get all trips only once.
        if (wasEverLoaded[userId]) {
            async.resolve(trips[userId]);
        } else {
            trips[userId] = [];
            var getTripsURL = "https://my-json-server.typicode.com/aviohana/trip-book/trips?userId=" + userId;

            $http.get(getTripsURL).then(function(response) {
                for (var i = 0; i < response.data.length; i++) {
                    var trip = new Trip(response.data[i]);
                    trips[userId].push(trip);
                }
                wasEverLoaded[userId] = true;
                async.resolve(trips[userId]);
            }, function(error) {
                async.reject(error);
            });
        }

        return async.promise;
    }

    function createTrip(name, startDate, endDate, description, highLights, tips, duration, imgUrl) {
        var async = $q.defer();

        var userId = user.getActiveUser().id;

        var newTrip = new Trip({id:-1, name: name, description: description,
            highLights: highLights, tips: tips, imgUrl: imgUrl, 
            userId: userId});

        // if working with real server:
        //$http.post("http://my-json-server.typicode.com/aviohana/trip-book/trips", newtrip).then.....

        trips[userId].push(newTrip);
        async.resolve(newTrip);

        return async.promise;
    }

    return {
        getActiveUserTrips: getActiveUserTrips,
        createTrip: createTrip
    }
})