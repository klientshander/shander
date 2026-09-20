// Curated code snippets for Code Snippet Guesser
// Subtle flex of modern PHP, Laravel, and React expertise
export const codeSnippets = [
  {
    id: 'php-nullsafe',
    language: 'PHP',
    badge: 'PHP 8.x',
    badgeColor: '#8892be',
    title: 'Nullsafe Property Access',
    question: 'Fill in the operator to safely read the nested property without throwing a null error:',
    code: `function getCustomerCity(?Customer $user): ?string {
    // Safely retrieve city if user or address relation is null
    return $user___->profile?->address?->city;
}`,
    blankToken: '___',
    answer: '?',
    options: ['?', '!', '&', '::'],
    explanation:
      'PHP 8+ introduced the nullsafe operator (?->). If the left-hand operand is null, execution short-circuits and evaluates to null without throwing a fatal Error.',
  },
  {
    id: 'laravel-eager-load',
    language: 'Laravel',
    badge: 'Eloquent ORM',
    badgeColor: '#ff2d20',
    title: 'Prevent N+1 Query Problem',
    question: 'Which Eloquent method eager loads relationships to eliminate the N+1 query issue?',
    code: `// Retrieve 50 users and eager load their published posts in 2 queries
$users = User::___(['posts' => fn ($q) => $q->where('published', true)])
    ->limit(50)
    ->get();`,
    blankToken: '___',
    answer: 'with',
    options: ['with', 'load', 'has', 'join'],
    explanation:
      'In Laravel, User::with(...) eager loads relationships upfront, reducing 51 separate SQL queries down to just 2 optimized queries.',
  },
  {
    id: 'react-functional-state',
    language: 'React',
    badge: 'Hooks & State',
    badgeColor: '#61dafb',
    title: 'Functional State Updater',
    question: 'Fill in the parameter to guarantee updating state from the latest pending value:',
    code: `function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Avoid stale closure in batched state updates
    setCount(___ => prev + 1);
  };
}`,
    blankToken: '___',
    answer: 'prev',
    options: ['prev', 'count', 'this.state', 'window.count'],
    explanation:
      'Passing an updater callback (prev => prev + 1) guarantees access to the latest state value even when updates are queued or batched asynchronously.',
  },
  {
    id: 'laravel-auth-middleware',
    language: 'Laravel',
    badge: 'Routing & Security',
    badgeColor: '#ff2d20',
    title: 'Route Authentication Middleware',
    question: 'Which built-in middleware protects this administrative route group?',
    code: `// Guard administrative endpoints against unauthorized access
Route::middleware(['___'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
});`,
    blankToken: '___',
    answer: 'auth',
    options: ['auth', 'guest', 'session', 'verified'],
    explanation:
      'Laravel’s "auth" middleware checks if the incoming request is from an authenticated user and automatically redirects unauthenticated users to the login route.',
  },
  {
    id: 'react-cleanup-return',
    language: 'React',
    badge: 'Lifecycle & Memory',
    badgeColor: '#61dafb',
    title: 'Effect Cleanup Return',
    question: 'Which keyword is used to provide the cleanup function that prevents memory leaks?',
    code: `useEffect(() => {
  const subscription = api.streamRealtimeMetrics(handleData);

  // Clean up listener before component unmounts or re-runs
  ___ () => subscription.unsubscribe();
}, []);`,
    blankToken: '___',
    answer: 'return',
    options: ['return', 'cleanup', 'yield', 'finally'],
    explanation:
      'React useEffect expects a returned cleanup function. React invokes this cleanup function right before the component unmounts or before the effect runs again.',
  },
  {
    id: 'php-match-expression',
    language: 'PHP',
    badge: 'PHP 8.0+',
    badgeColor: '#8892be',
    title: 'Type-Safe Match Expression',
    question: 'Complete this modern PHP match expression returning an HTTP status description:',
    code: `$statusCode = 404;

$message = ___ ($statusCode) {
    200, 201 => 'Success',
    404      => 'Resource Not Found',
    500      => 'Server Error',
    default  => 'Unknown Status',
};`,
    blankToken: '___',
    answer: 'match',
    options: ['match', 'switch', 'evaluate', 'case'],
    explanation:
      'PHP 8+ match expressions use strict type comparison (===), can return a direct value, and throw an UnhandledMatchError if no branch or default matches.',
  },
  {
    id: 'react-usememo-cache',
    language: 'React',
    badge: 'Performance Optimization',
    badgeColor: '#61dafb',
    title: 'Memoize Expensive Calculations',
    question: 'Which hook memoizes this CPU-intensive filtered matrix calculation?',
    code: `function DataGrid({ rows, filterQuery }) {
  // Recalculate only when rows or filterQuery dependencies change
  const filteredData = ___(
    () => computeExpensiveSearch(rows, filterQuery),
    [rows, filterQuery]
  );
}`,
    blankToken: '___',
    answer: 'useMemo',
    options: ['useMemo', 'useCallback', 'useRef', 'useEffect'],
    explanation:
      'useMemo caches the result of a function between re-renders until one of its declared dependencies changes, avoiding redundant expensive calculations.',
  },
  {
    id: 'laravel-blade-csrf',
    language: 'Laravel',
    badge: 'Blade & Security',
    badgeColor: '#ff2d20',
    title: 'CSRF Token Protection',
    question: 'What Blade directive injects a hidden CSRF token into HTML forms?',
    code: `<form method="POST" action="/checkout">
    <!-- Required to prevent 419 Page Expired errors -->
    ___

    <input type="text" name="coupon" />
    <button type="submit">Complete Order</button>
</form>`,
    blankToken: '___',
    answer: '@csrf',
    options: ['@csrf', '@token', '@auth', '{{ $csrf }}'],
    explanation:
      '@csrf generates a hidden input with name="_token" containing the session CSRF token, protecting against Cross-Site Request Forgery exploits.',
  },
  {
    id: 'php-array-spread',
    language: 'PHP',
    badge: 'Modern Syntax',
    badgeColor: '#8892be',
    title: 'Array Unpacking Spread Operator',
    question: 'Which operator merges both arrays into a clean configuration set?',
    code: `$defaults = ['debug' => false, 'ttl' => 3600];
$custom   = ['ttl' => 7200, 'region' => 'ap-southeast-1'];

// Merge arrays using unpacking
$config = [___$defaults, ___$custom];`,
    blankToken: '___',
    answer: '...',
    options: ['...', '->', '&&', '::'],
    explanation:
      'PHP 7.4+ supports array unpacking with the spread operator (...), expanding array elements in-place with clean and readable syntax.',
  },
  {
    id: 'react-custom-hook-prefix',
    language: 'React',
    badge: 'Conventions',
    badgeColor: '#61dafb',
    title: 'Custom Hook Naming Convention',
    question: 'According to React rules and linter requirements, what prefix must all custom hooks start with?',
    code: `// Custom hook that syncs reactive state to localStorage
function ___LocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => ...);
  return [stored, setStored];
}`,
    blankToken: '___',
    answer: 'use',
    options: ['use', 'get', 'create', 'with'],
    explanation:
      'React’s ESLint plugin and compiler rely on the "use" prefix to enforce the Rules of Hooks (such as not calling hooks inside loops or conditions).',
  },
]

