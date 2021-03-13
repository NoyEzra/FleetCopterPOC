using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class ClientData
{
	public int clientId { get; set; }

	//change to dict
	public DroneData[] droneDataArr { get; set; }

	public ClientData(int clientId, int d1, int d2, int d3)
	{
		this.clientId = clientId;
		droneDataArr = new DroneData[2];
		droneDataArr[1] = new DroneData(d1);
		droneDataArr[0] = new DroneData(d2);
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

	public int getVehicleIndex(int vehicleId)
    {
		int idx = -1;
		for(int i = 0; i < droneDataArr.Length; i++)
        {
			if(droneDataArr[i].vehicleId == vehicleId)
            {
				idx = i;
				break;
            }
        }

		return idx;
    }
}
