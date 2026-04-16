const { body, validationResult } = require('express-validator');

const validatePerformance = [
  body('age').isInt({ min: 12, max: 30 }).withMessage('Age must be between 12 and 30'),
  body('ses_quartile').isInt({ min: 1, max: 4 }).withMessage('SES Quartile must be between 1 and 4'),
  body('parental_education').notEmpty().withMessage('Parental education is required'),
  body('school_type').isIn(['Public', 'Private']).withMessage('School type must be Public or Private'),
  

  body('math').isInt({ min: 0, max: 99 }).withMessage('Math marks must be between 0 and 99'),
  body('english').isInt({ min: 0, max: 99 }).withMessage('English marks must be between 0 and 99'),
  body('computer').isInt({ min: 0, max: 99 }).withMessage('Computer marks must be between 0 and 99'),
  body('physics').isInt({ min: 0, max: 99 }).withMessage('Physics marks must be between 0 and 99'),
  body('chemistry').isInt({ min: 0, max: 99 }).withMessage('Chemistry marks must be between 0 and 99'),
  body('biology').isInt({ min: 0, max: 99 }).withMessage('Biology marks must be between 0 and 99'),
  
  // Attendance & Study
  body('attendance').isFloat({ min: 0, max: 1.0 }).withMessage('Attendance must be between 0.0 and 1.0'),
  body('study_hours').isFloat({ min: 0, max: 16 }).withMessage('Study hours must be between 0 and 16'),
  
  // Lifestyle (0 or 1)
  body('internet_access').isInt({ min: 0, max: 1 }).withMessage('Internet access must be 0 or 1'),
  body('extracurricular').isInt({ min: 0, max: 1 }).withMessage('Extracurricular must be 0 or 1'),
  body('part_time_job').isInt({ min: 0, max: 1 }).withMessage('Part-time job must be 0 or 1'),
  
  // Support & Personality (1-5)
  body('parent_support').isInt({ min: 1, max: 5 }).withMessage('Parent support must be between 1 and 5'),
  body('free_time').isInt({ min: 1, max: 5 }).withMessage('Free time must be between 1 and 5'),
  body('go_out').isInt({ min: 1, max: 5 }).withMessage('Socializing must be between 1 and 5'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
      });
    }
    next();
  }
];

module.exports = { validatePerformance };
