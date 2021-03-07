using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UGCS.Sdk.Protocol;
using UGCS.Sdk.Protocol.Encoding;

namespace FleetCopterPOC
{
    public class Client
    {
        public int clientId { get; set; }
        public ClientData clientData { get; set; }
        public MessageExecutor messageExecutor { get; set; }
        public NotificationListener notificationListener { get; set; }
    
        public Client(int clientId, MessageExecutor me, NotificationListener nl, List<Vehicle> vehiclesList)
        {
            this.clientId = clientId;
            this.messageExecutor = me;
            this.notificationListener = nl;

            int d1 = 2;
            int d2 = 2;
            int d3 = 2;
            Console.WriteLine(vehiclesList.Count);
            if(vehiclesList.Count >= 2)
            {
                d1 = vehiclesList[0].Id;
                d2 = vehiclesList[1].Id;
                d3 = vehiclesList[2].Id;
            }
            this.clientData = new ClientData(clientId, d1, d2, d3); 
        }
    }
}
