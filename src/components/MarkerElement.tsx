import { FunctionComponent, PropsWithChildren } from "react";
import { Marker, Tooltip } from "react-leaflet";

const MarkerElement: FunctionComponent<
  PropsWithChildren<{
    marker: CustomMarker;
    onClick?: () => void;
  }>
> = ({ marker: { latitude, longitude }, onClick, children }) => {
  return (
    <Marker
      position={[latitude, longitude]}
      eventHandlers={{
        dblclick: () => {
          onClick && onClick();
        },
      }}
    >
      {children && (
        <Tooltip direction="top" opacity={1} offset={[0, -50]}>
          {children}
        </Tooltip>
      )}
    </Marker>
  );
};

export default MarkerElement;
