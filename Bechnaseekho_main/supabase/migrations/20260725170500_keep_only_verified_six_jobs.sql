-- Keep only the 6 verified CareerSync jobs live on the portal.
-- All other jobs are hidden from public listings.

UPDATE public.jobs
SET
  is_active = false,
  status = CASE WHEN status = 'approved' THEN 'rejected' ELSE status END,
  updated_at = now()
WHERE COALESCE(external_id, '') NOT IN (
  'assure-capital-insurance-advisor',
  'apna-screening-network-sales-manager',
  'apna-screening-network-team-leader',
  'policy-meta-insurance-consultant',
  'smile-india-trust-program-coordinator',
  'scaler-academy-counsellor'
);

-- Ensure the 6 verified jobs are active and normalized exactly as requested.
UPDATE public.jobs
SET
  role = 'Insurance Advisor',
  company = 'Assure Capital',
  industry = 'Insurance',
  location = 'Delhi, India',
  salary = '15K - 30K / month',
  experience = '0-6 Years',
  employment_type = 'Full-time',
  shift = '10 AM - 6 PM',
  open_positions = 59,
  description = 'Join Assure Capital to help customers choose suitable life, motor, and health insurance plans while maintaining service quality.',
  responsibilities = ARRAY[
    'Understand customer requirements and suggest policy options',
    'Handle end-to-end insurance application workflow',
    'Coordinate with internal underwriting and operations'
  ],
  required_skills = ARRAY[
    'Good Communication Skills',
    'Positive Attitude',
    'Basic Calling and Follow-Up Skills'
  ],
  preferred_skills = ARRAY[
    'Communication Skills',
    'Hindi + English',
    'MS Excel'
  ],
  benefits = ARRAY[
    'Health Insurance',
    'WFH Option',
    'Annual Bonus'
  ],
  office_address = 'Delhi, India',
  company_overview = 'Assure Capital is a Delhi-based insurance company focused on dependable financial protection products.',
  recruiter_whatsapp = '919810001111',
  recruiter_notes = 'Freshers are welcome. Training is provided in office.',
  application_deadline = '2026-09-15',
  created_at = '2026-06-10T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['Insurance', 'Sales', 'Customer Service']
WHERE external_id = 'assure-capital-insurance-advisor';

UPDATE public.jobs
SET
  role = 'Sales Manager',
  company = 'Apna Screening Network',
  industry = 'Advertising',
  location = 'Delhi NCR',
  salary = '40,000 - 50,000 / month + 5,000 travel allowance',
  experience = '3-8 Years',
  employment_type = 'Full-time',
  shift = 'Day Shift',
  open_positions = 1,
  description = 'Lead field sales operations, merchant acquisition, team performance, and business growth.',
  responsibilities = ARRAY[
    'Manage Team Leaders and Field Sales Executives',
    'Monitor sales activities and merchant onboarding',
    'Conduct reviews and performance tracking',
    'Submit MIS and performance reports'
  ],
  required_skills = ARRAY[
    'Field Sales Operations',
    'Team Handling',
    'CRM',
    'MIS Reporting'
  ],
  preferred_skills = ARRAY[
    'Merchant Acquisition',
    'Performance Tracking'
  ],
  benefits = ARRAY[
    'Health Insurance',
    'Travel Allowance',
    'Performance Incentives'
  ],
  office_address = 'Sector 18, Noida, Uttar Pradesh 201301',
  company_overview = 'Apna Screening Network supports brands with scalable advertising operations and lead programs.',
  company_website = 'https://www.apna.co',
  recruiter_whatsapp = '919810002222',
  recruiter_notes = 'Team handling experience is mandatory. Includes a 7-day offline training and evaluation program, unpaid training, and mandatory registered and administrative office attendance.',
  application_deadline = '2026-08-30',
  created_at = '2026-06-14T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['Advertising', 'Sales', 'Team Management']
WHERE external_id = 'apna-screening-network-sales-manager';

UPDATE public.jobs
SET
  role = 'Team Leader (Field Sales)',
  company = 'Apna Screening Network',
  industry = 'Advertising',
  location = 'Delhi NCR',
  salary = '30,000 - 40,000 / month + 5,000 travel allowance',
  experience = '3-8 Years',
  employment_type = 'Full-time',
  shift = '10 AM - 6 PM',
  open_positions = 42,
  description = 'Manage Team Leaders and Field Sales Executives while driving performance and reporting discipline.',
  responsibilities = ARRAY[
    'Manage Team Leaders',
    'Field Sales Executives',
    'Conduct Reviews',
    'Performance Tracking',
    'Submit MIS',
    'Performance Reports'
  ],
  required_skills = ARRAY[
    'Team Management',
    'Merchant Onboarding',
    'CRM Reporting'
  ],
  preferred_skills = ARRAY[
    'Sales Closures',
    'Target Achievement'
  ],
  benefits = ARRAY[
    'Travel Allowance',
    'Team Performance Incentives'
  ],
  office_address = 'Delhi NCR',
  company_overview = 'Apna Screening Network delivers customer engagement operations with measurable outcomes.',
  recruiter_whatsapp = '919810002222',
  recruiter_notes = 'Includes a 7-day offline training and evaluation program, unpaid training, and mandatory registered and administrative office attendance.',
  application_deadline = '2026-09-10',
  created_at = '2026-06-20T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['Advertising', 'Field Sales', 'Leadership']
WHERE external_id = 'apna-screening-network-team-leader';

UPDATE public.jobs
SET
  role = 'Insurance Consultant',
  company = 'Policy Meta',
  industry = 'Insurance',
  location = 'Noida, Uttar Pradesh',
  salary = '15K - 30K Salary',
  experience = '0-6 Years',
  employment_type = 'Full-time',
  shift = '10 AM - 6 PM',
  open_positions = 99,
  description = 'Help customers choose policy options and assist with complete onboarding documentation.',
  responsibilities = ARRAY[
    'Good Communication Skills',
    'Positive Attitude',
    'Basic Calling and Follow-Up Skills'
  ],
  required_skills = ARRAY[
    'Insurance Advisory',
    'Client Follow-up'
  ],
  preferred_skills = ARRAY[
    'Cross-selling',
    'Channel Sales',
    'Communication Skills',
    'Target Achievement',
    'Hindi + English'
  ],
  benefits = ARRAY[
    'Medical Insurance',
    'Performance Bonus'
  ],
  office_address = 'Noida Sector 3 G34 First Floor, Office No. - F2, Near Sector 16 Metro Station',
  company_overview = 'Policy Meta connects customers with reliable insurance offerings and dedicated advisory support.',
  recruiter_whatsapp = '919810003333',
  recruiter_notes = 'Candidate should be comfortable with phone and WhatsApp communication.',
  application_deadline = '2026-08-25',
  created_at = '2026-06-08T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['Insurance', 'Advisory', 'Sales']
WHERE external_id = 'policy-meta-insurance-consultant';

UPDATE public.jobs
SET
  role = 'Program Coordinator',
  company = 'Smile India Trust',
  industry = 'NGO',
  location = 'Noida, Uttar Pradesh',
  salary = '15100 / month',
  experience = '0-6 Years',
  employment_type = 'Full-time',
  shift = '10 AM - 6 PM',
  open_positions = 49,
  description = 'Coordinate grassroots social programs and manage reporting across NGO initiatives.',
  responsibilities = ARRAY[
    'Coordinate project timelines and volunteers',
    'Compile monthly impact reports',
    'Work with partner organizations'
  ],
  required_skills = ARRAY[
    'Program Coordination',
    'Documentation',
    'Stakeholder Communication'
  ],
  preferred_skills = ARRAY[
    'NGO Experience',
    'Event Planning'
  ],
  benefits = ARRAY[
    'Health Insurance',
    'Learning Budget',
    'Impact Programs'
  ],
  office_address = 'Noida Sector 4, Nearby Sector 16 Metro Station',
  company_overview = 'Smile India Trust drives social impact through education and community outreach programs.',
  recruiter_whatsapp = '919810004444',
  recruiter_notes = 'Passion for social impact is important.',
  application_deadline = '2026-09-05',
  created_at = '2026-06-12T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['NGO', 'Coordination', 'Impact']
WHERE external_id = 'smile-india-trust-program-coordinator';

UPDATE public.jobs
SET
  role = 'Business Development Associate (BDA)',
  company = 'Scaler Academy',
  industry = 'EdTech',
  location = 'Gurugram, Haryana',
  salary = 'Up to 5.5 LPA',
  experience = '0-6 Years',
  employment_type = 'Full-time',
  shift = '12 PM - 9 PM',
  open_positions = 70,
  description = 'Guide learners through suitable upskilling pathways and support admissions conversion.',
  responsibilities = ARRAY[
    'Good Communication Skills',
    'Positive Attitude'
  ],
  required_skills = ARRAY[
    'Counselling',
    'Lead Nurturing'
  ],
  preferred_skills = ARRAY[
    'Communication Skills',
    'EdTech Experience',
    'CRM'
  ],
  benefits = ARRAY[
    'Health Insurance',
    'ESOPs',
    'Learning Budget',
    'Virtual Interview',
    'Week Off - Sunday and Monday'
  ],
  office_address = 'Think Plan Workplace 18-B, Institutional Area, Sector 32, Gurugram, Haryana',
  company_overview = 'Scaler Academy helps professionals level up software careers with intensive technology programs.',
  recruiter_whatsapp = '919810005555',
  recruiter_notes = 'Excellent communication and a positive attitude are required. Complete in-office training and process support are provided. Virtual interview is available. Week off: Sunday and Monday.',
  application_deadline = '2026-09-20',
  created_at = '2026-06-18T00:00:00+00',
  updated_at = '2026-07-04T00:00:00+00',
  is_verified = true,
  is_active = true,
  status = 'approved',
  tags = ARRAY['EdTech', 'Sales', 'Counselling']
WHERE external_id = 'scaler-academy-counsellor';
