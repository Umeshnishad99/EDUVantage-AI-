const { predictPerformance } = require('../utils/mlClient');

const safeNum = (val, def = 0) => {
  if (val === undefined || val === null || val === '') return def;
  const num = Number(val);
  return isNaN(num) ? def : num;
};

exports.predictStudentPerformance = async (req, res) => {
  try {
    const {
      math, english, computer, physics, chemistry, biology,
      attendance_rate, study_hours, parent_support, free_time, go_out,
      internet_access, extracurricular, part_time_job, ses_quartile,
    } = req.body;

    const rawAtt   = safeNum(attendance_rate, 90);
    const attForML = rawAtt <= 1 ? rawAtt * 100 : rawAtt;

    const mlBody = {
      math:            safeNum(math,            75),
      english:         safeNum(english,         75),
      computer:        safeNum(computer,        75),
      physics:         safeNum(physics,         75),
      chemistry:       safeNum(chemistry,       75),
      biology:         safeNum(biology,         75),
      attendance_rate: attForML,
      study_hours:     safeNum(study_hours,     5),
      parent_support:  safeNum(parent_support,  3),
      free_time:       safeNum(free_time,       3),
      go_out:          safeNum(go_out,          2),
      internet_access: safeNum(internet_access, 1),
      extracurricular: safeNum(extracurricular, 0),
      part_time_job:   safeNum(part_time_job,   0),
      ses_quartile:    safeNum(ses_quartile,    2),
    };

    const mlData = await predictPerformance(mlBody);

    return res.status(200).json({ 
      success: true, 
      prediction: mlData 
    });

  } catch (error) {
    console.error('❌ [predictionController] Error:', error.message);
    return res.status(503).json({ success: false, message: error.message });
  }
};



