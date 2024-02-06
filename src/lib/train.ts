class Train {
    route_type: number;
    route_id: number;
    route_name: string;
  
    constructor(route_type: number, route_id: number, route_name: string) {
      this.route_type = route_type;
      this.route_id = route_id;
      this.route_name = route_name;
    }
  }
  
  export { Train };
  