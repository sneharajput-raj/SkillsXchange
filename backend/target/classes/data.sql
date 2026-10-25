-- ==========================================================
-- SkillSwap Seed Data
-- ==========================================================

-- Seed Departments
INSERT IGNORE INTO departments (id, code, name) VALUES
(1, 'CSE', 'Computer Science & Engineering'),
(2, 'ECE', 'Electronics & Communication Engineering'),
(3, 'DES', 'Design, Multimedia & Fine Arts'),
(4, 'BUS', 'School of Business & Management'),
(5, 'HUM', 'Department of Humanities & Languages');

-- Seed Skill Categories
INSERT IGNORE INTO skill_categories (id, name, description, icon_name, is_active) VALUES
(1, 'Computer Science & Tech', 'Programming, frameworks, algorithms, and system tooling', 'Code', true),
(2, 'Design & Creative Arts', 'UI/UX design, visual prototyping, and digital media', 'Palette', true),
(3, 'Languages & Speaking', 'Spoken foreign languages, public speaking, and communication', 'Globe', true),
(4, 'Business & Career', 'Career prep, marketing, finance, and resume building', 'Briefcase', true),
(5, 'Academic Coursework', 'Mathematics, engineering core sciences, and physics', 'BookOpen', true);

-- Seed Skills
INSERT IGNORE INTO skills (id, category_id, name, description, is_approved) VALUES
-- Tech
(1, 1, 'Java Programming', 'Object-oriented programming, standard libraries, and core concepts', true),
(2, 1, 'Data Structures & Algorithms', 'Arrays, trees, graphs, dynamic programming, and complexity', true),
(3, 1, 'React.js & Frontend', 'Components, hooks, state management, and modern client architecture', true),
(4, 1, 'Spring Boot Framework', 'RESTful web APIs, dependency injection, and microservices', true),
(5, 1, 'Python for Beginners', 'Syntax, data types, scripting, and basic automation', true),
(6, 1, 'Git & GitHub Version Control', 'Branching, pull requests, merge conflict resolution, and CI/CD', true),
(7, 1, 'SQL & Relational Databases', 'Queries, joins, normalization, indexes, and database design', true),
(8, 1, 'Machine Learning Fundamentals', 'Supervised learning, scikit-learn, and exploratory data analysis', true),
-- Design
(9, 2, 'Figma UI/UX Design', 'Wireframing, auto-layout, design systems, and clickable prototypes', true),
(10, 2, 'Adobe Photoshop Essentials', 'Photo manipulation, digital graphics, and asset design', true),
(11, 2, 'Video Editing & Premiere Pro', 'Timeline cutting, audio mixing, color grading, and export', true),
-- Languages
(12, 3, 'Spanish Conversation', 'Introductory and intermediate conversational Spanish', true),
(13, 3, 'French for Beginners', 'Pronunciation, basic vocabulary, and grammar rules', true),
(14, 3, 'Public Speaking & Presentations', 'Overcoming stage anxiety, storytelling, and slide delivery', true),
-- Career & Business
(15, 4, 'Resume Building & Tech Interviews', 'ATS optimization, technical portfolio review, and mock HR rounds', true),
(16, 4, 'Digital Marketing & SEO', 'Keyword research, social campaigns, and organic traffic growth', true),
-- Academics
(17, 5, 'Calculus & Differential Equations', 'Derivatives, integrals, limits, and engineering math applications', true),
(18, 5, 'Linear Algebra & Matrices', 'Vector spaces, eigenvalues, matrix transformations, and dot products', true);
