const { test } = require('node:test');
const assert = require('node:assert/strict');
const { asUtcDate, calculateNights, overlaps } = require('../utils/reservationUtils');
test('nightly calculation uses checkout-exclusive dates', () => {
  assert.equal(calculateNights(asUtcDate('2026-12-01'), asUtcDate('2026-12-04')), 3);
});
test('invalid date and reversed ranges rejected', () => {
  assert.throws(() => asUtcDate('2026-02-30'));
  assert.throws(() => calculateNights(asUtcDate('2026-12-10'), asUtcDate('2026-12-09')));
});
test('back to back reservations do not overlap', () => {
  assert.equal(overlaps(asUtcDate('2026-12-01'), asUtcDate('2026-12-04'), asUtcDate('2026-12-04'), asUtcDate('2026-12-07')), false);
});
test('intersecting reservations overlap', () => {
  assert.equal(overlaps(asUtcDate('2026-12-01'), asUtcDate('2026-12-04'), asUtcDate('2026-12-03'), asUtcDate('2026-12-07')), true);
});
