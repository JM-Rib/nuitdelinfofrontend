import React, { useEffect, useState } from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const InfoPanel = ({ city }) => {
    const [cityName, setCityName] = useState(null);

    useEffect(() => {
        if (city && city.city) {
            console.log(city.iaqi);
            setCityName(city);
        }
    }, [city]);

    // Convertir l'objet iaqi en un tableau
    const iaqiArray = cityName && cityName.iaqi ? Object.entries(cityName.iaqi).map(([key, value]) => ({ key, value })) : [];

    return (
        <div style={{position: 'absolute', right: 0, top: 0, width: '200px', height: '100%', background: 'white', padding: '20px'}}>
            <h2>Information</h2>
            {cityName && cityName.city && (
                <div>
                    <h3>{cityName.city.name}</h3>
                    <DataTable value={iaqiArray}>
                        <Column field="key" header="Key"></Column>
                        <Column field="value.v" header="Value"></Column>
                    </DataTable>
                </div>
            )}
        </div>
    );
};

export default InfoPanel;
