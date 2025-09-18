import { z } from 'zod';

// Formation validation schema
export const FormationSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  shortDescription: z.string().min(5).max(300),
  category: z.enum(['CYBERSECURITE', 'SENSIBILISATION', 'TECHNIQUE', 'MANAGEMENT']),
  level: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']),
  instructor: z.string().min(2),
  duration: z.string(),
  price: z.number().optional(),
  maxEnrollments: z.number().optional(),
  language: z.string().default('fr'),
  tags: z.array(z.string()),
  prerequisites: z.array(z.string()),
  objectives: z.array(z.string()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  featured: z.boolean().default(false),
  certificateEnabled: z.boolean().default(true),
  allowDiscussions: z.boolean().default(true)
});

// Module validation schema
export const ModuleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  duration: z.number().min(1), // en minutes
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'EXERCISE']),
  content: z.string(),
  order: z.number().default(0)
});

// Quiz validation schema
export const QuizSchema = z.object({
  passingScore: z.number().min(0).max(100).default(70),
  timeLimit: z.number().optional(), // en minutes
  allowRetries: z.boolean().default(true),
  showCorrectAnswers: z.boolean().default(true),
  questions: z.array(z.object({
    question: z.string().min(5),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'OPEN_ENDED']),
    options: z.array(z.string()),
    correctAnswer: z.union([z.number(), z.string()]),
    explanation: z.string().optional(),
    points: z.number().default(1)
  }))
});

// 2FA setup validation
export const TwoFactorSetupSchema = z.object({
  token: z.string().length(6, 'Le code doit contenir 6 chiffres')
});

// Quiz answer submission schema
export const QuizAnswerSchema = z.object({
  answers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
});

// Registration schema (enhanced)
export const RegistrationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  organization: z.string().min(2, 'L\'organisation doit contenir au moins 2 caractères').optional(),
  orgType: z.enum(['ONG', 'ASSOCIATION', 'FONDATION', 'INSTITUTION', 'ENTREPRISE', 'AUTRE']).optional(),
  country: z.string().min(2, 'Le pays doit être spécifié'),
  position: z.string().min(2, 'Le poste doit être spécifié').optional(),
  phone: z.string().optional(),
  newsletter: z.boolean().default(false)
});

// Login schema (enhanced with 2FA)
export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  totpCode: z.string().optional()
});
