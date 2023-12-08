import React, { useEffect, useState } from 'react';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {TabPanel, TabView} from "primereact/tabview";
import { Chart } from 'primereact/chart';
import './InfoPanel.css'

const InfoPanel = ({ city }) => {
    const [cityName, setCityName] = useState(null);

    useEffect(() => {
        if (city && city.city) {
            console.log(city.time.iso);
            setCityName(city);
        }
    }, [city]);

    // Créer un objet de mappage pour les noms personnalisés et les unités de mesure
    const keyMapping = {
        co: { name: 'Monoxyde de carbone', unit: 'ppm', description: 'Concentration de monoxyde de carbone dans l\'air.' },
        h: { name: 'Humidité', unit: '%', description: 'Pourcentage d\'humidité dans l\'air.' },
        no2: { name: 'Dioxyde d\'azote', unit: 'ppb', description: 'Concentration de dioxyde d\'azote dans l\'air.' },
        o3: { name: 'Ozone', unit: 'ppb', description: 'Concentration d\'ozone dans l\'air.' },
        p: { name: 'Pression atmosphérique', unit: 'hPa', description: 'Pression atmosphérique mesurée en hectopascals.' },
        pm10: { name: 'Particules < 10µm', unit: 'µg/m³', description: 'Concentration de particules de moins de 10 micromètres dans l\'air.' },
        pm25: { name: 'Particules < 2.5µm', unit: 'µg/m³', description: 'Concentration de particules de moins de 2,5 micromètres dans l\'air.' },
        so2: { name: 'Dioxyde de soufre', unit: 'ppb', description: 'Concentration de dioxyde de soufre dans l\'air.' },
        t: { name: 'Température', unit: '°C', description: 'Température de l\'air en degrés Celsius.' },
        w: { name: 'Vitesse du vent', unit: 'm/s', description: 'Vitesse du vent en mètres par seconde.' }
    };

    // Convertir l'objet iaqi en un tableau
    const iaqiArray = cityName && cityName.iaqi ? Object.entries(cityName.iaqi).map(([key, value]) => {
        const mappedKey = keyMapping[key];
        return {
            description: mappedKey ? mappedKey.description : '',
            key: mappedKey ? mappedKey.name : key,
            value: `${value.v} ${mappedKey ? mappedKey.unit : ''}`,
        };
    }) : [];

    // Fonction de rendu de cellule pour la colonne d'information
    const infoColumnBodyTemplate = (rowData) => {
        return (
            <Button type="button" icon="pi pi-info" className="p-button-rounded p-button-info p-mr-2" tooltip={rowData.description} />
        );
    };

    return (
        <div style={{position: 'absolute', right: 0, top: 0, width: '500px', height: '100%', background: 'white', padding: '20px', overflow: 'auto'}}>
            <h2>Information</h2>
            {cityName && cityName.city && (
                <div>
                    <h3>{cityName.city.name}</h3>
                    <h4>Dernière mise à jour : {new Date(cityName.time.iso).toLocaleString()}</h4>
                    <DataTable value={iaqiArray}>
                        <Column body={infoColumnBodyTemplate}></Column>
                        <Column field="key" header="Type données"></Column>
                        <Column field="value" header="Valeur de la donnée"></Column>
                    </DataTable>

                    <h4>Prevision des données de polution</h4>

                    <TabView scrollable>
                        {Object.keys(cityName.forecast.daily).map((key) => {
                            const forecastData = cityName.forecast.daily[key];

                            // Créer des données de graphique
                            const chartData = {
                                labels: forecastData.map(data => data.day),
                                datasets: [
                                    {
                                        label: keyMapping[key] ? keyMapping[key].name : key,
                                        data: forecastData.map(data => data.avg),
                                        fill: false,
                                        borderColor: '#4bc0c0'
                                    }
                                ]
                            };

                            return (
                                <TabPanel key={key} header={keyMapping[key] ? keyMapping[key].name : key}>
                                    <Chart type="line" data={chartData} />
                                </TabPanel>
                            );
                        })}
                    </TabView>
                </div>
            )}
        </div>
    );
};

export default InfoPanel;
