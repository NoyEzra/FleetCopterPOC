using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UGCS.Sdk.Protocol;
using UGCS.Sdk.Protocol.Encoding;
using UGCS.Sdk.Tasks;

namespace FleetCopterPOC.Controllers
{
    public class UgcsController : Controller
    {
        UgcsHandler ugcsHandler { get; set; }
        public UgcsController()
        {
            ugcsHandler = null;
        }

        [HttpGet]
        public string executeMission()
        {
            if (this.ugcsHandler == null)
                this.ugcsHandler = new UgcsHandler();
            int vehicleId = 2;
            if (this.ugcsHandler.handleSimulationMission("Demo mission.json", vehicleId))
            {
                int[] viechles = this.ugcsHandler.getVeichledId();
                Client c = new Client(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                c.droneDataArr[1].state = State.resumeState.ToString();
                return c.jsonString();
            }
            return "{\"Answer\": false}";

        }

        [HttpGet]  //Ugcs/pauseMission?clientId=20474&vehicleId=2
        public string pauseMission([FromQuery]int clientId, [FromQuery] int vehicleId=2)
        {
            if (this.ugcsHandler == null)
                this.ugcsHandler = new UgcsHandler(clientId);
            if (this.ugcsHandler.pauseMission(clientId, vehicleId))
            {
                int[] viechles = this.ugcsHandler.getVeichledId();
                Client c = new Client(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                c.droneDataArr[1].state = State.pauseState.ToString();
                return c.jsonString();
            }
            return "{\"Answer\": false}";

        }

        [HttpGet]
        public string resumeMission([FromQuery] int clientId, [FromQuery] int vehicleId = 2)
        {
            if (this.ugcsHandler == null)
                this.ugcsHandler = new UgcsHandler(clientId);
            if (this.ugcsHandler.resumeMission(clientId, vehicleId))
            {
                int[] viechles = this.ugcsHandler.getVeichledId();
                Client c = new Client(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                c.droneDataArr[1].state = State.resumeState.ToString();
                return c.jsonString();
            }
            return "{\"Answer\": false}";

        }

        [HttpGet]
        public string returnHomeMission([FromQuery] int clientId, [FromQuery] int vehicleId = 2)
        {
            if (this.ugcsHandler == null)
                this.ugcsHandler = new UgcsHandler(clientId);
            if (this.ugcsHandler.returnHomeMission(clientId, vehicleId))
            {
                int[] viechles = this.ugcsHandler.getVeichledId();
                Client c = new Client(this.ugcsHandler.clientId, viechles[0], viechles[1]);
                c.droneDataArr[1].state = State.stopState.ToString();
                return c.jsonString();
            }
            return "{\"Answer\": false}";

        }

        public String vehicleAlt()
        {
            Double vehicleAlt = this.ugcsHandler.getVehicleAlt(2);
            return vehicleAlt.ToString();
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
