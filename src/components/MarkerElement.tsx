import { FunctionComponent } from "react";
import { Marker, Tooltip } from "react-leaflet";

const MarkerElement: FunctionComponent<CustomMarker> = ({
  title,
  description,
  latitude,
  longitude,
}) => {
  return (
    <Marker position={[latitude, longitude]}>
      <Tooltip direction="top" opacity={1} offset={[0, -50]}>
        <div className="tooltip-content">
          <h3 className="font-bold mb-2">{title}</h3>

          {!!description && !Array.isArray(description) && (
            <div>{description}</div>
          )}

          {!!description && Array.isArray(description) && (
            <>
              {description.map((descriptionItem) => (
                <div>{descriptionItem}</div>
              ))}
            </>
          )}
        </div>
      </Tooltip>
    </Marker>
  );
};

export default MarkerElement;
