import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

const BookingCalendar = ({ bookings }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = React.useState(today.getMonth());
  const [currentYear, setCurrentYear] = React.useState(today.getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    // Empty slots for days of previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={{ padding: '1rem', border: '1px solid #f1f5f9' }}></div>);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => b.bookingDate === dateString);

      days.push(
        <div key={day} style={{ 
          minHeight: '120px', 
          padding: '0.75rem', 
          border: '1px solid #f1f5f9', 
          background: 'white',
          position: 'relative'
        }}>
          <div style={{ 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            color: dayBookings.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
            marginBottom: '0.5rem'
          }}>
            {day}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {dayBookings.map(b => (
              <div key={b.id} style={{
                fontSize: '0.7rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.3rem',
                background: b.bookingStatus === 'CONFIRMED' ? '#f0fdf4' : '#eff6ff',
                color: b.bookingStatus === 'CONFIRMED' ? 'var(--success)' : 'var(--secondary)',
                border: `1px solid ${b.bookingStatus === 'CONFIRMED' ? '#bcf0da' : '#bfdbfe'}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }} title={`${b.startTime} - ${b.desk.workspace.workspaceName}`}>
                {b.startTime.slice(0,5)} {b.desk.workspace.workspaceName}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="glass-card" style={{ background: 'white', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#f0f9ff', padding: '0.6rem', borderRadius: '0.75rem', color: 'var(--secondary)' }}>
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{monthNames[currentMonth]} {currentYear}</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visual Schedule Overview</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>&lt;</button>
          <button onClick={() => {setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear());}} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: '0.85rem' }}>Today</button>
          <button onClick={nextMonth} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>&gt;</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0px', border: '1px solid #f1f5f9', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={{ padding: '0.75rem', textAlign: 'center', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid #f1f5f9' }}>
            {day.toUpperCase()}
          </div>
        ))}
        {renderDays()}
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#f0fdf4', border: '1px solid #bcf0da', borderRadius: '3px' }}></div>
          <span>Confirmed Desk</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '12px', height: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '3px' }}></div>
          <span>Reserved / Pending</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
