import React, { useState, useEffect } from 'react';
import './Calendar.css';
import dayjs from 'dayjs';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarDays, setCalendarDays] = useState([]);
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', duration: '' });
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [showMonthSelect, setShowMonthSelect] = useState(false);

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const generateCalendar = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    let day = startDate.clone();
    const tempDays = [];
    while (day.isBefore(endDate, 'day')) {
      tempDays.push(day);
      day = day.add(1, 'day');
    }
    setCalendarDays(tempDays);
  };

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));
  const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));

  const getEventsForDay = (date) => {
    return events.filter((event) => dayjs(event.date).isSame(date, 'day'));
  };

  const handleDayClick = (date) => setSelectedDate(date);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time && newEvent.duration && selectedDate) {
      const updatedEvents = [
        ...events,
        { ...newEvent, date: selectedDate.format('YYYY-MM-DD') },
      ];
      setEvents(updatedEvents);
      setNewEvent({ title: '', time: '', duration: '' });
      setSelectedDate(null);
    }
  };

  const handleYearSelect = (year) => {
    setCurrentDate(currentDate.year(year));
    setShowYearSelect(false);
  };

  const handleMonthSelect = (month) => {
    setCurrentDate(currentDate.month(month));
    setShowMonthSelect(false);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-button" onClick={prevMonth}>&lt;</button>
        <h2 className="selectable" onClick={() => setShowMonthSelect(!showMonthSelect)}>
          {currentDate.format('MMMM')}
        </h2>
        <h2 className="selectable" onClick={() => setShowYearSelect(!showYearSelect)}>
          {currentDate.format('YYYY')}
        </h2>
        <button className="nav-button" onClick={nextMonth}>&gt;</button>
      </div>

      {showYearSelect && (
        <div className="dropdown">
          {[...Array(10)].map((_, i) => {
            const year = dayjs().year() - 5 + i;
            return (
              <div key={i} onClick={() => handleYearSelect(year)}>{year}</div>
            );
          })}
        </div>
      )}

      {showMonthSelect && (
        <div className="dropdown">
          {[
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
].map((month, idx) => (

            <div key={idx} onClick={() => handleMonthSelect(idx)}>{month}</div>
          ))}
        </div>
      )}
        {selectedDate && (
  <div className="event-form">
    <div className="event-form-header">
      <h3>Add Event on {selectedDate.format('DD MMM YYYY')}</h3>
      <button className="close-btn" onClick={() => setSelectedDate(null)}>✖</button>
    </div>
    <input
      type="text"
      name="title"
      placeholder="Event Title"
      value={newEvent.title}
      onChange={handleInputChange}
    />
    <input
      type="text"
      name="time"
      placeholder="Time (e.g. 10:00 AM)"
      value={newEvent.time}
      onChange={handleInputChange}
    />
    <input
      type="text"
      name="duration"
      placeholder="Duration (e.g. 1hr)"
      value={newEvent.duration}
      onChange={handleInputChange}
    />
    <button onClick={handleAddEvent}>Add Event</button>
  </div>
)}


      <div className="calendar-grid">
        {[...Array(7)].map((_, idx) => (
          <div key={idx} className="calendar-day-name">
            {dayjs().day(idx).format('ddd')}
          </div>
        ))}
        {calendarDays.map((date, idx) => {
          const isToday = date.isSame(dayjs(), 'day');
          const isCurrentMonth = date.month() === currentDate.month();
          const dayEvents = getEventsForDay(date);
          return (
            <div
              key={idx}
              className={`calendar-day ${isCurrentMonth ? '' : 'disabled'} ${isToday ? 'today' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              <div className="date-number">{date.date()}</div>
              {dayEvents.map((event, i) => (
                <div key={i} className="event">
                  <span className="event-title">{event.title}</span>
                  <span className="event-time">{event.time}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;

