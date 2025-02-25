import React from "react";
import { ScheduleComponent, Inject, TimelineViews, TimelineMonth, ResourceDirective, ResourcesDirective } from "@syncfusion/ej2-react-schedule";
import "../styles/Calendario.css";

const Calendario = () => {
  const etapasProduccion = [
    { Id: 1, Subject: "Medición", StartTime: new Date(2024, 5, 1), EndTime: new Date(2024, 5, 3), CategoryColor: "#00a46e" },
    { Id: 2, Subject: "Corte de Perfiles", StartTime: new Date(2024, 5, 4), EndTime: new Date(2024, 5, 6), CategoryColor: "#f39c12" },
    { Id: 3, Subject: "Armado", StartTime: new Date(2024, 5, 7), EndTime: new Date(2024, 5, 10), CategoryColor: "#e74c3c" },
    { Id: 4, Subject: "Vidriado", StartTime: new Date(2024, 5, 11), EndTime: new Date(2024, 5, 13), CategoryColor: "#3498db" },
    { Id: 5, Subject: "Montaje", StartTime: new Date(2024, 5, 14), EndTime: new Date(2024, 5, 16), CategoryColor: "#9b59b6" },
  ];

  return (
    <div className="calendario-container">
      <h1>Calendario de Producción</h1>
      <ScheduleComponent
        height="650px"
        selectedDate={new Date(2024, 5, 1)}
        eventSettings={{ dataSource: etapasProduccion }}
        currentView="TimelineMonth"
      >
        <Inject services={[TimelineViews, TimelineMonth]} />
      </ScheduleComponent>
    </div>
  );
};

export default Calendario;
