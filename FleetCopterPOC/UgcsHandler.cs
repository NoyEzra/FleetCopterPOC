using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading.Tasks;
using UGCS.Sdk.Protocol;
using UGCS.Sdk.Protocol.Encoding;
using UGCS.Sdk.Tasks;
using System.IO;

namespace FleetCopterPOC
{
    public class UgcsHandler
    {
        public int clientId { get; private set; }
        private MessageExecutor messageExecutor { get; set; }
        private NotificationListener notificationListener { get; set; }
        private Dictionary<int, VehicleTelemetry> vehiclesTelemetry { get; set; }
        public UgcsHandler()
        {
            startConnection(); 
        }

        public void startConnection()
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
                return;
            }

            
            MessageSender messageSender = new MessageSender(tcpClient.Session);
            MessageReceiver messageReceiver = new MessageReceiver(tcpClient.Session);
            messageExecutor = new MessageExecutor(messageSender, messageReceiver, new InstantTaskScheduler());
            messageExecutor.Configuration.DefaultTimeout = 10000;
            notificationListener = new NotificationListener();
            messageReceiver.AddListener(-1, notificationListener);

            AuthorizeHciRequest request = new AuthorizeHciRequest();
            request.ClientId = -1;
            request.Locale = "en-US";
            var future = messageExecutor.Submit<AuthorizeHciResponse>(request);
            future.Wait();
            AuthorizeHciResponse AuthorizeHciResponse = future.Value;
            clientId = AuthorizeHciResponse.ClientId;

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
            //getObjectListRequest.RefreshExcludes.Add("Avatar");
            //getObjectListRequest.RefreshExcludes.Add("PayloadProfile");
            //getObjectListRequest.RefreshExcludes.Add("Route");
            var task = messageExecutor.Submit<GetObjectListResponse>(getObjectListRequest);
            task.Wait();

            this.vehiclesTelemetry = new Dictionary<int, VehicleTelemetry>();
            List<Vehicle> vehiclesList = new List<Vehicle>();
            var list = task.Value;
            if (list != null)
            {
                foreach (var v in list.Objects)
                {
                    System.Console.WriteLine(string.Format("name: {0}; id: {1}; type: {2}",
                           v.Vehicle.Name, v.Vehicle.Id, v.Vehicle.Type.ToString()));
                    vehiclesList.Add(v.Vehicle);
                    vehiclesTelemetry.Add(v.Vehicle.Id, new VehicleTelemetry(v.Vehicle.Id));
                }

                Vehicle vehicle1 = task.Value.Objects.FirstOrDefault().Vehicle;
            }
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

        private void vehicleNotificationSubscription(Vehicle vehicle)
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

        private void vehicleCommandSubscription(Vehicle vehicle)
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

        private void logSubscription()
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

        private void telemetrySubscription()
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
                        if (t.TelemetryField.Code == "altitude_agl")
                        {
                            //I added this part - in case the altitudeAGL value changed - update the relevant vehicl's telemetry
                            this.vehiclesTelemetry[notification.Event.TelemetryEvent.Vehicle.Id].altitudeAgl = (double)getTelemetryValue(t.Value);
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

        public bool handleSimulationMission(String missionPath)
        {
            try
            {
                Mission mission = importMission(missionPath, clientId, messageExecutor);
                Mission missionFromUcs = getMissionFromServer(mission, clientId, messageExecutor);

                Route route1 = missionFromUcs.Routes[0];
                Route route2 = missionFromUcs.Routes[1];
                Route route3 = missionFromUcs.Routes[2];

                Route chosenRoute = route2;


                //add vehicle prfile and mission to route
                Vehicle requestedVehicle = getRequestedVehicle(2, clientId, messageExecutor);
                vehicleNotificationSubscription(requestedVehicle);
                vehicleCommandSubscription(requestedVehicle);
                logSubscription();
                telemetrySubscription();

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

        public double getVehicleAlt(int vehicleId)
        {
            return this.vehiclesTelemetry[vehicleId].altitudeAgl;
        }
    }
}
