import { FunctionComponent } from "react";

const POIDetails: FunctionComponent<CustomMarker> = ({
  title,
  description,
}): JSX.Element => {
  return (
    <>
      <h3 className="font-bold mb-2">{title}</h3>

      {!!description && !Array.isArray(description) && <div>{description}</div>}
      {!!description && Array.isArray(description) && (
        <>
          {description.map((descriptionItem) => (
            <div>{descriptionItem}</div>
          ))}
        </>
      )}
    </>
  );
};
export default POIDetails;
