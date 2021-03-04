using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class Client
{
	public int clientId { get; set; }
	public DroneData[] droneDataArr { get; set; }

	public Client(int clientId, int d1, int d2)
	{
		this.clientId = clientId;
		droneDataArr = new DroneData[2];
		droneDataArr[0] = new DroneData(d1);
		droneDataArr[1] = new DroneData(d2);
	}

	public string jsonString()
	{
		return JsonSerializer.Serialize(this);
	}
}
