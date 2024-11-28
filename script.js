document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const currentMonthSpan = document.getElementById("current-month");
    const maintenanceInfo = document.getElementById("maintenance-info");
    const maintenanceList = document.getElementById("maintenance-list");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");
    const printBtn = document.getElementById("print-btn");
  
    // Datos de las máquinas, frecuencia y actividades de mantenimiento
    const machines = [
      {
        name: "Taladro de columna Walker Turner",
        type: "Mecánico",
        frequency: "Quincenal", // Actualizado a cada 15 días
        startDate: "2024-01-07",
        activities: [
          "Desconectar antes de limpiar.",
          "Usar un cepillo para polvo, no agua.",
          "Limpiar las ranuras de ventilación.",
          "Verificar que el chuck esté bien ajustado y libre de residuos.",
          "Revisar y lubricar partes móviles.",
        ],
      },
      {
        name: "Prensa Hidráulica REYNA",
        type: "Mecánico",
        frequency: "Mensual",
        startDate: "2024-01-15",
        activities: [
          "Revisar conexiones hidráulicas.",
          "Verificar nivel de aceite.",
          "Verificar presión en la bomba.",
          "Revisar las mangueras y conexiones de presión.",
        ],
      },
      {
        name: "Compresor MILWAUKEE",
        type: "Eléctrico",
        frequency: "Quincenal",
        startDate: "2024-01-10",
        activities: [
          "Inspeccionar conexiones eléctricas.",
          "Verificar presión de diseño.",
          "Revisar el motor y las válvulas.",
          "Limpiar el sistema de filtros.",
        ],
      },
      {
        name: "Tronzadora DEWALT",
        type: "Eléctrico",
        frequency: "Semestral",
        startDate: "2024-01-01",
        activities: [
          "Revisar motor y discos.",
          "Lubricar componentes móviles.",
          "Reemplazar el disco abrasivo si es necesario.",
          "Comprobar y limpiar las ranuras de ventilación.",
        ],
      },
      {
        name: "Soldadora INFRA",
        type: "Eléctrico",
        frequency: "Anual",
        startDate: "2024-01-20",
        activities: [
          "Inspeccionar electrodos.",
          "Limpiar componentes internos.",
          "Revisar el cableado y conexiones.",
          "Verificar los controles de temperatura.",
        ],
      },
      {
        name: "Esmeriladora TRUPER",
        type: "Limpieza General",
        frequency: "Cada 8 días", // Actualizado a cada 8 días
        startDate: "2024-01-05",
        activities: [
          "Limpiar polvo y residuos.",
          "Revisar cableado eléctrico.",
          "Lubricar partes móviles.",
          "Verificar y cambiar el disco abrasivo si es necesario.",
        ],
      },
    ];
  
    let currentDate = new Date();
    const yearsRange = 5;
  
    const formatDate = (date) => date.toISOString().split("T")[0];
  
    const calculateMaintenanceDates = (machine) => {
      const dates = [];
      const startDate = new Date(machine.startDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + yearsRange);
  
      while (startDate <= endDate) {
        dates.push({ date: formatDate(startDate), machine });
        switch (machine.frequency) {
          case "Semanal":
            startDate.setDate(startDate.getDate() + 7);
            break;
          case "Quincenal": // Cambio a cada 15 días
            startDate.setDate(startDate.getDate() + 15);
            break;
          case "Mensual":
            startDate.setMonth(startDate.getMonth() + 1);
            break;
          case "Semestral":
            startDate.setMonth(startDate.getMonth() + 6);
            break;
          case "Anual":
            startDate.setFullYear(startDate.getFullYear() + 1);
            break;
          case "Cada 8 días": // Cambio a cada 8 días
            startDate.setDate(startDate.getDate() + 8);
            break;
        }
      }
      return dates;
    };
  
    const maintenanceSchedule = {};
    machines.forEach((machine) => {
      calculateMaintenanceDates(machine).forEach(({ date, machine }) => {
        if (!maintenanceSchedule[date]) {
          maintenanceSchedule[date] = [];
        }
        maintenanceSchedule[date].push(machine);
      });
    });
  
    const renderCalendar = () => {
      calendar.innerHTML = "";
  
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
  
      currentMonthSpan.textContent = `${currentDate.toLocaleString("default", {
        month: "long",
      })} ${year}`;
  
      for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(document.createElement("div"));
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const date = formatDate(new Date(year, month, day));
        const dayDiv = document.createElement("div");
        dayDiv.textContent = day;
        dayDiv.dataset.date = date;
  
        if (maintenanceSchedule[date]) {
          dayDiv.style.backgroundColor = "#cce7ff";
        }
  
        dayDiv.addEventListener("click", () => {
          const tasks = maintenanceSchedule[date] || [];
          maintenanceList.innerHTML = "";
  
          if (tasks.length > 0) {
            tasks.forEach(({ name, type, activities }) => {
              const li = document.createElement("li");
              li.innerHTML = `<strong>${name}</strong> (${type})<br>Actividades: ${activities.join(", ")}`;
              maintenanceList.appendChild(li);
            });
          } else {
            const li = document.createElement("li");
            li.textContent = "No hay mantenimientos programados para este día.";
            maintenanceList.appendChild(li);
          }
  
          maintenanceInfo.classList.remove("hidden");
        });
  
        calendar.appendChild(dayDiv);
      }
    };
  
    printBtn.addEventListener("click", () => {
      const content = `
        <h1>Hoja de Mantenimiento Muelles y Mofles Chuchín</h1>
        ${maintenanceInfo.innerHTML}
        <p>Autorizado por el jefe: J. Jesús Barrón Medrano</p>
      `;
      const printWindow = window.open("", "_blank");
      printWindow.document.write("<html><head><title>Hoja de Mantenimiento</title></head><body>");
      printWindow.document.write(content);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    });
  
    prevMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  
    nextMonthBtn.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  
    renderCalendar();
  });
  
  