class TrainDirections {
    direction_id: number;
    route_direction_description: string;
    direction_name: string;
    route_id: number;
    route_type: number;
   
    constructor(direction_id: number, route_direction_description: string, direction_name: string, route_id: number, route_type: number) {
        this.direction_id = direction_id;
        this.route_direction_description = route_direction_description;
        this.direction_name = direction_name;
        this.route_id = route_id;
        this.route_type = route_type;
    }
}

export { TrainDirections };
