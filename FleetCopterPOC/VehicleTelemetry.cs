using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FleetCopterPOC
{
    public class VehicleTelemetry
    {
        public int vehicleId { get; set; }
        public double altitudeAgl { get; set; }

        public int battery { get; set; }
        public VehicleTelemetry(int id)
        {
            vehicleId = id;
            altitudeAgl = 0;
            battery = 0;
        }
    }
}
