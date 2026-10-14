// ========================================
// Mock data for static UI development
// We'll replace these with real API calls in Phase 2
// ========================================

import type {
  User,
  Profile,
  Job,
  JobMatch,
  LearningRoadmap,
  Interview,
  ChatMessage,
} from '../types';

export const mockUser: User = {
  id: '1',
  email: 'ruthi@example.com',
  name: 'Ruthi',
  created_at: '2024-10-01T00:00:00Z',
};

export const mockProfile: Profile = {
  id: '1',
  user_id: '1',
  name: 'Ruthi',
  education: [
    {
      degree: 'B.Tech',
      field: 'Information Technology',
      institution: 'Anna University',
      graduation_year: 2025,
    },
  ],
  experience: [
    {
      title: 'Frontend Developer Intern',
      company: 'TechStart Inc.',
      duration: '3 months',
      description:
        'Developed responsive web applications using React and TypeScript. Implemented REST API integrations and improved page load performance by 40%.',
      technologies: ['React', 'TypeScript', 'REST APIs', 'CSS'],
    },
  ],
  projects: [
    {
      name: 'Food Recommendation System',
      description:
        'ML-based food recommendation engine using collaborative filtering and content-based approaches.',
      technologies: ['Python', 'Scikit-learn', 'Flask', 'PostgreSQL'],
      url: 'https://github.com/ruthi/food-recommender',
    },
    {
      name: 'Task Management App',
      description:
        'Full-stack task management application with real-time updates and team collaboration features.',
      technologies: ['React', 'FastAPI', 'Docker', 'WebSocket'],
      url: 'https://github.com/ruthi/task-manager',
    },
    {
      name: 'E-commerce Platform',
      description:
        'Containerized e-commerce platform with payment integration, inventory management, and admin dashboard.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Docker', 'Stripe'],
    },
  ],
  certifications: ['AWS Cloud Practitioner', 'Google IT Support'],
  github_url: 'https://github.com/ruthi',
  linkedin_url: 'https://linkedin.com/in/ruthi',
  career_preferences: {
    preferred_roles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer'],
    preferred_locations: ['Bangalore', 'Chennai', 'Remote'],
    job_type: 'full-time',
  },
};

export const mockSkills = [
  { name: 'Python', category: 'Language', proficiency: 'advanced' as const },
  { name: 'React', category: 'Frontend', proficiency: 'advanced' as const },
  { name: 'TypeScript', category: 'Language', proficiency: 'intermediate' as const },
  { name: 'FastAPI', category: 'Backend', proficiency: 'intermediate' as const },
  { name: 'SQL', category: 'Database', proficiency: 'advanced' as const },
  { name: 'Docker', category: 'DevOps', proficiency: 'intermediate' as const },
  { name: 'Git', category: 'Tool', proficiency: 'advanced' as const },
  { name: 'REST APIs', category: 'Backend', proficiency: 'advanced' as const },
  { name: 'MongoDB', category: 'Database', proficiency: 'beginner' as const },
  { name: 'Flask', category: 'Backend', proficiency: 'intermediate' as const },
  { name: 'CSS', category: 'Frontend', proficiency: 'advanced' as const },
  { name: 'Node.js', category: 'Backend', proficiency: 'intermediate' as const },
];

export const mockJobs: Job[] = [
  {
    id: '1',
    user_id: '1',
    title: 'Software Engineer',
    company: 'Google',
    description: 'Build large-scale distributed systems...',
    parsed_requirements: {
      required_skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs', 'Docker', 'AWS', 'React'],
      soft_skills: ['Communication', 'Problem Solving', 'Teamwork'],
      experience_level: '0-2 years',
      responsibilities: [
        'Design and implement scalable backend services',
        'Write clean, maintainable code',
        'Participate in code reviews',
      ],
      qualifications: ["Bachelor's in CS or related field"],
    },
    created_at: '2024-10-10T00:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    title: 'Data Engineer',
    company: 'Amazon',
    description: 'Build data pipelines...',
    parsed_requirements: {
      required_skills: ['Python', 'SQL', 'Apache Spark', 'AWS', 'Airflow', 'Kafka'],
      soft_skills: ['Analytical Thinking', 'Communication'],
      experience_level: '1-3 years',
      responsibilities: ['Build ETL pipelines', 'Optimize data warehouse queries'],
      qualifications: ["Bachelor's in CS or related field"],
    },
    created_at: '2024-10-11T00:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    title: 'AI Engineer',
    company: 'OpenAI',
    description: 'Build AI-powered applications...',
    parsed_requirements: {
      required_skills: ['Python', 'PyTorch', 'LLMs', 'FastAPI', 'Docker', 'Vector Databases'],
      soft_skills: ['Research Mindset', 'Communication'],
      experience_level: '0-2 years',
      responsibilities: [
        'Develop AI-powered features',
        'Fine-tune language models',
        'Build RAG systems',
      ],
      qualifications: ["Bachelor's in CS, ML, or related field"],
    },
    created_at: '2024-10-12T00:00:00Z',
  },
];

export const mockJobMatches: JobMatch[] = [
  {
    id: '1',
    user_id: '1',
    job_id: '1',
    overall_score: 82,
    category_scores: {
      technical: 87,
      experience: 74,
      projects: 91,
      education: 100,
      soft_skills: 78,
    },
    skill_matches: [
      { skill: 'Java', matched: false, match_type: 'none' },
      { skill: 'Spring Boot', matched: false, match_type: 'none' },
      {
        skill: 'SQL',
        matched: true,
        match_type: 'exact',
        similarity_score: 1.0,
        evidence: 'Built PostgreSQL database schemas for Food Recommendation System',
        source: 'Resume → Project 1',
      },
      {
        skill: 'REST APIs',
        matched: true,
        match_type: 'semantic',
        similarity_score: 0.92,
        evidence: 'Built APIs using FastAPI for Task Management App',
        source: 'Resume → Project 2',
      },
      {
        skill: 'Docker',
        matched: true,
        match_type: 'exact',
        similarity_score: 1.0,
        evidence: 'Containerized FastAPI application using Docker',
        source: 'Resume → Project 2',
      },
      { skill: 'AWS', matched: false, match_type: 'none' },
      {
        skill: 'React',
        matched: true,
        match_type: 'exact',
        similarity_score: 1.0,
        evidence: 'Developed responsive web applications using React',
        source: 'Resume → Experience',
      },
    ],
    evidence_map: [
      {
        skill: 'SQL',
        evidence: 'Built PostgreSQL database schemas for Food Recommendation System',
        source: 'Resume → Project 1',
        confidence: 0.95,
      },
      {
        skill: 'REST APIs',
        evidence: 'Built APIs using FastAPI for Task Management App',
        source: 'Resume → Project 2',
        confidence: 0.92,
      },
      {
        skill: 'Docker',
        evidence: 'Containerized FastAPI application using Docker',
        source: 'Resume → Project 2',
        confidence: 0.98,
      },
      {
        skill: 'React',
        evidence: 'Developed responsive web applications using React and TypeScript',
        source: 'Resume → Experience',
        confidence: 0.97,
      },
    ],
    gap_analysis: {
      critical_gaps: ['Java', 'Spring Boot'],
      must_learn: ['Java', 'Spring Boot'],
      good_to_have: ['AWS'],
      already_strong: ['SQL', 'Docker', 'React', 'REST APIs'],
    },
    analyzed_at: '2024-10-10T12:00:00Z',
  },
  {
    id: '2',
    user_id: '1',
    job_id: '2',
    overall_score: 67,
    category_scores: {
      technical: 58,
      experience: 62,
      projects: 75,
      education: 100,
      soft_skills: 70,
    },
    skill_matches: [
      { skill: 'Python', matched: true, match_type: 'exact', similarity_score: 1.0 },
      { skill: 'SQL', matched: true, match_type: 'exact', similarity_score: 1.0 },
      { skill: 'Apache Spark', matched: false, match_type: 'none' },
      { skill: 'AWS', matched: false, match_type: 'none' },
      { skill: 'Airflow', matched: false, match_type: 'none' },
      { skill: 'Kafka', matched: false, match_type: 'none' },
    ],
    evidence_map: [],
    gap_analysis: {
      critical_gaps: ['Apache Spark', 'Airflow', 'Kafka'],
      must_learn: ['Apache Spark', 'Airflow'],
      good_to_have: ['AWS', 'Kafka'],
      already_strong: ['Python', 'SQL'],
    },
    analyzed_at: '2024-10-11T12:00:00Z',
  },
  {
    id: '3',
    user_id: '1',
    job_id: '3',
    overall_score: 74,
    category_scores: {
      technical: 72,
      experience: 68,
      projects: 85,
      education: 100,
      soft_skills: 65,
    },
    skill_matches: [
      { skill: 'Python', matched: true, match_type: 'exact', similarity_score: 1.0 },
      { skill: 'PyTorch', matched: false, match_type: 'none' },
      { skill: 'LLMs', matched: false, match_type: 'none' },
      {
        skill: 'FastAPI',
        matched: true,
        match_type: 'exact',
        similarity_score: 1.0,
      },
      { skill: 'Docker', matched: true, match_type: 'exact', similarity_score: 1.0 },
      { skill: 'Vector Databases', matched: false, match_type: 'none' },
    ],
    evidence_map: [],
    gap_analysis: {
      critical_gaps: ['PyTorch', 'LLMs'],
      must_learn: ['PyTorch', 'LLMs'],
      good_to_have: ['Vector Databases'],
      already_strong: ['Python', 'FastAPI', 'Docker'],
    },
    analyzed_at: '2024-10-12T12:00:00Z',
  },
];

export const mockRoadmap: LearningRoadmap = {
  id: '1',
  weeks: [
    {
      week: 1,
      title: 'Java Fundamentals',
      topics: [
        {
          name: 'Core Java',
          subtopics: ['OOP Concepts', 'Collections Framework', 'Streams API', 'Exception Handling'],
        },
        {
          name: 'Build Tools',
          subtopics: ['Maven', 'Gradle basics'],
        },
      ],
    },
    {
      week: 2,
      title: 'Spring Boot',
      topics: [
        {
          name: 'Spring Core',
          subtopics: ['Dependency Injection', 'REST Controllers', 'JPA & Hibernate', 'Spring Security'],
        },
        {
          name: 'Database',
          subtopics: ['JPA Repositories', 'Query Methods', 'Migrations with Flyway'],
        },
      ],
      project: 'Build a REST API for a bookstore using Spring Boot + PostgreSQL',
    },
    {
      week: 3,
      title: 'AWS Essentials',
      topics: [
        {
          name: 'Compute & Storage',
          subtopics: ['EC2 Instances', 'S3 Buckets', 'IAM Roles & Policies'],
        },
        {
          name: 'Database & Deploy',
          subtopics: ['RDS', 'Elastic Beanstalk', 'CloudWatch'],
        },
      ],
    },
    {
      week: 4,
      title: 'Portfolio Project',
      topics: [
        {
          name: 'Full Application',
          subtopics: [
            'Spring Boot REST API',
            'React Frontend',
            'PostgreSQL on RDS',
            'Deploy to AWS',
          ],
        },
      ],
      project:
        'Deploy your Spring Boot + React application to AWS with Docker and CI/CD',
    },
  ],
  generated_at: '2024-10-10T12:00:00Z',
};

export const mockInterview: Interview = {
  id: '1',
  job_id: '1',
  difficulty: 'medium',
  focus_area: 'Java + Spring Boot',
  overall_score: 78,
  status: 'completed',
  questions: [
    {
      id: '1',
      sequence: 1,
      question: 'Explain dependency injection in Spring Boot. Why is it important and how does Spring implement it?',
      user_answer:
        'Dependency injection is a design pattern where objects receive their dependencies from external sources rather than creating them. Spring uses IoC container and annotations like @Autowired to inject dependencies. It makes code more modular and testable.',
      evaluation: {
        technical_accuracy: 8,
        clarity: 9,
        depth: 6,
        communication: 8,
        overall: 8,
        feedback:
          'Good understanding of the concept. To improve depth, you could mention constructor injection vs field injection, and discuss the advantages of constructor injection for immutability and required dependencies.',
      },
      difficulty_level: 'medium',
    },
    {
      id: '2',
      sequence: 2,
      question:
        'What is the difference between @Controller and @RestController in Spring? When would you use each?',
      user_answer:
        '@RestController is a combination of @Controller and @ResponseBody. @Controller is used for MVC views while @RestController is for REST APIs that return JSON directly.',
      evaluation: {
        technical_accuracy: 9,
        clarity: 9,
        depth: 7,
        communication: 8,
        overall: 8,
        feedback:
          'Accurate and clear answer. You could enhance it by mentioning content negotiation and how @ResponseBody serializes objects using Jackson.',
      },
      difficulty_level: 'medium',
    },
    {
      id: '3',
      sequence: 3,
      question:
        'Design a simple microservice architecture for an e-commerce platform. What services would you create and how would they communicate?',
      user_answer:
        "I'd create services for User, Product, Order, and Payment. They'd communicate via REST APIs. User service handles auth, Product manages catalog, Order processes orders, and Payment handles payments via Stripe. I'd use an API gateway for routing.",
      evaluation: {
        technical_accuracy: 7,
        clarity: 8,
        depth: 5,
        communication: 8,
        overall: 7,
        feedback:
          'Good high-level design. To improve, discuss event-driven communication (message queues like Kafka/RabbitMQ), service discovery, database per service pattern, and handling distributed transactions (Saga pattern).',
      },
      difficulty_level: 'hard',
    },
  ],
  started_at: '2024-10-13T10:00:00Z',
  completed_at: '2024-10-13T10:45:00Z',
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    user_message: 'What should I learn after Java collections for backend development?',
    ai_response:
      'After mastering Java Collections, the natural next step for backend development is:\n\n**1. Streams API** — Learn functional programming with Java Streams for data processing.\n\n**2. Concurrency** — Understand threads, ExecutorService, CompletableFuture, and thread safety.\n\n**3. Spring Boot** — The industry-standard framework for Java backend:\n   - Dependency Injection\n   - REST Controllers\n   - JPA/Hibernate for databases\n   - Spring Security for auth\n\n**4. Build Tools** — Maven or Gradle for dependency management.\n\nThis progression will prepare you for most Java backend roles.',
    sources: ['Career Knowledge Base: Java Learning Path', 'Career Knowledge Base: Backend Roadmap'],
    created_at: '2024-10-13T10:00:00Z',
  },
  {
    id: '2',
    user_message: 'How do I prepare for system design interviews as a fresher?',
    ai_response:
      "As a fresher, system design interviews focus on fundamentals:\n\n**1. Learn Core Concepts:**\n- Client-server architecture\n- Load balancing\n- Caching (Redis)\n- Database sharding\n- Message queues\n\n**2. Practice Common Designs:**\n- URL shortener\n- Chat application\n- Social media feed\n- File storage system\n\n**3. Framework for Answering:**\n- Clarify requirements\n- Estimate scale\n- Design high-level architecture\n- Deep-dive into components\n- Discuss trade-offs\n\n**4. Resources:**\n- 'System Design Interview' by Alex Xu\n- Grokking the System Design Interview\n\nFor freshers, interviewers test your *thinking process* more than perfect answers.",
    sources: [
      'Career Knowledge Base: Interview Prep Guide',
      'Career Knowledge Base: System Design for Beginners',
    ],
    created_at: '2024-10-13T10:05:00Z',
  },
];

// Dashboard stats
export const mockDashboardStats = {
  careerReadiness: 82,
  skillsScore: 86,
  projectsScore: 91,
  experienceScore: 74,
  jobsAnalyzed: 3,
  interviewsTaken: 5,
  skillsIdentified: 12,
  gapsFound: 7,
};
