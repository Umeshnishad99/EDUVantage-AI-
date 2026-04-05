# Bug Fixes Applied

## Bug #1 — ML API: AttendanceRate unit mismatch (main.py)
**Problem:** The scaler was trained with `AttendanceRate` as `0.0–1.0` (ratio), 
but `attendance_rate` was being passed directly from the frontend/backend as `0–100` (percent).
This caused the scaler to receive values 100× too large, producing garbage predictions.

**Fix:** In `main.py` `/predict` endpoint:
```python
attendance_as_ratio = data.attendance_rate / 100.0
```
The field still accepts `0–100` from callers (intuitive), but is divided before feeding the model.

---

## Bug #2 — ML API: parent_support validator range wrong (main.py)
**Problem:** `parent_support` validator had `ge=0, le=4` but model was trained on `1–5`.
Sending `0` would silently produce wrong predictions.

**Fix:** Changed validator to `ge=1, le=5` matching training data.

---

## Bug #3 — Backend: Attendance multiplied × 100 before ML call (performanceController.js)
**Problem:** `safeNum(attendance, 0.9) * 100` was sending attendance as `90` to the ML API 
when the input was already `0.9`, but main.py was *also* not dividing — double error.

**Fix:** Both sides are now consistent:
- DB stores attendance as `0.0–1.0`
- ML API receives `0–100` and divides internally
- Controller normalizes input → DB as `0.0–1.0`, → ML as `0–100`

---

## Bug #4 — studentController: addAcademicRecord inserted wrong columns (studentController.js)
**Problem:** `predictions` INSERT used columns `student_id` and `record_id` which do not 
exist in the schema. Schema uses `user_id` and `performance_id`.

**Fix:** Rewritten to first create a `student_performance` row, then insert into `predictions`
using `user_id` + `performance_id`.

---

## Bug #5 — studentController: queries referenced non-existent columns (studentController.js)
**Problem:** `getStudents` queried `predicted_gpa_4`, `predicted_gpa_10` which don't exist 
in `predictions` (schema uses `gpa`). `getDashboardStats` joined on `student_id` which 
doesn't exist in `predictions`.

**Fix:** All queries rewritten to use actual schema column names.

---

## Bug #6 — authMiddleware: double response on valid tokens (authMiddleware.js)
**Problem:** `next()` was called without `return`, so execution continued to `if (!token)` 
check which tried to send a second response — causing "Cannot set headers after they are sent".

**Fix:** Added `return` before every `next()` and `res.status()` call.

---

## Bug #7 — predictionController: typo in exported function name
**Problem:** Controller exported `predictSTudentPerformance` (capital ST), 
but route tried to import `predictStudentPerformance` — causing crash at startup.

**Fix:** Renamed export to `predictStudentPerformance` and updated route import.
