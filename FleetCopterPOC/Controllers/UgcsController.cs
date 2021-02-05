using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FleetCopterPOC.Controllers
{
    public class UgcsController : Controller
    {
        UgcsHandler ugcsHandler { get; set; }
        public UgcsController()
        {
            //ugcsHandler = new UgcsHandler();
        }

        [HttpGet]
        public String executeMission()
        {
            if (UgcsHandler.Instance.handleSimulationMission("Demo mission.json"))
                return "{\"Answer\": true}";
            return "{\"Answer\": false}";

        }

        public String vehicleAlt()
        {
            Double vehicle1Alt = UgcsHandler.Instance.getVehicleAlt(1);
            Double vehicle2Alt = UgcsHandler.Instance.getVehicleAlt(2);
            int drone1battery = UgcsHandler.Instance.getBatteryLevel(1);
            int drone2battery = UgcsHandler.Instance.getBatteryLevel(2);
            JProperty drone1Alt = new JProperty("drone1Alt", vehicle1Alt.ToString());
            JProperty drone2Alt = new JProperty("drone2Alt", vehicle2Alt.ToString());
            JProperty drone1Bat = new JProperty("drone1Bat", drone1battery);
            JProperty drone2Bat = new JProperty("drone2Bat", drone2battery);
            JObject ans = new JObject(drone1Alt, drone2Alt, drone1Bat, drone2Bat);
            return ans.ToString();
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
