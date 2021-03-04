using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UGCS.Sdk.Protocol;
using UGCS.Sdk.Protocol.Encoding;
using UGCS.Sdk.Tasks;
using System.IO;

namespace FleetCopterPOC
{
    public class UgcsHandler
    {

        private static UgcsHandler instance = null;
        private static readonly object padlock = new object();

        public Dictionary<int, Client> clients { get; set; }

        private UgcsHandler()
        {
            this.clients = new Dictionary<int, Client>();
        }

        public static UgcsHandler Instance
        {
            get
            {
                lock (padlock)
                {
                    if (instance == null)
                    {
                        instance = new UgcsHandler();
                    }
                    return instance;
                }
            }
        }


        public int startConnection(int clientIdRequested = -1)
        {
            TcpClient tcpClient = new TcpClient();
            try
            {
                tcpClient.Connect("localhost", 3334);
                Console.WriteLine("Connection established");
            }
            catch (Exception e)
            {
                Console.WriteLine("Connection wasn't established");
                return -1;
            }


            MessageSender messageSender = new MessageSender(tcpClient.Session);
            MessageReceiver messageReceiver = new MessageReceiver(tcpClient.Session);
            MessageExecutor messageExecutor = new MessageExecutor(messageSender, messageReceiver, new InstantTaskScheduler());
            messageExecutor.Configuration.DefaultTimeout = 10000;
            NotificationListener notificationListener = new NotificationListener();
            messageReceiver.AddListener(-1, notificationListener);

            AuthorizeHciRequest request = new AuthorizeHciRequest();
            request.ClientId = clientIdRequested;
            request.Locale = "en-US";
            var future = messageExecutor.Submit<AuthorizeHciResponse>(request);
            future.Wait();
            AuthorizeHciResponse AuthorizeHciResponse = future.Value;
            int clientId = AuthorizeHciResponse.ClientId;

            LoginRequest loginRequest = new LoginRequest();
            loginRequest.UserLogin = "admin";
            loginRequest.UserPassword = "admin";
            loginRequest.ClientId = clientId;
            var loginResponcetask = messageExecutor.Submit<LoginResponse>(loginRequest);
            loginResponcetask.Wait();

            Console.WriteLine("Login successfully");

            GetObjectListRequest getObjectListRequest = new GetObjectListRequest()
            {
                ClientId = clientId,
                ObjectType = "Vehicle",
                RefreshDependencies = true
            };

            var task = messageExecutor.Submit<GetObjectListResponse>(getObjectListRequest);
            task.Wait();

            List<Vehicle> vehiclesList = new List<Vehicle>();
            var list = task.Value;
            if (list != null)
            {
                foreach (var v in list.Objects)
                {
                    System.Console.WriteLine(string.Format("name: {0}; id: {1}; type: {2}",
                           v.Vehicle.Name, v.Vehicle.Id, v.Vehicle.Type.ToString()));
                    vehiclesList.Add(v.Vehicle);
                }

                Vehicle vehicle1 = task.Value.Objects.FirstOrDefault().Vehicle;
            }

            Client newClient = new Client(clientId, messageExecutor, notificationListener, vehiclesList);
            this.clients.Add(clientId, newClient);
            logSubscription(clientId, messageExecutor, notificationListener);
            telemetrySubscription(clientId, messageExecutor, notificationListener);

            foreach (Vehicle v in vehiclesList)
            {
                vehicleNotificationSubscription(clientId, v, messageExecutor, notificationListener);
                vehicleCommandSubscription(clientId, v, messageExecutor, notificationListener);
            }

            return clientId;
        }

        private Mission importMission(string filePath, int clientId, MessageExecutor messageExecutor)
        {
            var byteArray = File.ReadAllBytes(filePath);
            ImportMissionRequest importMissionRequest = new ImportMissionRequest()
            {
                ClientId = clientId,
                MissionData = byteArray,
                Filename = "Demo mission.json"
            };
            var importMissionResponse = messageExecutor.Submit<ImportMissionResponse>(importMissionRequest);
            importMissionResponse.Wait();
            var mission = importMissionResponse.Value.Mission;
            System.Console.WriteLine("Demo mission.xml imported to UCS with name '{0}'", mission.Name);
            return mission;
        }

        private Mission getMissionFromServer(Mission mission, int clientId, MessageExecutor messageExecutor)
        {
            GetObjectRequest getMissionObjectRequest = new GetObjectRequest()
            {
                ClientId = clientId,
                ObjectType = "Mission",
                ObjectId = mission.Id,
                RefreshDependencies = true
            };
            var getMissionObjectResponse = messageExecutor.Submit<GetObjectResponse>(getMissionObjectRequest);
            getMissionObjectResponse.Wait();
            var missionFromUcs = getMissionObjectResponse.Value.Object.Mission;
            return missionFromUcs;
        }

        private Vehicle getRequestedVehicle(int vehicleID, int clientId, MessageExecutor messageExecutor)
        {
            GetObjectRequest requestVehicle = new GetObjectRequest()
            {
                ClientId = clientId,
                ObjectType = "Vehicle",
                ObjectId = vehicleID, //EMU-COPTER-17
                RefreshDependencies = true
            };
            var responseVehicle = messageExecutor.Submit<GetObjectResponse>(requestVehicle);
            responseVehicle.Wait();
            Vehicle requestedVehicle = responseVehicle.Value.Object.Vehicle;
            return requestedVehicle;
        }

        private void saveRouteToServer(Route route, int clientId, MessageExecutor messageExecutor)
        {
            CreateOrUpdateObjectRequest routeSaveRequest = new CreateOrUpdateObjectRequest()
            {
                ClientId = clientId,
                Object = new DomainObjectWrapper().Put(route, "Route"),
                WithComposites = true,
                ObjectType = "Route",
                AcquireLock = false
            };
            var routSaveTask = messageExecutor.Submit<CreateOrUpdateObjectResponse>(routeSaveRequest);
            routSaveTask.Wait();
        }

        private void sendCommandToVehicle(Vehicle vehicle, String command, int clientId, MessageExecutor messageExecutor)
        {
            SendCommandRequest commandRequest = new SendCommandRequest
            {
                ClientId = clientId,
                Command = new UGCS.Sdk.Protocol.Encoding.Command
                {
                    Code = command,
                    Subsystem = Subsystem.S_FLIGHT_CONTROLLER,
                }
            };
            commandRequest.Vehicles.Add(vehicle);
            var commandResponce = messageExecutor.Submit<SendCommandResponse>(commandRequest);
            commandResponce.Wait();
        }

        private ProcessedRoute processRoute(Route route, int clientId, MessageExecutor messageExecutor)
        {
            ProcessRouteRequest processRoutRequest = new ProcessRouteRequest
            {
                ClientId = clientId,
                Route = route,
            };
            MessageFuture<ProcessRouteResponse> processRoutResponce = messageExecutor.Submit<ProcessRouteResponse>(processRoutRequest);
            processRoutResponce.Wait();
            ProcessedRoute processed = processRoutResponce.Value.ProcessedRoute;
            return processed;
        }

        private void uplaodRouteToVehice(Route route, Vehicle vehicle, int clientId, MessageExecutor messageExecutor)
        {
            UploadRouteRequest uploadRequest = new UploadRouteRequest
            {
                ClientId = clientId,
                //ProcessedRoute = importedRoute.ProcessedRoute,
                ProcessedRoute = route.ProcessedRoute,
                Vehicle = vehicle,
            };
            MessageFuture<UploadRouteResponse> uploadTask = messageExecutor.Submit<UploadRouteResponse>(uploadRequest);
            uploadTask.Wait();
        }

        private void vehicleNotificationSubscription(int clientId, Vehicle vehicle, MessageExecutor messageExecutor, NotificationListener notificationListener)
        {
            //copied !!!
            var eventSubscriptionWrapper = new EventSubscriptionWrapper();
            eventSubscriptionWrapper.ObjectModificationSubscription = new ObjectModificationSubscription();
            eventSubscriptionWrapper.ObjectModificationSubscription.ObjectId = vehicle.Id;
            eventSubscriptionWrapper.ObjectModificationSubscription.ObjectType = "Vehicle";
            SubscribeEventRequest requestEvent = new SubscribeEventRequest();
            requestEvent.ClientId = clientId;
            requestEvent.Subscription = eventSubscriptionWrapper;
            var responce = messageExecutor.Submit<SubscribeEventResponse>(requestEvent);
            responce.Wait();
            var subscribeEventResponse = responce.Value;
            SubscriptionToken st = new SubscriptionToken(subscribeEventResponse.SubscriptionId, (
                (notification) =>
                {
                    Console.WriteLine("notification - {0}", notification);
                }
            ), eventSubscriptionWrapper);
            notificationListener.AddSubscription(st);
        }

        private void vehicleCommandSubscription(int clientId, Vehicle vehicle, MessageExecutor messageExecutor, NotificationListener notificationListener)
        {
            //copied !!
            EventSubscriptionWrapper commandSubscription = new EventSubscriptionWrapper()
            {
                CommandSubscription = new CommandSubscription(),
            };
            commandSubscription.CommandSubscription.Vehicle = vehicle;

            SubscribeEventRequest requestEventCommand = new SubscribeEventRequest();
            requestEventCommand.ClientId = clientId;
            requestEventCommand.Subscription = commandSubscription;

            var response = messageExecutor.Submit<SubscribeEventResponse>(requestEventCommand);
            response.Wait();
            var subscribeEventResponseCommand = response.Value;
            SubscriptionToken stCommand = new SubscriptionToken(subscribeEventResponseCommand.SubscriptionId,
                notification =>
                {
                    foreach (CommandDefinition cd in notification.Event.CommandEvent.Commands)
                    {
                        System.Console.WriteLine("CommandDefinition Name: {0} Code: {1}", cd.Name, cd.Code);
                    }
                },
                commandSubscription);
            notificationListener.AddSubscription(stCommand);
        }

        private void logSubscription(int clientId, MessageExecutor messageExecutor, NotificationListener notificationListener)
        {
            // copied !!
            var logSubscriptionWrapper = new EventSubscriptionWrapper();
            logSubscriptionWrapper.ObjectModificationSubscription = new ObjectModificationSubscription();
            logSubscriptionWrapper.ObjectModificationSubscription.ObjectType = "VehicleLogEntry";
            SubscribeEventRequest requestLogEvent = new SubscribeEventRequest();
            requestLogEvent.ClientId = clientId;
            requestLogEvent.Subscription = logSubscriptionWrapper;
            var responceLog = messageExecutor.Submit<SubscribeEventResponse>(requestLogEvent);
            var subscribeEventResponseLog = responceLog.Value;

            SubscriptionToken stLog = new SubscriptionToken(subscribeEventResponseLog.SubscriptionId, (
                (notification) =>
                {
                    var eventType = notification.Event.ObjectModificationEvent.ModificationType;
                    var eventLog = notification.Event.ObjectModificationEvent.Object.VehicleLogEntry;
                    if (eventType == ModificationType.MT_CREATE)
                    {
                        DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                        DateTime date = start.AddMilliseconds(eventLog.Time).ToLocalTime();
                        System.Console.WriteLine("LOG: {0} Vehicle id: {1} Message: {2}", date.ToString("HH:mm:ss"), eventLog.Vehicle.Id, eventLog.Message);
                    }

                }), logSubscriptionWrapper);
            notificationListener.AddSubscription(stLog);

        }

        private static object getTelemetryValue(Value telemetryValue)
        {
            if (telemetryValue == null)
            {
                return null;
            }
            if (telemetryValue.IntValueSpecified)
            {
                return telemetryValue.IntValue;
            }
            if (telemetryValue.LongValueSpecified)
            {
                return telemetryValue.LongValue;
            }
            if (telemetryValue.StringValueSpecified)
            {
                return telemetryValue.StringValue;
            }
            if (telemetryValue.BoolValueSpecified)
            {
                return telemetryValue.BoolValue;
            }
            if (telemetryValue.DoubleValueSpecified)
            {
                return telemetryValue.DoubleValue;
            }
            if (telemetryValue.FloatValueSpecified)
            {
                return telemetryValue.FloatValue;
            }
            return null;
        }

        private void telemetrySubscription(int clientId, MessageExecutor messageExecutor, NotificationListener notificationListener)
        {
            //TelemetrySubscription - copied
            var telemetrySubscriptionWrapper = new EventSubscriptionWrapper();
            telemetrySubscriptionWrapper.TelemetrySubscription = new TelemetrySubscription();
            SubscribeEventRequest requestTelemetryEvent = new SubscribeEventRequest();
            requestTelemetryEvent.ClientId = clientId;
            requestTelemetryEvent.Subscription = telemetrySubscriptionWrapper;
            var responceTelemetry = messageExecutor.Submit<SubscribeEventResponse>(requestTelemetryEvent);
            responceTelemetry.Wait();
            var subscribeEventResponseTelemetry = responceTelemetry.Value;
            SubscriptionToken stTelemetry = new SubscriptionToken(subscribeEventResponseTelemetry.SubscriptionId, (
                (notification) =>
                {
                    foreach (Telemetry t in notification.Event.TelemetryEvent.Telemetry)
                    {
                        if (t.TelemetryField.Code == "altitude_agl" && this.clients[clientId].clientData.validDrone(notification.Event.TelemetryEvent.Vehicle.Id) && t.Value != null)
                        {

                            //I added this part - in case the altitudeAGL value changed - update the relevant vehicl's telemetry
                            double newAlt = (double)System.Math.Round((double)getTelemetryValue(t.Value), 2);
                            if(newAlt < 1)
                            {
                                newAlt = 0.0;
                            }
                            this.clients[clientId].clientData.droneDataArr[notification.Event.TelemetryEvent.Vehicle.Id - 1].altitudeAgl = newAlt;
                            System.Console.WriteLine(getTelemetryValue(t.Value));
                            System.Console.WriteLine(t.Value.LongValueSpecified);
                            System.Console.WriteLine(t.Value.DoubleValueSpecified);
                        }
                        //System.Console.WriteLine("!!!Vehicle id: {0} Code: {1} Semantic {2} Subsystem {3} Value {4} ToString {5}", notification.Event.TelemetryEvent.Vehicle.Id, t.TelemetryField.Code, t.TelemetryField.Semantic, t.TelemetryField.Subsystem, getTelemetryValue(t.Value), t.TelemetryField.ToString());
                    }
                }
            ), telemetrySubscriptionWrapper);
            notificationListener.AddSubscription(stTelemetry);
        }

        public bool handleMission(int clientId, String missionPath, int vehicleId, string action)
        {
            if (!checkVehicleId(clientId, vehicleId))
                return false; //Wrong vehicleId
            try
            {
                MessageExecutor messageExecutor = this.clients[clientId].messageExecutor;
                NotificationListener notificationListener = this.clients[clientId].notificationListener;

                Mission mission = importMission(missionPath, clientId, messageExecutor);
                Mission missionFromUcs = getMissionFromServer(mission, clientId, messageExecutor);

                List<Route> routes = missionFromUcs.Routes;
                Route chosenRoute = null;
                foreach (Route r in routes)
                {
                    if (r.Name == action)
                    {
                        chosenRoute = r;
                        break;
                    }

                }

                if (chosenRoute == null)
                {
                    return false;
                }

                //add vehicle prfile and mission to route
                Vehicle requestedVehicle = getRequestedVehicle(vehicleId, clientId, messageExecutor);


                chosenRoute.VehicleProfile = requestedVehicle.Profile;
                chosenRoute.Mission = mission;

                saveRouteToServer(chosenRoute, clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "disarm", clientId, messageExecutor);
                chosenRoute.ProcessedRoute = processRoute(chosenRoute, clientId, messageExecutor);
                uplaodRouteToVehice(chosenRoute, requestedVehicle, clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "arm", clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "auto", clientId, messageExecutor);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        public double getVehicleAlt(int clientId, int vehicleId)
        {
            return this.clients[clientId].clientData.droneDataArr[vehicleId - 1].altitudeAgl;
        }

        public bool pauseMission(int clientId, int vehicleId)
        {
            //Return Home Code: return_to_home
            //Hold Code: mission_pause
            //Continue Code: mission_resume
            try
            {
                MessageExecutor messageExecutor = this.clients[clientId].messageExecutor;
                Vehicle requestedVehicle = getRequestedVehicle(vehicleId, clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "mission_pause", clientId, messageExecutor);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }


        public bool resumeMission(int clientId, int vehicleId)
        {
            //Return Home Code: return_to_home
            //Hold Code: mission_pause
            //Continue Code: mission_resume
            try
            {
                MessageExecutor messageExecutor = this.clients[clientId].messageExecutor;
                Vehicle requestedVehicle = getRequestedVehicle(vehicleId, clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "mission_resume", clientId, messageExecutor);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        public bool returnHomeMission(int clientId, int vehicleId)
        {
            //Return Home Code: return_to_home
            //Hold Code: mission_pause
            //Continue Code: mission_resume
            try
            {
                MessageExecutor messageExecutor = this.clients[clientId].messageExecutor;
                Vehicle requestedVehicle = getRequestedVehicle(vehicleId, clientId, messageExecutor);
                sendCommandToVehicle(requestedVehicle, "return_to_home", clientId, messageExecutor);
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }

        private bool checkVehicleId(int clientId, int vehicleId)
        {
            foreach (var v in this.clients[clientId].clientData.droneDataArr)
            {
                if (v.vehicleId == vehicleId)
                    return true;
            }
            return false;
        }

        public long[] getVeichledId(int clientId)
        {

            long[] arr = new long[this.clients[clientId].clientData.droneDataArr.Length];
            int i = 0;
            foreach (DroneData dd in this.clients[clientId].clientData.droneDataArr)
            {
                arr[i] = dd.vehicleId;
                i++;
            }
            return arr;
        }


        public void updateBatteryLvl(int clientId)
        {
            MessageExecutor messageExecutor = this.clients[clientId].messageExecutor;
            foreach (DroneData dd in this.clients[clientId].clientData.droneDataArr)
            {

                Vehicle requestedVehicle = getRequestedVehicle(dd.vehicleId, clientId, messageExecutor);
                // Get Telemetry for vehicle
                
                DateTime utcTime = DateTime.Now.ToUniversalTime();
                DateTime posixEpoch = new DateTime(2020, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                TimeSpan span = utcTime - posixEpoch;
                var beginningMilliseconds = (long)span.TotalMilliseconds;
                MessageFuture<GetTelemetryResponse> telemetryFuture = messageExecutor.Submit<GetTelemetryResponse>(new GetTelemetryRequest
                {
                    ClientId = clientId,
                    Vehicle = requestedVehicle,
                    Limit = 0,
                    LimitSpecified = true,
                    ToTimeSpecified = false
                });
                telemetryFuture.Wait();
                GetTelemetryResponse telemetryResp = telemetryFuture.Value;

                bool found = false;
                int batteryLvl = 0;
                foreach (Telemetry t in telemetryResp.Telemetry)
                {
                    if(t.TelemetryField.Code == "")
                    {
                        found = true;
                        batteryLvl = (int)getTelemetryValue(t.Value);
                        break;
                    }
                }

                if (found)
                {
                    this.clients[clientId].clientData.droneDataArr[1].battery = batteryLvl;
                    return;
                }
                

                /*
                Console.WriteLine("vehicleId = " + dd.vehicleId + "##################################");
                foreach (VehicleParameter vp in requestedVehicle.Profile.Parameters)
                {
                    Console.WriteLine(vp.Type);
                    Console.WriteLine(vp.Value);
                }*/
                if (dd.vehicleId == 1)
                {
                    this.clients[clientId].clientData.droneDataArr[0].battery = 10;

                }
                else if (dd.vehicleId == 2)
                {
                    this.clients[clientId].clientData.droneDataArr[1].battery = 80;
                }

            }

        }
    }
}
