import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, 
  Flag, RotateCcw, Trophy, X, Check, HelpCircle, 
  Timer, Play, Pause, BookOpen, Award, AlertTriangle
} from 'lucide-react';

// Types
interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'open-ended';
  options: string[];
  points: number;
}

interface QuizSession {
  sessionId: string;
  quiz: {
    id: string;
    passingScore: number;
    timeLimit?: number;
    allowRetries: boolean;
  };
  questions: QuizQuestion[];
  startedAt: string;
}

interface QuizResult {
  score: number;
  passed: boolean;
  earnedPoints: number;
  totalPoints: number;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: any;
    correctAnswer?: any;
    isCorrect: boolean;
    points: number;
    explanation?: string;
  }>;
  certificate: boolean;
}

// API Service
class QuizApiService {
  // Utilise les routes Next internes
  private baseUrl = '/api';
  private token = localStorage.getItem('token');

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Une erreur est survenue');
    }

    return response.json();
  }

  async startQuiz(quizId: string): Promise<QuizSession> {
    return this.request(`/quiz/${quizId}/start`, { method: 'POST' });
  }

  async submitQuiz(sessionId: string, answers: Record<string, any>): Promise<QuizResult> {
    return this.request(`/quiz-session/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }
}

const quizApi = new QuizApiService();

// Timer Hook
function useTimer(initialTime: number, onTimeUp: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeUp]);

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const reset = (newTime: number) => {
    setTimeLeft(newTime);
    setIsRunning(true);
  };

  return { timeLeft, isRunning, pause, resume, reset };
}

// Format Time Helper
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Progress Bar Component
function ProgressBar({ current, total, className = '' }: { current: number; total: number; className?: string }) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Question Component
function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  userAnswer, 
  onAnswerChange,
  showValidation = false 
}: {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: any;
  onAnswerChange: (answer: any) => void;
  showValidation?: boolean;
}) {
  const hasAnswer = userAnswer !== null && userAnswer !== undefined && userAnswer !== '';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
            Question {questionNumber}
          </span>
          <span className="text-sm text-gray-500">sur {totalQuestions}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">{question.points} point{question.points > 1 ? 's' : ''}</span>
          {showValidation && (
            <div className={`w-2 h-2 rounded-full ${hasAnswer ? 'bg-green-500' : 'bg-red-500'}`} />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
        {question.question}
      </h3>

      <div className="space-y-3">
        {question.type === 'multiple-choice' && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  userAnswer === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => onAnswerChange(index)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div className="grid grid-cols-2 gap-4">
            {['Vrai', 'Faux'].map((option, index) => (
              <label
                key={index}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  userAnswer === index 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={userAnswer === index}
                  onChange={() => onAnswerChange(index)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-2"
                />
                <span className="text-lg font-medium">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'open-ended' && (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
            rows={4}
            placeholder="Tapez votre réponse ici..."
          />
        )}
      </div>
    </div>
  );
}

// Results Component
function QuizResults({ result, onRetry, onContinue }: {
  result: QuizResult;
  onRetry?: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Score Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 text-center">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          result.passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {result.passed ? (
            <Trophy className={`h-10 w-10 ${result.passed ? 'text-green-600' : 'text-red-600'}`} />
          ) : (
            <X className="h-10 w-10 text-red-600" />
          )}
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
          {result.passed ? 'Félicitations !' : 'Pas encore réussi'}
        </h2>

        <p className="text-gray-600 mb-6">
          {result.passed 
            ? 'Vous avez réussi ce quiz avec succès !' 
            : 'Continuez vos efforts, vous y arriverez !'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{Math.round(result.score)}%</div>
            <div className="text-sm text-gray-500">Score obtenu</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {result.earnedPoints}/{result.totalPoints}
            </div>
            <div className="text-sm text-gray-500">Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {result.results.filter(r => r.isCorrect).length}/{result.results.length}
            </div>
            <div className="text-sm text-gray-500">Bonnes réponses</div>
          </div>
        </div>

        {result.certificate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-800">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Certificat débloqué !</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Votre certificat est maintenant disponible dans votre profil.
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Recommencer</span>
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Continuer la formation</span>
          </button>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résultats détaillés</h3>
        
        <div className="space-y-4">
          {result.results.map((questionResult, index) => (
            <div key={questionResult.questionId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900 flex-1">
                  {index + 1}. {questionResult.question}
                </h4>
                <div className={`flex items-center space-x-2 ml-4 ${
                  questionResult.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {questionResult.isCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {questionResult.points} point{questionResult.points > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Votre réponse : </span>
                  <span className={questionResult.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {questionResult.userAnswer}
                  </span>
                </div>

                {questionResult.correctAnswer !== undefined && !questionResult.isCorrect && (
                  <div>
                    <span className="font-medium text-gray-700">Bonne réponse : </span>
                    <span className="text-green-600">{questionResult.correctAnswer}</span>
                  </div>
                )}

                {questionResult.explanation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-start space-x-2">
                      <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-800 text-sm">{questionResult.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Quiz Component
export default function QuizTaking({ quizId, nextUrl }: { quizId: string; nextUrl?: string }) {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  // Timer
  const handleTimeUp = useCallback(() => {
    if (!result) {
      handleSubmit(true); // Auto-submit when time is up
    }
  }, [result]);

  const initialTime = quizSession?.quiz.timeLimit ? quizSession.quiz.timeLimit * 60 : 0;
  const { timeLeft, isRunning, pause, resume } = useTimer(initialTime, handleTimeUp);

  // Load quiz on mount
  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setIsLoading(true);
      const session = await quizApi.startQuiz(quizId);
      setQuizSession(session);
      
      // Initialize empty answers
      const initialAnswers: Record<string, any> = {};
      session.questions.forEach(q => {
        initialAnswers[q.id] = q.type === 'open-ended' ? '' : null;
      });
      setAnswers(initialAnswers);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!quizSession || isSubmitting) return;

    if (!isAutoSubmit) {
      // Check if all questions are answered
      const unansweredQuestions = quizSession.questions.filter(q => {
        const answer = answers[q.id];
        return answer === null || answer === undefined || answer === '';
      });

      if (unansweredQuestions.length > 0 && !showConfirmSubmit) {
        setShowConfirmSubmit(true);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const result = await quizApi.submitQuiz(quizSession.sessionId, answers);
      setResult(result);
      setShowConfirmSubmit(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAnsweredCount = () => {
    if (!quizSession) return 0;
    return quizSession.questions.filter(q => {
      const answer = answers[q.id];
      return answer !== null && answer !== undefined && answer !== '';
    }).length;
  };

  const navigateQuestion = (direction: 'next' | 'prev') => {
    if (!quizSession) return;
    
    const newIndex = direction === 'next' 
      ? Math.min(currentQuestionIndex + 1, quizSession.questions.length - 1)
      : Math.max(currentQuestionIndex - 1, 0);
    
    setCurrentQuestionIndex(newIndex);
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowAllQuestions(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <QuizResults
        result={result}
        onRetry={quizSession?.quiz.allowRetries ? () => {
          setResult(null);
          setCurrentQuestionIndex(0);
          const initialAnswers: Record<string, any> = {};
          quizSession.questions.forEach(q => {
            initialAnswers[q.id] = q.type === 'open-ended' ? '' : null;
          });
          setAnswers(initialAnswers);
        } : undefined}
        onContinue={() => {
          if (nextUrl) window.location.href = nextUrl;
          else window.history.back();
        }}
      />
    );
  }

  if (!quizSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Aucune session de quiz trouvée.</p>
      </div>
    );
  }

  const currentQuestion = quizSession.questions[currentQuestionIndex];
  const answeredCount = getAnsweredCount();
  const totalQuestions = quizSession.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Quiz en cours</h1>
              {quizSession.quiz.timeLimit && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                  timeLeft < 300 ? 'bg-red-100 text-red-800' : 
                  timeLeft < 900 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  <Timer className="h-4 w-4" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAllQuestions(!showAllQuestions)}
                className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </button>
              
              <div className="text-sm text-gray-600">
                {answeredCount}/{totalQuestions} réponses
              </div>
            </div>
          </div>
          
          <ProgressBar current={answeredCount} total={totalQuestions} />
        </div>
      </div>

      {/* Questions Overview */}
      {showAllQuestions && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vue d'ensemble des questions</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {quizSession.questions.map((_, index) => {
                const questionId = quizSession.questions[index].id;
                const hasAnswer = answers[questionId] !== null && 
                                answers[questionId] !== undefined && 
                                answers[questionId] !== '';
                
                return (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600 text-white'
                        : hasAnswer
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            userAnswer={answers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
            showValidation={true}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateQuestion('prev')}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Précédent</span>
          </button>

          <div className="flex items-center space-x-4">
            {isLastQuestion ? (
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Soumission...</span>
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4" />
                    <span>Terminer le quiz</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigateQuestion('next')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span>Suivant</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la soumission</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Vous avez {totalQuestions - answeredCount} question(s) non répondue(s). 
              Êtes-vous sûr de vouloir soumettre le quiz ?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Soumission...' : 'Soumettre'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
