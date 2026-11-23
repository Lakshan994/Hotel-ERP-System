# MongoDB Schema and Relationships

**Database** `hotel_erp` configured in `backend/.env` `MONGODB_URI`.
Mongoose models are the **executable source of truth**; the database folder is documentation/seed examples, not SQL DDL.

| Collection | Key fields | Relationship |
| --- | --- | --- |
| `users` | `_id`, fullName, email (unique), passwordHash, role | Login/role permissions |
| `rooms` | `_id`, roomNumber (unique), roomType, pricePerNight, capacity, status | Referenced by reservations |
| `customers` | `_id`, firstName, lastName, phone, email, address | Referenced by reservations |
| `reservations` | `_id`, customerId, roomId, checkInDate, checkOutDate, nightlyRate, totalPrice, status | One room and one customer |
| `bills` | `_id`, reservationId (unique), amount, paidAmount, paymentStatus, paymentMethod | One optional bill per reservation |

## Collection relationships

```text
Customer (1) ─── (many) Reservation (many) ─── (1) Room
                                  │
                              (0 or 1)
                                  │
                                 Bill
```

### Reservation status
`Pending → Confirmed → CheckedIn → CheckedOut` or `Pending/Confirmed → Cancelled`.

### Important design choices
- Database indexes include roomNumber/email uniqueness, unique bill per reservation, and reservation date query index.
- `Room.status` describes **operational readiness**, not future room availability for a date range; the availability check queries reservations separately.
- The `totalPrice` snapshot prevents historical bills changing when room prices change later.
- Missing concurrency atomicity means simultaneous overlapping booking requests could pass the pre-check. Document and address with transactions/locking for real deployment.
- Sensitive customer data must be handled carefully. Avoid using actual guest information in the assignment.
