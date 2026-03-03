import { useEffect, useState } from "react";

function Star({ size, full, collor, handleClick, handleEnter, handleRemove }) {
  return (
    <>
      <svg
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleRemove}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          cursor: "pointer",
          fill: `${full ? collor : "none"}`,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        stroke="black"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </>
  );
}
function StarRating({ length, setUserRating }) {
  const [rating, setRating] = useState(null);
  const [tempRating, setTempRating] = useState(null);
  setUserRating(rating);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        justifyContent: "space-around",
      }}
    >
      <div>
        {Array.from({ length }).map((_, index) => {
          return (
            <Star
              handleClick={() => {
                setRating(index + 1);
              }}
              handleRemove={() => {
                setTempRating(0);
              }}
              handleEnter={() => {
                setTempRating(index + 1);
              }}
              key={index}
              size={25}
              full={index < (tempRating || rating)}
              collor={"yellow"}
            />
          );
        })}
      </div>

      <p>{tempRating || rating || 0}</p>
    </div>
  );
}

export default StarRating;
