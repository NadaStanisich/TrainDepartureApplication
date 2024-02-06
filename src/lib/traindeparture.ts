class Departures {
    departures: [TrainDeparture] | undefined
}

class TrainDeparture {
    stop_id: number;
    route_id: number;
    run_id: number;
    direction_id: number;
    scheduled_departure_utc: string;
    estimated_departure_utc: string;
    platform_number: string;



    constructor(stop_id: number, route_id: number, run_id: number, direction_id: number, scheduled_departure_utc: string, estimated_departure_utc: string, platform_number: string) {
        this.stop_id = stop_id;
        this.route_id = route_id;
        this.run_id = run_id;
        this.direction_id = direction_id;
        this.scheduled_departure_utc = scheduled_departure_utc;
        this.estimated_departure_utc = estimated_departure_utc;
        this.platform_number = platform_number;
    }
}

export { TrainDeparture, Departures };