import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// GeoJSON of Brazil states
const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

interface MapChartProps {
  data: Record<string, number>;
}

// Map state names to their abbreviations just in case the GeoJSON only has names
const stateCentroids: Record<string, [number, number]> = {
  "AC": [-70.5516, -9.0238],
  "AL": [-36.6748, -9.5713],
  "AP": [-52.0255, 1.4195],
  "AM": [-64.6212, -3.4168],
  "BA": [-41.7007, -12.5797],
  "CE": [-39.3206, -5.4984],
  "DF": [-47.9292, -15.7801],
  "ES": [-40.3089, -19.1834],
  "GO": [-49.2533, -15.8270],
  "MA": [-45.2744, -4.9609],
  "MT": [-56.0949, -12.6819],
  "MS": [-54.6201, -20.4428],
  "MG": [-44.2816, -18.5122],
  "PA": [-52.9302, -3.2024],
  "PB": [-36.7820, -7.1153],
  "PR": [-51.9253, -25.2521],
  "PE": [-37.2386, -8.8137],
  "PI": [-42.7222, -7.7183],
  "RJ": [-43.1286, -22.9083],
  "RN": [-36.6813, -5.7945],
  "RS": [-53.2713, -30.0346],
  "RO": [-62.8038, -10.9439],
  "RR": [-60.6733, 2.7376],
  "SC": [-50.2189, -27.2423],
  "SP": [-49.0494, -23.5505],
  "SE": [-37.3857, -10.5741],
  "TO": [-48.3603, -10.1753]
};

const stateNameToId: Record<string, string> = {
  "Acre": "AC",
  "Alagoas": "AL",
  "Amapá": "AP",
  "Amazonas": "AM",
  "Bahia": "BA",
  "Ceará": "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  "Goiás": "GO",
  "Maranhão": "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  "Pará": "PA",
  "Paraíba": "PB",
  "Paraná": "PR",
  "Pernambuco": "PE",
  "Piauí": "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  "Rondônia": "RO",
  "Roraima": "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  "Sergipe": "SE",
  "Tocantins": "TO"
};

export default function MapChart({ data }: MapChartProps) {
  // Calculate the maximum count to set the domain of the color scale
  const maxCount = useMemo(() => {
    const values = Object.values(data);
    return values.length > 0 ? Math.max(...values) : 1;
  }, [data]);

  // Color scale from light green to dark green
  const colorScale = scaleLinear<string>()
    .domain([0, maxCount])
    .range(["#dcfce7", "#15803d"]); // Tailwind green-100 to green-700

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 850,
        center: [-54, -15] // Center of Brazil
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            // Try to find the state abbreviation
            const sigla = geo.properties.sigla || geo.properties.UF_05;
            const name = geo.properties.name || geo.properties.NM_ESTADO;
            
            const stateId = sigla || stateNameToId[name] || "";
            const count = data[stateId] || 0;
            
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={count > 0 ? colorScale(count) : "#f1f5f9"} // slate-100 for 0 count
                stroke="#ffffff"
                strokeWidth={1}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#22c55e", outline: "none", cursor: "pointer" }, // green-500 on hover
                  pressed: { outline: "none" },
                }}
              >
                <title>{name ? `${name}: ${count} pessoa(s)` : `${stateId}: ${count} pessoa(s)`}</title>
              </Geography>
            );
          })
        }
      </Geographies>
      {Object.entries(stateCentroids).map(([stateId, coordinates]) => {
        const count = data[stateId] || 0;
        return (
          <Marker key={stateId} coordinates={coordinates}>
            <text
              textAnchor="middle"
              y={-2}
              style={{
                fontFamily: "system-ui, sans-serif",
                fill: "#334155",
                fontSize: "10px",
                fontWeight: 600,
                pointerEvents: "none",
                stroke: "#ffffff",
                strokeWidth: 2,
                paintOrder: "stroke",
              }}
            >
              {stateId}
            </text>
            <text
              textAnchor="middle"
              y={10}
              style={{
                fontFamily: "system-ui, sans-serif",
                fill: "#0f172a",
                fontSize: "12px",
                fontWeight: 800,
                pointerEvents: "none",
                stroke: "#ffffff",
                strokeWidth: 2,
                paintOrder: "stroke",
              }}
            >
              {count}
            </text>
          </Marker>
        );
      })}
    </ComposableMap>
  );
}
