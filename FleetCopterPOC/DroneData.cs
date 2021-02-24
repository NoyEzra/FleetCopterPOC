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

	public DroneData(int id)
	{
		vehicleId = id;
		state = State.stopState.ToString();
	}

	public string jsonString()
    {
		return JsonSerializer.Serialize(this);
	}
}
