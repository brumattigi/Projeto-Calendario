document.addEventListener('DOMContentLoaded', function() {
    function getFeriados(ano) {
        return [
            { title: 'Confraternização Universal', start: `${ano}-01-01` },
            { title: 'Carnaval', start: `${ano}-02-12` },
            { title: 'Carnaval', start: `${ano}-02-13` },
            { title: 'Paixão de Cristo', start: `${ano}-03-31` }, 
            { title: 'Tiradentes', start: `${ano}-04-21` },
            { title: 'Dia do Trabalhador', start: `${ano}-05-01` },
            { title: 'Corpus Christi', start: `${ano}-05-30` },
            { title: 'Independência do Brasil', start: `${ano}-09-07` },
            { title: 'Nossa Senhora Aparecida', start: `${ano}-10-12` },
            { title: 'Finados', start: `${ano}-11-02` },
            { title: 'Dia Nacional de Zumbi e da Consciência Negra', start: `${ano}-11-20` },
            { title: 'Proclamação da República', start: `${ano}-11-15` },
            { title: 'Natal', start: `${ano}-12-25` }
        ];
    }

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        },
        titleFormat: {
            year: 'numeric',
            month: 'long'
        },
        events: getFeriados(new Date().getFullYear()).map(event => ({ ...event, extendedProps: { isHoliday: true } })), 
        dateClick: function(info) {
            document.querySelectorAll('.fc-daygrid-day').forEach(day => {
                day.classList.remove('selected');
            });

            info.dayEl.classList.add('selected');

            const selectedDate = document.getElementById('selected-date');
            const holidayName = document.getElementById('holiday-name');
            const commitments = document.getElementById('commitments');
            const eventDescription = document.getElementById('event-description');
            selectedDate.textContent = `Data selecionada: ${info.dateStr}`;
            holidayName.textContent = '';
            commitments.innerHTML = '';

            const events = calendar.getEvents();
            events.forEach(event => {
                if (event.startStr === info.dateStr) {
                    if (event.extendedProps.isHoliday) {
                        holidayName.textContent = `Feriado: ${event.title}`;
                    } else {
                        const commitmentEl = document.createElement('div');
                        commitmentEl.classList.add('commitment');
                        commitmentEl.innerHTML = `<p>Compromisso: ${event.title}</p><button>Remover</button>`;
                        commitmentEl.querySelector('button').onclick = function() {
                            event.remove();
                            commitmentEl.remove();
                        };
                        commitments.appendChild(commitmentEl);
                    }
                }
            });

            eventDescription.value = '';

            document.getElementById('save-event').onclick = function() {
                if (eventDescription.value.trim() === '') {
                    alert('A descrição do compromisso não pode estar vazia!');
                    return;
                }
                const event = {
                    title: eventDescription.value,
                    start: info.dateStr,
                    extendedProps: {
                        isHoliday: false
                    }
                };
                calendar.addEvent(event); 
                const commitmentEl = document.createElement('div');
                commitmentEl.classList.add('commitment');
                commitmentEl.innerHTML = `<p>Compromisso: ${event.title}</p><button>Remover</button>`;
                commitmentEl.querySelector('button').onclick = function() {
                    const eventToRemove = calendar.getEvents().find(e => e.title === event.title && e.startStr === event.start);
                    if (eventToRemove) {
                        eventToRemove.remove(); 
                    }
                    commitmentEl.remove(); 
                };
                commitments.appendChild(commitmentEl);
                eventDescription.value = '';
            };
        }
    });

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    calendar.on('datesSet', function() {
        const titleEl = document.querySelector('.fc-toolbar-title');
        if (titleEl) {
            const parts = titleEl.textContent.split(' ');
            const month = capitalizeFirstLetter(parts[0]);
            const year = parts[parts.length - 1];
            titleEl.textContent = `${month} ${year}`; 
        }

        const currentYear = calendar.getDate().getFullYear();
        calendar.removeAllEvents();
        calendar.addEventSource(getFeriados(currentYear).map(event => ({ ...event, extendedProps: { isHoliday: true } })));
    });

    calendar.render();
});

