/* eslint-env node */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://raw.githubusercontent.com/joelacus/world-cities/main/world_cities.json';
const outputPath = path.join(__dirname, '../src/assets/world_cities.json');

const MAX_CITIES = 10000;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const rawCities = JSON.parse(data);

            const citiesGroupedByCountry = rawCities.reduce((acc, city) => {
                if (!acc[city.country]) {
                    acc[city.country] = [];
                }
                acc[city.country].push(city);
                return acc;
            }, {});

            const countries = Object.keys(citiesGroupedByCountry);
            const maxCitiesPerCountry = Math.floor(MAX_CITIES / countries.length);
            const cities = countries
                .map((country) =>
                    citiesGroupedByCountry[country]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .slice(0, maxCitiesPerCountry)
                )
                .flat();

            const transformedData = {
                metadata: "World Cities",
                config: {
                    isListEnabled: true,
                    isZoomOnSelectEnabled: false,
                    isListFilteredToViewport: false,
                    isShowOnlyURLRecordEnabled: true,
                    isAggressiveOptimizationEnabled: false,
                    typeOfIcon: "dot"
                },
                records: cities.map((city, idx) => ({
                    title: city.name,
                    latitude: Number(city.lat),
                    longitude: Number(city.lng),
                    description: `City in ${city.country}`,
                    id: `world_city_${idx}`
                }))
            };

            fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));
            console.log('Successfully created world_cities.json');
        } catch (error) {
            console.error('Error parsing or writing data:', error);
            process.exit(1);
        }
    });

}).on('error', (err) => {
    console.error('Error downloading data:', err);
    process.exit(1);
});
