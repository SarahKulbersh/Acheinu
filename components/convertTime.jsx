import React, {useContext} from 'react'
import { EstPreviewContext } from '../Context';

export default function ConvertTime({startTime, endTime, isEST}) {
    const { estPreview, setEstPreview } = useContext(EstPreviewContext)

      // time comes from the database like this "20:00 PM" => "20:00"
  function convertTo24HourFormat(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }
// depending if the user is viewing the jobs in EST or IST
  function convertTime(timeString, isEST) {
    console.log("timeString", timeString)
    const timeStr = convertTo24HourFormat(timeString)
    console.log("timestr", timeStr)
    const [hours, minutes] = timeString.split(":");
    const timeObj = new Date();
    timeObj.setHours(hours);
    timeObj.setMinutes("00");
    if (isEST) {
      if (estPreview === true) {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        timeObj.setHours(timeObj.getHours() + 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    } else {
      if (estPreview === true) {
        timeObj.setHours(timeObj.getHours() - 7);
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      } else {
        return timeObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
      }
    }
  }

  return (
    <div>
        <h1>kkkkk</h1>
        {startTime && endTime ? (
        <>
          {convertTime(startTime, isEST).replace(" ", "")}{" - "}
          {convertTime(endTime, isEST).replace(" ", "")}
          {isEST ? " EST" : "Israel time"}
        </>
      ) : null}</div>
  )
}
