import './App.css';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {slotsData,eventData} from './util'
import { useEffect, useState } from 'react';
import moment from 'moment';

function App() {
  const [slotMinTime,setSlotMinTime] = useState(null);
  const [slotMaxTime,setSlotMaxTime] = useState(null);
  const [timeSlotsDataMapped,setTimeSlotsDataMapped] = useState(null);
  const [eventsDataMapped,setEventsDataMapped] = useState([]);

  useEffect(()=>{
    const tempTimeSlotsDataMapped = [];
    let startTimeOffset = slotsData[0]?.slotStartTime;
    setSlotMinTime(moment(startTimeOffset,"HH:mm:ss").format("HH:mm:ss"))
    slotsData.forEach((slot)=>{
      tempTimeSlotsDataMapped.push({
        start: moment(startTimeOffset,"HH:mm:ss").format("HH:mm:ss"),
        end: moment(startTimeOffset,"HH:mm:ss").add(15,"minutes").format("HH:mm:ss"),
        slotLabelStartTime : slot.slotStartTime,
        slotLabelEndTime : slot.slotEndTime
      });
      startTimeOffset = moment(startTimeOffset,"HH:mm:ss").add(15,"minutes")
    })
    setTimeSlotsDataMapped(tempTimeSlotsDataMapped);
    setSlotMaxTime(moment(startTimeOffset,"HH:mm:ss").format("HH:mm:ss"))
  },[slotsData])

  useEffect(()=>{
    if(timeSlotsDataMapped){
      const tempEventData = [];
      eventData?.forEach((event)=>{
        const correspondingMappedSlot = timeSlotsDataMapped.filter((slot)=>slot.slotLabelStartTime === moment(event?.start).format("HH:mm:ss") && slot.slotLabelEndTime === moment(event?.end).format("HH:mm:ss") )[0]
        tempEventData.push({
          ...event,
          start : `${moment(event?.start).format("YYYY-MM-DD")}T${correspondingMappedSlot?.start}`,
          end : `${moment(event?.end).format("YYYY-MM-DD")}T${correspondingMappedSlot?.end}`
        })
      })
      setEventsDataMapped(tempEventData)
    }
  },[eventData,timeSlotsDataMapped])
  console.log("time data",timeSlotsDataMapped)
  return (
    <div className="App">
      {slotMinTime && slotMaxTime && <FullCalendar
        plugins={[timeGridPlugin]}
        allDaySlot={false}
        slotDuration="00:15:00"
        slotLabelInterval="00:15:00"
        slotMinTime={slotMinTime}
        slotMaxTime={slotMaxTime}
        slotLabelContent={(label)=>{
          const correspondingTimeSlot = timeSlotsDataMapped.filter((slot)=>slot.start === moment(label.date).format("HH:mm:ss"))[0]
          return { html : `<div class="fc-timegrid-slot-label-cushion fc-scrollgrid-shrink-cushion flex flex-col">${moment(correspondingTimeSlot?.slotLabelStartTime,"HH:mm:ss").format("HH:mm")} - ${moment(correspondingTimeSlot?.slotLabelEndTime,"HH:mm:ss").format("HH:mm")}</div>`}
        }}
        contentHeight={680}
        events = {eventsDataMapped}  
        eventContent = {(eventInfo)=>{
          return (
            <div>{eventInfo.event._def.title}</div>
          )
        }}
      />}
    </div>
  );
}

export default App;
