﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UGCS.Sdk.Protocol;
using UGCS.Sdk.Protocol.Encoding;
using UGCS.Sdk.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace FleetCopterPOC.Controllers
{
    public class UgcsController : Controller
    {
        UgcsHandler ugcsHandler { get; set; }


        private string createSuccessResponse(string droneData)
        {
            JProperty status = new JProperty("status", "success");
            JProperty dd = new JProperty("droneData", droneData);
            JObject ans = new JObject(status, dd);
            return ans.ToString();
        }

        private string createErrorResponse(string errorMsg)
        {
            JProperty status = new JProperty("status", "error");
            JProperty msg = new JProperty("errMsg", "errorMsg");
            JObject ans = new JObject(status, msg);
            return ans.ToString();
        }

        [HttpGet]//Ugcs/executeMission?clientId=20474&vehicleId=2&mission=FlyBy
        public string executeMission([FromQuery]int clientId, [FromQuery] string mission, [FromQuery] int vehicleId=2)
        {
            
            this.ugcsHandler = UgcsHandler.Instance;
            //upon first connection
            if (clientId == 0 || !ugcsHandler.clients.ContainsKey(clientId))
                clientId = this.ugcsHandler.startConnection();
            if (this.ugcsHandler.handleMission(clientId, "Demo mission.json", vehicleId, mission))
            {
                //int[] viechles = this.ugcsHandler.getVeichledId(clientId);
                //ClientData c = new ClientData(clientId, viechles[0], viechles[1]);
                ClientData cd = this.ugcsHandler.clients[clientId].clientData;
                cd.droneDataArr[1].state = State.resumeState.ToString();
                return createSuccessResponse(cd.jsonString());
            }
            return createErrorResponse("Commad execution failed");

        }

        [HttpGet]  //Ugcs/pauseMission?clientId=20474&vehicleId=2
        public string pauseMission([FromQuery]int clientId, [FromQuery] int vehicleId=2)
        {
            this.ugcsHandler = UgcsHandler.Instance;
            //upon first connection
            if (clientId == 0 || !ugcsHandler.clients.ContainsKey(clientId))
                clientId = this.ugcsHandler.startConnection();
            if (this.ugcsHandler.pauseMission(clientId, vehicleId))
            {
                //int[] viechles = this.ugcsHandler.getVeichledId();
                //ClientData c = new ClientData(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                ClientData cd = this.ugcsHandler.clients[clientId].clientData;
                cd.droneDataArr[1].state = State.pauseState.ToString();
                return createSuccessResponse(cd.jsonString());
            }
            return createErrorResponse("Commad execution failed");

        }

        [HttpGet]
        public string resumeMission([FromQuery] int clientId, [FromQuery] int vehicleId = 2)
        {
            this.ugcsHandler = UgcsHandler.Instance;
            //upon first connection
            if (clientId == 0 || !ugcsHandler.clients.ContainsKey(clientId))
                Console.WriteLine("firstConnection");
                clientId = this.ugcsHandler.startConnection();
            if (this.ugcsHandler.resumeMission(clientId, vehicleId))
            {
                //int[] viechles = this.ugcsHandler.getVeichledId();
                //ClientData c = new ClientData(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                ClientData cd = this.ugcsHandler.clients[clientId].clientData;
                cd.droneDataArr[1].state = State.resumeState.ToString();
                return createSuccessResponse(cd.jsonString());
            }
            return createErrorResponse("Commad execution failed");

        }

        [HttpGet]
        public string returnHomeMission([FromQuery] int clientId, [FromQuery] int vehicleId = 2)
        {
            this.ugcsHandler = UgcsHandler.Instance;
            //upon first connection
            if (clientId == 0 || !ugcsHandler.clients.ContainsKey(clientId))
                clientId = this.ugcsHandler.startConnection();
            if (this.ugcsHandler.returnHomeMission(clientId, vehicleId))
            {
                //int[] viechles = this.ugcsHandler.getVeichledId();
                //ClientData c = new ClientData(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                ClientData cd = this.ugcsHandler.clients[clientId].clientData;
                cd.droneDataArr[1].state = State.stopState.ToString();
                return createSuccessResponse(cd.jsonString());
            }
            return createErrorResponse("Commad execution failed");

        }

        [HttpGet]
        public string updateDronesData([FromQuery] int clientId)
        {
            this.ugcsHandler = UgcsHandler.Instance;
            //upon first connection
            if (clientId == 0 || !ugcsHandler.clients.ContainsKey(clientId))
                clientId = this.ugcsHandler.startConnection();
            this.ugcsHandler.updateBatteryLvl(clientId);
            ClientData cd = this.ugcsHandler.clients[clientId].clientData;
            return cd.jsonString();
        }


        [HttpGet]
        public string getAvailableVehicles([FromQuery] int clientId)
        {
            return "";
        }

        // GET: UgcsController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: UgcsController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: UgcsController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UgcsController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: UgcsController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: UgcsController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: UgcsController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
