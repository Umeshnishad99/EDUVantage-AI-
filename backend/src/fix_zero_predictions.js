const { query } = require('./config/db');
const { predictPerformance } = require('./utils/mlClient');

const fixZeroPredictions = async () => {
  console.log('🔄 Checking for zero/unknown predictions in database...');
  try {
    const zeroPreds = await query(`
      SELECT p.id AS pred_id, p.user_id, p.performance_id, sp.*
      FROM predictions p
      JOIN student_performance sp ON p.performance_id = sp.id
      WHERE p.gpa = 0 OR p.category = 'Unknown' OR p.predicted_score = 0
    `);

    if (zeroPreds.rows.length === 0) {
      console.log('✅ No zero predictions found in database.');
      process.exit(0);
    }

    console.log(`🔍 Found ${zeroPreds.rows.length} invalid prediction(s). Recalculating...`);

    for (const row of zeroPreds.rows) {
      const rawAtt = Number(row.attendance || 0.9);
      const attForML = rawAtt > 1 ? rawAtt : rawAtt * 100;

      const mlBody = {
        math:            Number(row.math || 75),
        english:         Number(row.english || 75),
        computer:        Number(row.computer || 75),
        physics:         Number(row.physics || 75),
        chemistry:       Number(row.chemistry || 75),
        biology:         Number(row.biology || 75),
        attendance_rate: attForML,
        study_hours:     Number(row.study_hours || 5),
        parent_support:  Number(row.parent_support || 3),
        free_time:       Number(row.free_time || 3),
        go_out:          Number(row.go_out || 2),
        internet_access: Number(row.internet_access || 1),
        extracurricular: Number(row.extracurricular || 0),
        part_time_job:   Number(row.part_time_job || 0),
        ses_quartile:    Number(row.ses_quartile || 2),
      };

      try {
        const mlData = await predictPerformance(mlBody);
        const gpa = mlData.predicted_gpa || 7.0;
        const category = mlData.category || 'Medium';
        const predicted_score = Math.round((gpa / 10) * 100);

        await query(
          `UPDATE predictions
           SET gpa = $1, predicted_score = $2, category = $3,
               recommendations = $4, roadmap = $5, weak_areas = $6
           WHERE id = $7`,
          [
            gpa,
            predicted_score,
            category,
            JSON.stringify(mlData.recommendations || ''),
            JSON.stringify(mlData.roadmap || []),
            JSON.stringify(mlData.weak_areas || []),
            row.pred_id
          ]
        );

        console.log(`✅ Fixed Prediction ID ${row.pred_id} (User ${row.user_id}): GPA=${gpa}, Category=${category}`);
      } catch (err) {
        console.error(`❌ Failed to recalculate prediction ID ${row.pred_id}:`, err.message);
      }
    }

    console.log('🎉 DB Prediction Fix completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('🔥 Error fixing predictions:', err.message);
    process.exit(1);
  }
};

fixZeroPredictions();
