-- ══════════════════════════════════════════════════════════
-- AI-Based Student Performance Prediction System
-- Full Schema (run this fresh or as migration)
-- ══════════════════════════════════════════════════════════

DROP TABLE IF EXISTS academic_records CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS custom_recommendations CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS student_performance CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ── Users ─────────────────────────────────────────────────
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(50)   DEFAULT 'student',  -- 'student' | 'teacher'
    is_verified   BOOLEAN       DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ── Student Performance Submissions ────────────────────────
-- Optimized for the 15-feature ML Predictor
CREATE TABLE student_performance (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER REFERENCES users(id) ON DELETE CASCADE,

    -- Demographics
    age                 INTEGER DEFAULT 18 CHECK (age >= 12 AND age <= 30),
    ses_quartile        INTEGER DEFAULT 2 CHECK (ses_quartile >= 1 AND ses_quartile <= 4),
    parental_education  VARCHAR(50), 
    school_type         VARCHAR(50), 

    -- Core Subjects (Scores 0-100)
    math                NUMERIC(5,2) DEFAULT 0 CHECK (math >= 0 AND math <= 100),
    english             NUMERIC(5,2) DEFAULT 0 CHECK (english >= 0 AND english <= 100),
    computer            NUMERIC(5,2) DEFAULT 0 CHECK (computer >= 0 AND computer <= 100),
    physics             NUMERIC(5,2) DEFAULT 0 CHECK (physics >= 0 AND physics <= 100),
    chemistry           NUMERIC(5,2) DEFAULT 0 CHECK (chemistry >= 0 AND chemistry <= 100),
    biology             NUMERIC(5,2) DEFAULT 0 CHECK (biology >= 0 AND biology <= 100),

    -- Behavioural & Lifestyle
    attendance          NUMERIC(4,2) DEFAULT 0.9 CHECK (attendance >= 0.0 AND attendance <= 1.0),
    study_hours         NUMERIC(4,1) DEFAULT 5.0 CHECK (study_hours >= 0 AND study_hours <= 16),
    internet_access     SMALLINT DEFAULT 1 CHECK (internet_access IN (0, 1)),
    extracurricular     SMALLINT DEFAULT 0 CHECK (extracurricular IN (0, 1)),
    part_time_job       SMALLINT DEFAULT 0 CHECK (part_time_job IN (0, 1)),
    parent_support      SMALLINT DEFAULT 3 CHECK (parent_support >= 1 AND parent_support <= 5),
    free_time           SMALLINT DEFAULT 3 CHECK (free_time >= 1 AND free_time <= 5),
    go_out              SMALLINT DEFAULT 2 CHECK (go_out >= 1 AND go_out <= 5),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Predictions ────────────────────────────────────────────
CREATE TABLE predictions (
    id               SERIAL  PRIMARY KEY,
    user_id          INTEGER REFERENCES users(id)               ON DELETE CASCADE,
    performance_id   INTEGER REFERENCES student_performance(id) ON DELETE CASCADE,
    predicted_score  NUMERIC(5,2),   -- raw score 0-100
    gpa              NUMERIC(4,2),   -- 0-10 scale
    category         VARCHAR(20),    -- Low / Medium / High
    confidence_score NUMERIC(4,2),
    weak_areas       JSONB,
    recommendations  JSONB,
    roadmap          JSONB,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Custom Recommendations (Teacher-added) ─────────────────
CREATE TABLE custom_recommendations (
    id          SERIAL  PRIMARY KEY,
    teacher_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_category VARCHAR(20),  -- Low / Medium / High / All
    title       VARCHAR(255) NOT NULL,
    content     TEXT         NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Legacy tables (keep for backward compat) ──────────────
CREATE TABLE students (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    age        INTEGER,
    gender     VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic_records (
    id                   SERIAL PRIMARY KEY,
    student_id           INTEGER REFERENCES students(id) ON DELETE CASCADE,
    term                 VARCHAR(50) NOT NULL,
    subjects             JSONB       NOT NULL,
    marks1               NUMERIC(5,2),
    marks2               NUMERIC(5,2),
    marks3               NUMERIC(5,2),
    marks4               NUMERIC(5,2),
    marks5               NUMERIC(5,2),
    attendance_rate      NUMERIC(5,2),
    study_hours_per_week NUMERIC(5,2),
    created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Indexes ────────────────────────────────────────────────
CREATE INDEX idx_perf_user      ON student_performance(user_id);
CREATE INDEX idx_preds_user     ON predictions(user_id);
CREATE INDEX idx_preds_perf     ON predictions(performance_id);
CREATE INDEX idx_custom_teacher ON custom_recommendations(teacher_id);
CREATE INDEX idx_students_user  ON students(user_id);
