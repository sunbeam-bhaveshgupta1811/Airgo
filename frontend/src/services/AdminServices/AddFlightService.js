import axios from "axios";
import { config } from "../../../config";
import AddFlight from './../../pages/admin/Addflight';

export const fetchAirline = async () => {
    try{
        const response = await axios.get(`${config.serverURL}/admin/addflight`);
        return response.data;   
    }catch(error){
        console.error('Error fetching airline count:',error.response?.data || error.message);
        throw error;
    }
};

export const AddFlight = async(flightData) =>{
    try{
        const response = await axios.post(`${config.serverURL}/admin/addflight`,flightData,
            {
                headers:{
                    'Content-Type': 'applicataion/json',
                },
            }
        );
        return response.data;
    }catch(error){
        console.error('Error adding the flight:',error.response?.data || error.message);
        throw error;
    }
}