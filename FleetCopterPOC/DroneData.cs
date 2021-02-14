using System;
using System.Text.Json;
using System.Text.Json.Serialization;

static class Constants
{
	public const bool Pause = false;
	public const bool Running = true;
}
public class DroneData
{
	public int vehicleId { get; set; }
	public bool isOnFlight { get; set; } //if isOnFlight == false then state doesn't matter
	public bool state { get; set; }

	public DroneData(int id)
	{
		vehicleId = id;
		isOnFlight = false;
	}

	public string jsonString()
    {
		return JsonSerializer.Serialize(this);
	}
}
