function asUtcDate(input) {
  // YYYY-MM-DD avoids accidental local timezone shifts.
  if (typeof input !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    throw new Error('Date must be YYYY-MM-DD');
  }
  const date = new Date(`${input}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== input) {
    throw new Error('Invalid calendar date');
  }
  return date;
}
function calculateNights(checkIn, checkOut) {
  const nights = (checkOut.getTime() - checkIn.getTime()) / 86400000;
  if (!Number.isInteger(nights) || nights <= 0) throw new Error('Check-out must be after check-in');
  return nights;
}
function overlaps(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}
module.exports = { asUtcDate, calculateNights, overlaps };
