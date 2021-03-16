using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public enum State 
{ 
	resumeState,
	pauseState,
	stopState
}
public class DroneData
{
	public int vehicleId { get; set; }
    public string state { get; set; }
	public double altitudeAgl { get; set; }
	public double latitude { get; set; }
	public double longitude { get; set; }
	public int battery { get; set; }
	public bool isAvailable { get; set; }
	public bool isOnPerimeter { get; set; }

	public DroneData(int id)
	{
		this.vehicleId = id;
		this.state = State.stopState.ToString();
		this.altitudeAgl = 0.0;
		this.battery = 0;
		this.isAvailable = true;
		this.isOnPerimeter = false;
		this.latitude = 0.0;
		this.longitude = 0.0;
	}

	public string jsonString()
    {
		return JsonSerializer.Serialize(this);
	}
}
