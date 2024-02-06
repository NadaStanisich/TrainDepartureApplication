class Trainstop {
    stop_id: number;
    stop_name: string;
    stop_suburb: string;
    stop_latitude: number;
    stop_longitude: number;
    route_type: number;

    constructor(stop_id: number, stop_name: string, stop_suburb: string, stop_latitude: number, stop_longitude: number, route_type: number) {
      this.stop_id = stop_id;
      this.stop_name = stop_name;
      this.stop_suburb = stop_suburb;
      this.stop_latitude = stop_latitude;
      this.stop_longitude = stop_longitude;
      this.route_type = route_type;
    }
  }

  export { Trainstop };