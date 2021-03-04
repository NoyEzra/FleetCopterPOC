using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class ClientData
{
	public int clientId { get; set; }

	//change to dict
	public DroneData[] droneDataArr { get; set; }

	public ClientData(int clientId, int d1, int d2)
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

    public bool validDrone(int id)
    {
		//change when drone data chenged to dict
        return id == 1 || id == 2;
    }
}
