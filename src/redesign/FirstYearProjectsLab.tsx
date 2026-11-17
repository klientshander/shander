import React, { useState } from 'react'
import {
  FiPlay,
  FiCode,
  FiCopy,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiTerminal,
  FiRefreshCw,
  FiPlus,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiLogOut,
} from 'react-icons/fi'
import { playClickSound } from '../utils/sound'

export interface PhpActivity {
  no: number
  title: string
  concept: string
  filename: string
  summary: string
  code: string
}

export const PHP_ACTIVITIES: PhpActivity[] = [
  {
    no: 1,
    title: 'Hello World Program',
    concept: 'PHP Syntax and Output',
    filename: '01_hello_world.php',
    summary: 'Demonstrates basic PHP opening/closing tags, echo and print statements, string concatenation, and embedding PHP inside HTML.',
    code: `<?php
// Activity 1: Hello World Program
// Concept: PHP Syntax and Output

$greeting = "Hello, World!";
$student  = "Shander Santillan";
$course   = "BS Information Systems";

echo "<h1>" . $greeting . "</h1>";
echo "<p>Welcome to PHP Programming, <strong>" . $student . "</strong>!</p>";
print "<p>Course: " . $course . " | Server Time: " . date("Y-m-d H:i:s") . "</p>";
?>`,
  },
  {
    no: 2,
    title: 'Personal Information Display',
    concept: 'Variables and Data Types',
    filename: '02_personal_info.php',
    filename_short: '02_personal_info.php',
    summary: 'Uses PHP variables and core data types (String, Integer, Float, Boolean) along with gettype() and var_dump() inspection.',
    code: `<?php
// Activity 2: Personal Information Display
// Concept: Variables and Data Types

$fullName   = "Shander Santillan";       // String
$age        = 19;                        // Integer
$gpa        = 1.25;                      // Float / Double
$isEnrolled = true;                      // Boolean
$location   = "Negros Occidental, PH";   // String

echo "<h3>Student Personal Information</h3>";
echo "Name: $fullName (" . gettype($fullName) . ")<br>";
echo "Age: $age (" . gettype($age) . ")<br>";
echo "GWA / GPA: $gpa (" . gettype($gpa) . ")<br>";
echo "Enrolled: " . ($isEnrolled ? "Yes" : "No") . " (" . gettype($isEnrolled) . ")<br>";
echo "Location: $location<br>";
?>`,
  } as any,
  {
    no: 3,
    title: 'Simple Calculator',
    concept: 'Operators',
    filename: '03_simple_calculator.php',
    summary: 'Applies PHP arithmetic (+, -, *, /, %, **), assignment, and comparison operators to compute mathematical expressions.',
    code: `<?php
// Activity 3: Simple Calculator
// Concept: Operators

$num1 = 24;
$num2 = 6;
$operator = "+";

switch ($operator) {
    case "+": $result = $num1 + $num2; break;
    case "-": $result = $num1 - $num2; break;
    case "*": $result = $num1 * $num2; break;
    case "/": $result = ($num2 != 0) ? ($num1 / $num2) : "Cannot divide by zero"; break;
    case "%": $result = ($num2 != 0) ? ($num1 % $num2) : "Undefined"; break;
    case "**": $result = $num1 ** $num2; break;
    default:  $result = "Invalid Operator";
}

echo "Expression: $num1 $operator $num2 = <strong>$result</strong>";
?>`,
  },
  {
    no: 4,
    title: 'Student Grade Calculator',
    concept: 'Conditional Statements',
    filename: '04_grade_calculator.php',
    summary: 'Computes a student weighted average from Prelim, Midterm, and Final grades and evaluates academic standing using if, elseif, and else.',
    code: `<?php
// Activity 4: Student Grade Calculator
// Concept: Conditional Statements

$prelim  = 92;
$midterm = 94;
$final   = 96;

$average = ($prelim * 0.30) + ($midterm * 0.30) + ($final * 0.40);

if ($average >= 95) {
    $equivalent = "1.00";
    $remarks = "Passed — With Highest Distinction";
} elseif ($average >= 90) {
    $equivalent = "1.25";
    $remarks = "Passed — Dean's Lister";
} elseif ($average >= 85) {
    $equivalent = "1.75";
    $remarks = "Passed — Very Good";
} elseif ($average >= 75) {
    $equivalent = "2.50";
    $remarks = "Passed";
} else {
    $equivalent = "5.00";
    $remarks = "Failed";
}

echo "Weighted Average: " . number_format($average, 2) . "%<br>";
echo "Grade Equivalent: $equivalent<br>";
echo "Remarks: <strong>$remarks</strong>";
?>`,
  },
  {
    no: 5,
    title: 'Odd or Even Checker',
    concept: 'If-Else Statements',
    filename: '05_odd_or_even.php',
    summary: 'Uses the modulo operator (%) inside if-else branching to determine parity (Odd/Even) and sign classification.',
    code: `<?php
// Activity 5: Odd or Even Checker
// Concept: If-Else Statements

$number = 42;

if ($number % 2 == 0) {
    $parity = "EVEN";
} else {
    $parity = "ODD";
}

if ($number > 0) {
    $sign = "Positive";
} elseif ($number < 0) {
    $sign = "Negative";
} else {
    $sign = "Zero";
}

echo "The number <strong>$number</strong> is an <strong>$parity</strong> number ($sign).";
?>`,
  },
  {
    no: 6,
    title: 'Multiplication Table',
    concept: 'Loops',
    filename: '06_multiplication_table.php',
    summary: 'Generates formatted multiplication tables dynamically using PHP for and nested for loops.',
    code: `<?php
// Activity 6: Multiplication Table
// Concept: Loops (for / while)

$base = 7;
$limit = 10;

echo "<h4>Multiplication Table of $base</h4>";
echo "<ul>";
for ($i = 1; $i <= $limit; $i++) {
    $product = $base * $i;
    echo "<li>$base × $i = <strong>$product</strong></li>";
}
echo "</ul>";
?>`,
  },
  {
    no: 7,
    title: 'Number Guessing Program',
    concept: 'Loops and Conditions',
    filename: '07_number_guessing.php',
    summary: 'Combines iterative loops and conditional branching to compare user guesses against a target secret number with directional hints.',
    code: `<?php
// Activity 7: Number Guessing Program
// Concept: Loops and Conditions

$secretNumber = 47;
$guesses = [25, 60, 45, 47];
$attempts = 0;

foreach ($guesses as $guess) {
    $attempts++;
    if ($guess == $secretNumber) {
        echo "Attempt #$attempts ($guess): Correct! Found in $attempts tries.<br>";
        break;
    } elseif ($guess < $secretNumber) {
        echo "Attempt #$attempts ($guess): Too Low! Try higher.<br>";
    } else {
        echo "Attempt #$attempts ($guess): Too High! Try lower.<br>";
    }
}
?>`,
  },
  {
    no: 8,
    title: 'Student Score Analyzer',
    concept: 'Arrays',
    filename: '08_score_analyzer.php',
    summary: 'Processes indexed arrays of exam scores using PHP array functions (count, array_sum, max, min, rsort) to compute class statistics.',
    code: `<?php
// Activity 8: Student Score Analyzer
// Concept: Arrays

$scores = [88, 95, 79, 92, 84, 98, 73, 91];

$count   = count($scores);
$sum     = array_sum($scores);
$average = $sum / $count;
$highest = max($scores);
$lowest  = min($scores);

$passed = 0;
foreach ($scores as $s) {
    if ($s >= 75) $passed++;
}

rsort($scores); // Sort descending

echo "Total Students: $count<br>";
echo "Class Average: " . number_format($average, 2) . "<br>";
echo "Highest: $highest | Lowest: $lowest<br>";
echo "Passed: $passed / $count";
?>`,
  },
  {
    no: 9,
    title: 'Student Information Management',
    concept: 'Associative Arrays',
    filename: '09_student_management.php',
    summary: 'Stores and queries structured student records using key-value associative arrays and multidimensional array iteration.',
    code: `<?php
// Activity 9: Student Information Management
// Concept: Associative Arrays

$students = [
    [
        "id"     => "2024-001",
        "name"   => "Shander Santillan",
        "course" => "BSIS",
        "year"   => "1st Year",
        "gpa"    => 1.25
    ],
    [
        "id"     => "2024-002",
        "name"   => "Maria Clara Santos",
        "course" => "BSCS",
        "year"   => "1st Year",
        "gpa"    => 1.50
    ],
    [
        "id"     => "2024-003",
        "name"   => "Juan Dela Cruz",
        "course" => "BSIT",
        "year"   => "1st Year",
        "gpa"    => 1.75
    ]
];

foreach ($students as $student) {
    echo $student["id"] . " - " . $student["name"] . " (" . $student["course"] . ") | GPA: " . $student["gpa"] . "<br>";
}
?>`,
  },
  {
    no: 10,
    title: 'PHP Functions Collection',
    concept: 'User-Defined Functions',
    filename: '10_functions_collection.php',
    summary: 'Encapsulates reusable business logic into custom functions with parameters, type hints, and return values.',
    code: `<?php
// Activity 10: PHP Functions Collection
// Concept: User-Defined Functions

function computeFactorial(int $n): int {
    if ($n <= 1) return 1;
    $res = 1;
    for ($i = 2; $i <= $n; $i++) $res *= $i;
    return $res;
}

function isPalindrome(string $text): bool {
    $clean = strtolower(preg_replace("/[^A-Za-z0-9]/", "", $text));
    return $clean === strrev($clean);
}

function celsiusToFahrenheit(float $c): float {
    return ($c * 9 / 5) + 32;
}

echo "Factorial of 5: " . computeFactorial(5) . "<br>";
echo "Is 'radar' a palindrome? " . (isPalindrome("radar") ? "Yes" : "No") . "<br>";
echo "30°C in Fahrenheit: " . celsiusToFahrenheit(30) . "°F";
?>`,
  },
  {
    no: 11,
    title: 'Form Processing',
    concept: 'GET and POST',
    filename: '11_form_processing.php',
    summary: 'Handles HTML form submissions using $_GET and $_POST superglobals with input sanitization via htmlspecialchars() and trim().',
    code: `<?php
// Activity 11: Form Processing
// Concept: GET and POST Superglobals

$method = $_SERVER["REQUEST_METHOD"]; // "POST" or "GET"
$data   = ($method === "POST") ? $_POST : $_GET;

if (!empty($data)) {
    $name    = htmlspecialchars(trim($data["name"] ?? ""));
    $email   = htmlspecialchars(trim($data["email"] ?? ""));
    $subject = htmlspecialchars(trim($data["subject"] ?? "General Inquiry"));

    echo "<h3>Form Received via $method</h3>";
    echo "Name: $name<br>";
    echo "Email: $email<br>";
    echo "Subject: $subject";
}
?>`,
  },
  {
    no: 12,
    title: 'Login Form Demonstration',
    concept: 'Form Validation and Sessions',
    filename: '12_login_sessions.php',
    summary: 'Implements user authentication, server-side form validation, error feedback, and persistent login state using $_SESSION.',
    code: `<?php
// Activity 12: Login Form Demonstration
// Concept: Form Validation and Sessions

session_start();

$validUser = "shander";
$validPass = "php123";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? "");
    $password = trim($_POST["password"] ?? "");

    if (empty($username) || empty($password)) {
        $error = "All fields are required.";
    } elseif ($username === $validUser && $password === $validPass) {
        $_SESSION["logged_in"] = true;
        $_SESSION["username"]  = $username;
        $_SESSION["role"]      = "BSIS Student Admin";
        echo "Welcome, " . htmlspecialchars($_SESSION["username"]) . "!";
    } else {
        $error = "Invalid username or password.";
    }
}
?>`,
  },
]

export default function FirstYearProjectsLab() {
  const [selectedNo, setSelectedNo] = useState<number>(1)
  const [copied, setCopied] = useState(false)

  // Activity 1 state
  const [hwGreeting, setHwGreeting] = useState('Hello, World!')
  const [hwName, setHwName] = useState('Shander Santillan')

  // Activity 2 state
  const [piName, setPiName] = useState('Shander Santillan')
  const [piAge, setPiAge] = useState(19)
  const [piGpa, setPiGpa] = useState(1.25)
  const [piCourse, setPiCourse] = useState('BS Information Systems')
  const [piEnrolled, setPiEnrolled] = useState(true)

  // Activity 3 state
  const [calcA, setCalcA] = useState<number>(24)
  const [calcB, setCalcB] = useState<number>(6)
  const [calcOp, setCalcOp] = useState<string>('+')

  // Activity 4 state
  const [gradePrelim, setGradePrelim] = useState<number>(92)
  const [gradeMidterm, setGradeMidterm] = useState<number>(94)
  const [gradeFinal, setGradeFinal] = useState<number>(96)

  // Activity 5 state
  const [oddEvenNum, setOddEvenNum] = useState<number>(42)

  // Activity 6 state
  const [multBase, setMultBase] = useState<number>(7)
  const [multLimit, setMultLimit] = useState<number>(10)

  // Activity 7 state
  const [secretNum, setSecretNum] = useState<number>(47)
  const [guessInput, setGuessInput] = useState<string>('47')
  const [guessHistory, setGuessHistory] = useState<Array<{ guess: number; hint: string; ok: boolean }>>([
    { guess: 25, hint: 'Too Low! Try a higher number.', ok: false },
    { guess: 60, hint: 'Too High! Try a lower number.', ok: false },
    { guess: 47, hint: 'Correct! You guessed the secret number!', ok: true },
  ])

  // Activity 8 state
  const [scores, setScores] = useState<number[]>([88, 95, 79, 92, 84, 98, 73, 91])
  const [newScore, setNewScore] = useState<string>('90')

  // Activity 9 state
  const [students, setStudents] = useState([
    { id: '2024-001', name: 'Shander Santillan', course: 'BSIS', year: '1st Year', gpa: '1.25' },
    { id: '2024-002', name: 'Maria Clara Santos', course: 'BSCS', year: '1st Year', gpa: '1.50' },
    { id: '2024-003', name: 'Juan Dela Cruz', course: 'BSIT', year: '1st Year', gpa: '1.75' },
  ])
  const [searchStudent, setSearchStudent] = useState('')
  const [newStuName, setNewStuName] = useState('')
  const [newStuCourse, setNewStuCourse] = useState('BSIS')
  const [newStuGpa, setNewStuGpa] = useState('1.50')

  // Activity 10 state
  const [fnFactNum, setFnFactNum] = useState<number>(5)
  const [fnPalText, setFnPalText] = useState<string>('radar')
  const [fnCelsius, setFnCelsius] = useState<number>(30)

  // Activity 11 state
  const [formMethod, setFormMethod] = useState<'POST' | 'GET'>('POST')
  const [formName, setFormName] = useState('Shander Santillan')
  const [formEmail, setFormEmail] = useState('shander@example.edu.ph')
  const [formSubject, setFormSubject] = useState('PHP Form Processing Lab')
  const [formSubmitted, setFormSubmitted] = useState(true)

  // Activity 12 state (Starts on the Login Page UI so the user sees the real Login Form first)
  const [loginUser, setLoginUser] = useState('shander')
  const [loginPass, setLoginPass] = useState('php123')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [sessionId, setSessionId] = useState('phpsess_9f8e7d6c5b4a3f2e1d')
  const [sessionUser, setSessionUser] = useState<{
    userId: string
    username: string
    fullName: string
    role: string
    course: string
    loginTime: string
  } | null>(null)
  const [loginError, setLoginError] = useState('')

  const currentActivity = PHP_ACTIVITIES.find((a) => a.no === selectedNo) || PHP_ACTIVITIES[0]

  const handleSelectActivity = (no: number) => {
    playClickSound(0.12)
    setSelectedNo(no)
    const runnerEl = document.getElementById('rd-php-lab-runner')
    if (runnerEl) {
      runnerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const handleCopyCode = () => {
    playClickSound(0.12)
    navigator.clipboard?.writeText(currentActivity.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Helper calculations
  const calcResult = (() => {
    switch (calcOp) {
      case '+': return calcA + calcB
      case '-': return calcA - calcB
      case '*': return calcA * calcB
      case '/': return calcB !== 0 ? (calcA / calcB).toFixed(4).replace(/\.?0+$/, '') : 'Error: Division by zero'
      case '%': return calcB !== 0 ? calcA % calcB : 'Error: Modulo by zero'
      case '**': return Math.pow(calcA, calcB)
      default: return 0
    }
  })()

  const gradeAvg = gradePrelim * 0.3 + gradeMidterm * 0.3 + gradeFinal * 0.4
  const gradeInfo = (() => {
    if (gradeAvg >= 95) return { eq: '1.00', remarks: 'Passed — With Highest Distinction', pass: true }
    if (gradeAvg >= 90) return { eq: '1.25', remarks: "Passed — Dean's Lister", pass: true }
    if (gradeAvg >= 85) return { eq: '1.75', remarks: 'Passed — Very Good', pass: true }
    if (gradeAvg >= 80) return { eq: '2.00', remarks: 'Passed — Good', pass: true }
    if (gradeAvg >= 75) return { eq: '2.50', remarks: 'Passed', pass: true }
    return { eq: '5.00', remarks: 'Failed — Needs Remediation', pass: false }
  })()

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound(0.12)
    const g = parseInt(guessInput, 10)
    if (isNaN(g)) return
    let hint = ''
    let ok = false
    if (g === secretNum) {
      hint = 'Correct! You guessed the secret number!'
      ok = true
    } else if (g < secretNum) {
      hint = 'Too Low! Try a higher number.'
    } else {
      hint = 'Too High! Try a lower number.'
    }
    setGuessHistory((prev) => [...prev, { guess: g, hint, ok }])
  }

  const handleResetGuess = () => {
    playClickSound(0.12)
    const nextSecret = Math.floor(Math.random() * 100) + 1
    setSecretNum(nextSecret)
    setGuessHistory([])
    setGuessInput('')
  }

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound(0.12)
    const n = parseFloat(newScore)
    if (!isNaN(n) && n >= 0 && n <= 100) {
      setScores((prev) => [...prev, n])
      setNewScore('')
    }
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound(0.12)
    if (!newStuName.trim()) return
    const nextId = `2024-00${students.length + 1}`
    setStudents((prev) => [
      ...prev,
      { id: nextId, name: newStuName.trim(), course: newStuCourse, year: '1st Year', gpa: newStuGpa || '1.50' },
    ])
    setNewStuName('')
  }

  const factorial = (n: number): number => {
    const clamped = Math.max(0, Math.min(12, Math.floor(n)))
    let res = 1
    for (let i = 2; i <= clamped; i++) res *= i
    return res
  }

  const checkPalindrome = (str: string): boolean => {
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '')
    return clean.length > 0 && clean === clean.split('').reverse().join('')
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    playClickSound(0.12)
    const u = loginUser.trim()
    const p = loginPass.trim()
    if (!u && !p) {
      setLoginError('PHP Validation Error: Both username and password fields are required.')
      return
    }
    if (!u) {
      setLoginError('PHP Validation Error: Username field cannot be empty.')
      return
    }
    if (!p) {
      setLoginError('PHP Validation Error: Password field cannot be empty.')
      return
    }
    if (p.length < 4) {
      setLoginError('PHP Validation Error: Password must be at least 4 characters long.')
      return
    }
    if ((u.toLowerCase() === 'shander' && p === 'php123') || (u.toLowerCase() === 'admin' && p === 'admin123') || (u.toLowerCase() === 'student' && p === 'bsis2025')) {
      setLoginError('')
      setSessionId('phpsess_' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 8))
      setSessionUser({
        userId: u.toLowerCase() === 'admin' ? 'ADM-2024-01' : '2024-00192',
        username: u,
        fullName: u.toLowerCase() === 'shander' ? 'Shander Santillan' : u.toLowerCase() === 'admin' ? 'System Administrator' : 'BSIS Student',
        role: u.toLowerCase() === 'admin' ? 'System Administrator' : 'BSIS 1st Year Student',
        course: 'BS Information Systems',
        loginTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      })
    } else {
      setLoginError('Authentication Failed: Invalid username or password. Use demo: shander / php123')
    }
  }

  const handleRegenerateSession = () => {
    playClickSound(0.12)
    setSessionId('phpsess_' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 8))
  }

  return (
    <div className="rd-php-lab">
      {/* Interactive Lab Workspace */}
      <div className="rd-php-lab__workspace" id="rd-php-lab-runner">
        <div className="rd-php-lab__topbar">
          <div className="rd-php-lab__topbar-left">
            <span className="rd-php-lab__badge">
              ACTIVITY #{String(currentActivity.no).padStart(2, '0')} / 12
            </span>
            <h3 className="rd-php-lab__active-title">{currentActivity.title}</h3>
            <span className="rd-php-lab__concept-pill">{currentActivity.concept}</span>
          </div>
          <div className="rd-php-lab__nav-btns">
            <button
              type="button"
              className="rd-btn rd-btn--ghost rd-btn--small"
              onClick={() => handleSelectActivity(selectedNo > 1 ? selectedNo - 1 : 12)}
              title="Previous Activity"
            >
              <FiChevronLeft /> Prev
            </button>
            <button
              type="button"
              className="rd-btn rd-btn--ghost rd-btn--small"
              onClick={() => handleSelectActivity(selectedNo < 12 ? selectedNo + 1 : 1)}
              title="Next Activity"
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>

        <p className="rd-php-lab__summary">{currentActivity.summary}</p>

        {/* Quick Selector Pills (1..12) */}
        <div className="rd-php-lab__pills" role="tablist" aria-label="Select PHP Activity">
          {PHP_ACTIVITIES.map((a) => (
            <button
              key={a.no}
              type="button"
              role="tab"
              aria-selected={a.no === selectedNo}
              className={`rd-php-lab__pill-btn ${a.no === selectedNo ? 'is-active' : ''}`}
              onClick={() => handleSelectActivity(a.no)}
            >
              <span className="rd-php-lab__pill-num">{String(a.no).padStart(2, '0')}</span>
              <span className="rd-php-lab__pill-name">{a.title}</span>
            </button>
          ))}
        </div>

        {/* Dual Pane: Interactive Live Output + PHP Code */}
        <div className="rd-php-lab__panes">
          {/* Left Pane: Interactive Simulator */}
          <div className="rd-php-lab__pane rd-php-lab__pane--sim">
            <div className="rd-php-lab__pane-head">
              <span>
                <FiPlay /> LIVE INTERACTIVE OUTPUT
              </span>
              <span className="rd-php-lab__status-tag">PHP 8.2 RUNTIME SIMULATOR</span>
            </div>

            <div className="rd-php-lab__sim-body">
              {/* #1 HELLO WORLD */}
              {selectedNo === 1 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls">
                    <label>
                      <span>$greeting</span>
                      <input
                        type="text"
                        value={hwGreeting}
                        onChange={(e) => setHwGreeting(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>$student</span>
                      <input
                        type="text"
                        value={hwName}
                        onChange={(e) => setHwName(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">Browser Output (echo / print):</div>
                    <h4 style={{ margin: '6px 0', fontSize: '20px' }}>{hwGreeting}</h4>
                    <p style={{ margin: '4px 0' }}>
                      Welcome to PHP Programming, <strong>{hwName}</strong>!
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '12px', opacity: 0.75 }}>
                      Course: BS Information Systems | Statement: <code>echo</code> &amp; <code>print</code>
                    </p>
                  </div>
                </div>
              )}

              {/* #2 PERSONAL INFO DISPLAY */}
              {selectedNo === 2 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--grid">
                    <label>
                      <span>$fullName (string)</span>
                      <input type="text" value={piName} onChange={(e) => setPiName(e.target.value)} />
                    </label>
                    <label>
                      <span>$age (integer)</span>
                      <input
                        type="number"
                        value={piAge}
                        onChange={(e) => setPiAge(parseInt(e.target.value || '0', 10))}
                      />
                    </label>
                    <label>
                      <span>$gpa (float)</span>
                      <input
                        type="number"
                        step="0.05"
                        value={piGpa}
                        onChange={(e) => setPiGpa(parseFloat(e.target.value || '0'))}
                      />
                    </label>
                    <label>
                      <span>$course (string)</span>
                      <input type="text" value={piCourse} onChange={(e) => setPiCourse(e.target.value)} />
                    </label>
                  </div>
                  <label className="rd-php-sim__checkbox">
                    <input
                      type="checkbox"
                      checked={piEnrolled}
                      onChange={(e) => setPiEnrolled(e.target.checked)}
                    />
                    <span>$isEnrolled (boolean) = {piEnrolled ? 'true' : 'false'}</span>
                  </label>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">Variables &amp; var_dump() Inspector:</div>
                    <ul className="rd-php-sim__kv">
                      <li>
                        <span>Name:</span> <strong>{piName}</strong> <code>string({piName.length})</code>
                      </li>
                      <li>
                        <span>Age:</span> <strong>{piAge}</strong> <code>int({piAge})</code>
                      </li>
                      <li>
                        <span>GPA:</span> <strong>{piGpa.toFixed(2)}</strong> <code>float({piGpa})</code>
                      </li>
                      <li>
                        <span>Course:</span> <strong>{piCourse}</strong> <code>string({piCourse.length})</code>
                      </li>
                      <li>
                        <span>Enrolled:</span> <strong>{piEnrolled ? 'Yes' : 'No'}</strong>{' '}
                        <code>bool({piEnrolled ? 'true' : 'false'})</code>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* #3 SIMPLE CALCULATOR */}
              {selectedNo === 3 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--row">
                    <label>
                      <span>$num1</span>
                      <input
                        type="number"
                        value={calcA}
                        onChange={(e) => setCalcA(parseFloat(e.target.value || '0'))}
                      />
                    </label>
                    <label>
                      <span>Operator</span>
                      <select value={calcOp} onChange={(e) => setCalcOp(e.target.value)}>
                        <option value="+">+ (Addition)</option>
                        <option value="-">- (Subtraction)</option>
                        <option value="*">* (Multiplication)</option>
                        <option value="/">/ (Division)</option>
                        <option value="%">% (Modulo)</option>
                        <option value="**">** (Exponent)</option>
                      </select>
                    </label>
                    <label>
                      <span>$num2</span>
                      <input
                        type="number"
                        value={calcB}
                        onChange={(e) => setCalcB(parseFloat(e.target.value || '0'))}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">Computed Result:</div>
                    <div className="rd-php-sim__big-result">
                      {calcA} {calcOp} {calcB} = <strong>{calcResult}</strong>
                    </div>
                    <div className="rd-php-sim__mini-grid">
                      <span>Sum (+): {calcA + calcB}</span>
                      <span>Diff (-): {calcA - calcB}</span>
                      <span>Prod (*): {calcA * calcB}</span>
                      <span>Equal (==): {calcA === calcB ? 'true' : 'false'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* #4 STUDENT GRADE CALCULATOR */}
              {selectedNo === 4 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--row">
                    <label>
                      <span>Prelim (30%)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradePrelim}
                        onChange={(e) => setGradePrelim(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>Midterm (30%)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeMidterm}
                        onChange={(e) => setGradeMidterm(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>Final (40%)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={gradeFinal}
                        onChange={(e) => setGradeFinal(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">Conditional Evaluation (if / elseif / else):</div>
                    <div className="rd-php-sim__big-result">
                      Average: <strong>{gradeAvg.toFixed(2)}%</strong> (Equivalent: <code>{gradeInfo.eq}</code>)
                    </div>
                    <p style={{ margin: '6px 0 0', fontWeight: 600 }}>
                      Remarks: <span style={{ color: gradeInfo.pass ? '#10b981' : '#ef4444' }}>{gradeInfo.remarks}</span>
                    </p>
                  </div>
                </div>
              )}

              {/* #5 ODD OR EVEN CHECKER */}
              {selectedNo === 5 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls">
                    <label>
                      <span>Enter an Integer ($number)</span>
                      <input
                        type="number"
                        value={oddEvenNum}
                        onChange={(e) => setOddEvenNum(parseInt(e.target.value || '0', 10))}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">If-Else Parity Check ($number % 2 == 0):</div>
                    <div className="rd-php-sim__big-result">
                      {oddEvenNum} is <strong>{oddEvenNum % 2 === 0 ? 'EVEN' : 'ODD'}</strong>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.8 }}>
                      Sign: <strong>{oddEvenNum > 0 ? 'Positive (+)' : oddEvenNum < 0 ? 'Negative (-)' : 'Zero (0)'}</strong> | Modulo remainder: <code>{oddEvenNum % 2}</code>
                    </p>
                  </div>
                </div>
              )}

              {/* #6 MULTIPLICATION TABLE */}
              {selectedNo === 6 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--row">
                    <label>
                      <span>Base Number ($base)</span>
                      <input
                        type="number"
                        value={multBase}
                        onChange={(e) => setMultBase(parseInt(e.target.value || '1', 10))}
                      />
                    </label>
                    <label>
                      <span>Loop Limit ($limit, max 15)</span>
                      <input
                        type="number"
                        min="1"
                        max="15"
                        value={multLimit}
                        onChange={(e) => setMultLimit(Math.max(1, Math.min(15, parseInt(e.target.value || '10', 10))))}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">Generated via PHP for ($i = 1; $i &lt;= {multLimit}; $i++):</div>
                    <div className="rd-php-sim__mult-grid">
                      {Array.from({ length: multLimit }, (_, i) => i + 1).map((i) => (
                        <div key={i} className="rd-php-sim__mult-cell">
                          <span>{multBase} × {i}</span>
                          <strong>= {multBase * i}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* #7 NUMBER GUESSING PROGRAM */}
              {selectedNo === 7 && (
                <div className="rd-php-sim">
                  <form className="rd-php-sim__controls rd-php-sim__controls--row" onSubmit={handleGuessSubmit}>
                    <label style={{ flex: 1 }}>
                      <span>Guess a number (1 – 100)</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={guessInput}
                        onChange={(e) => setGuessInput(e.target.value)}
                        placeholder="Enter 1-100..."
                      />
                    </label>
                    <button type="submit" className="rd-btn rd-btn--primary rd-btn--small" style={{ alignSelf: 'flex-end' }}>
                      Submit Guess
                    </button>
                    <button
                      type="button"
                      className="rd-btn rd-btn--ghost rd-btn--small"
                      style={{ alignSelf: 'flex-end' }}
                      onClick={handleResetGuess}
                    >
                      <FiRefreshCw /> New Number
                    </button>
                  </form>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">
                      Loop Attempt Log (Attempts: {guessHistory.length}):
                    </div>
                    {guessHistory.length === 0 ? (
                      <p style={{ margin: '6px 0', opacity: 0.7 }}>New secret number generated! Enter a guess above.</p>
                    ) : (
                      <ul className="rd-php-sim__kv">
                        {guessHistory.slice(-5).map((item, idx) => (
                          <li key={idx}>
                            <span>Guess #{idx + 1}: <strong>{item.guess}</strong></span>
                            <span style={{ color: item.ok ? '#10b981' : 'inherit' }}>{item.hint}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* #8 STUDENT SCORE ANALYZER */}
              {selectedNo === 8 && (
                <div className="rd-php-sim">
                  <form className="rd-php-sim__controls rd-php-sim__controls--row" onSubmit={handleAddScore}>
                    <label style={{ flex: 1 }}>
                      <span>Add Score to $scores[] (0–100)</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                      />
                    </label>
                    <button type="submit" className="rd-btn rd-btn--primary rd-btn--small" style={{ alignSelf: 'flex-end' }}>
                      <FiPlus /> Add Score
                    </button>
                  </form>
                  <div className="rd-php-sim__score-chips">
                    {scores.map((s, idx) => (
                      <span key={idx} className="rd-php-sim__chip">
                        [{idx}] = {s}
                        {scores.length > 2 && (
                          <button
                            type="button"
                            onClick={() => setScores((prev) => prev.filter((_, i) => i !== idx))}
                            aria-label="Remove score"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">PHP Array Analytics:</div>
                    <div className="rd-php-sim__mini-grid">
                      <span>count(): <strong>{scores.length}</strong></span>
                      <span>array_sum(): <strong>{scores.reduce((a, b) => a + b, 0)}</strong></span>
                      <span>Average: <strong>{(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)}</strong></span>
                      <span>max(): <strong>{Math.max(...scores)}</strong></span>
                      <span>min(): <strong>{Math.min(...scores)}</strong></span>
                      <span>Passed (&ge;75): <strong>{scores.filter((s) => s >= 75).length}/{scores.length}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* #9 STUDENT INFORMATION MANAGEMENT */}
              {selectedNo === 9 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--row">
                    <label style={{ flex: 1 }}>
                      <span>Filter Associative Array</span>
                      <input
                        type="text"
                        placeholder="Search by name, ID, or course..."
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                      />
                    </label>
                  </div>
                  <form className="rd-php-sim__controls rd-php-sim__controls--row" onSubmit={handleAddStudent}>
                    <input
                      type="text"
                      placeholder="New student name..."
                      value={newStuName}
                      onChange={(e) => setNewStuName(e.target.value)}
                      style={{ flex: 2 }}
                    />
                    <select value={newStuCourse} onChange={(e) => setNewStuCourse(e.target.value)} style={{ flex: 1 }}>
                      <option value="BSIS">BSIS</option>
                      <option value="BSCS">BSCS</option>
                      <option value="BSIT">BSIT</option>
                    </select>
                    <button type="submit" className="rd-btn rd-btn--primary rd-btn--small">
                      <FiPlus /> Add
                    </button>
                  </form>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">$students[] Associative Records:</div>
                    <div className="rd-php-sim__table-wrap">
                      <table className="rd-php-sim__mini-table">
                        <thead>
                          <tr>
                            <th>['id']</th>
                            <th>['name']</th>
                            <th>['course']</th>
                            <th>['gpa']</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter(
                              (s) =>
                                s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
                                s.course.toLowerCase().includes(searchStudent.toLowerCase()) ||
                                s.id.toLowerCase().includes(searchStudent.toLowerCase())
                            )
                            .map((s) => (
                              <tr key={s.id}>
                                <td><code>{s.id}</code></td>
                                <td><strong>{s.name}</strong></td>
                                <td>{s.course}</td>
                                <td>{s.gpa}</td>
                                <td>
                                  {students.length > 1 && (
                                    <button
                                      type="button"
                                      className="rd-php-sim__del-btn"
                                      onClick={() => setStudents((prev) => prev.filter((item) => item.id !== s.id))}
                                      title="Delete record"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* #10 PHP FUNCTIONS COLLECTION */}
              {selectedNo === 10 && (
                <div className="rd-php-sim">
                  <div className="rd-php-sim__controls rd-php-sim__controls--grid">
                    <label>
                      <span>computeFactorial($n)</span>
                      <input
                        type="number"
                        min="0"
                        max="12"
                        value={fnFactNum}
                        onChange={(e) => setFnFactNum(Number(e.target.value))}
                      />
                    </label>
                    <label>
                      <span>isPalindrome($str)</span>
                      <input
                        type="text"
                        value={fnPalText}
                        onChange={(e) => setFnPalText(e.target.value)}
                      />
                    </label>
                    <label>
                      <span>celsiusToFahrenheit($c)</span>
                      <input
                        type="number"
                        value={fnCelsius}
                        onChange={(e) => setFnCelsius(Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="rd-php-sim__output">
                    <div className="rd-php-sim__output-label">User-Defined Function Return Values:</div>
                    <ul className="rd-php-sim__kv">
                      <li>
                        <span><code>computeFactorial({fnFactNum})</code></span>
                        <strong>= {factorial(fnFactNum).toLocaleString()}</strong>
                      </li>
                      <li>
                        <span><code>isPalindrome("{fnPalText}")</code></span>
                        <strong>= {checkPalindrome(fnPalText) ? 'true (Palindrome)' : 'false (Not Palindrome)'}</strong>
                      </li>
                      <li>
                        <span><code>celsiusToFahrenheit({fnCelsius})</code></span>
                        <strong>= {((fnCelsius * 9) / 5 + 32).toFixed(1)} °F</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* #11 FORM PROCESSING (GET AND POST) */}
              {selectedNo === 11 && (
                <div className="rd-php-sim">
                  <form
                    className="rd-php-sim__controls"
                    onSubmit={(e) => {
                      e.preventDefault()
                      playClickSound(0.12)
                      setFormSubmitted(true)
                    }}
                  >
                    <div className="rd-php-sim__controls--row">
                      <label>
                        <span>HTTP Method</span>
                        <select
                          value={formMethod}
                          onChange={(e) => setFormMethod(e.target.value as 'POST' | 'GET')}
                        >
                          <option value="POST">POST ($_POST)</option>
                          <option value="GET">GET ($_GET)</option>
                        </select>
                      </label>
                      <label style={{ flex: 1 }}>
                        <span>name="name"</span>
                        <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} />
                      </label>
                    </div>
                    <div className="rd-php-sim__controls--row">
                      <label style={{ flex: 1 }}>
                        <span>name="email"</span>
                        <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                      </label>
                      <label style={{ flex: 1 }}>
                        <span>name="subject"</span>
                        <input type="text" value={formSubject} onChange={(e) => setFormSubject(e.target.value)} />
                      </label>
                    </div>
                  </form>
                  {formSubmitted && (
                    <div className="rd-php-sim__output">
                      <div className="rd-php-sim__output-label">
                        Server Superglobal <code>$__{formMethod}</code> Payload:
                      </div>
                      {formMethod === 'GET' && (
                        <div className="rd-php-sim__url-bar">
                          GET URL: <code>process.php?name={encodeURIComponent(formName)}&amp;email={encodeURIComponent(formEmail)}&amp;subject={encodeURIComponent(formSubject)}</code>
                        </div>
                      )}
                      <pre className="rd-php-sim__pre">
{`Array (
  ["name"]    => "${formName}"
  ["email"]   => "${formEmail}"
  ["subject"] => "${formSubject}"
)`}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* #12 LOGIN FORM DEMONSTRATION — REALISTIC LOGIN PAGE & SESSION PORTAL */}
              {selectedNo === 12 && (
                <div className="rd-login-demo">
                  {/* Simulated Web Browser Chrome */}
                  <div className="rd-login-browser">
                    <div className="rd-login-browser__bar">
                      <div className="rd-login-browser__dots" aria-hidden="true">
                        <span className="is-red" />
                        <span className="is-yellow" />
                        <span className="is-green" />
                      </div>
                      <div className="rd-login-browser__url">
                        <FiLock className="rd-login-browser__lock" />
                        <span>
                          {sessionUser
                            ? 'https://localhost:8080/student-portal/dashboard.php'
                            : 'https://localhost:8080/student-portal/login.php'}
                        </span>
                      </div>
                      <span className={`rd-login-browser__status ${sessionUser ? 'is-auth' : ''}`}>
                        {sessionUser ? 'SESSION ACTIVE' : 'GUEST'}
                      </span>
                    </div>

                    {/* Browser Viewport */}
                    <div className="rd-login-browser__viewport">
                      {!sessionUser ? (
                        <div className="rd-login-page">
                          <div className="rd-login-card">
                            <div className="rd-login-card__header">
                              <div className="rd-login-card__logo">
                                <FiShield />
                              </div>
                              <span className="rd-login-card__eyebrow">BSIS ACADEMIC PORTAL</span>
                              <h4 className="rd-login-card__title">Sign in to your account</h4>
                              <p className="rd-login-card__sub">
                                Enter your student credentials to start a PHP <code>$_SESSION</code>
                              </p>
                            </div>

                            {loginError && (
                              <div className="rd-login-card__alert" role="alert">
                                <FiAlertCircle />
                                <span>{loginError}</span>
                              </div>
                            )}

                            <form className="rd-login-card__form" onSubmit={handleLoginSubmit}>
                              <div className="rd-login-card__field">
                                <label htmlFor="php-demo-user">Username / Student ID</label>
                                <div className="rd-login-card__input-wrap">
                                  <FiUser className="rd-login-card__field-icon" />
                                  <input
                                    id="php-demo-user"
                                    type="text"
                                    value={loginUser}
                                    onChange={(e) => {
                                      setLoginUser(e.target.value)
                                      if (loginError) setLoginError('')
                                    }}
                                    placeholder="Enter username (e.g. shander)"
                                    autoComplete="off"
                                  />
                                </div>
                              </div>

                              <div className="rd-login-card__field">
                                <div className="rd-login-card__label-row">
                                  <label htmlFor="php-demo-pass">Password</label>
                                  <span className="rd-login-card__hint">Demo: php123</span>
                                </div>
                                <div className="rd-login-card__input-wrap">
                                  <FiLock className="rd-login-card__field-icon" />
                                  <input
                                    id="php-demo-pass"
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginPass}
                                    onChange={(e) => {
                                      setLoginPass(e.target.value)
                                      if (loginError) setLoginError('')
                                    }}
                                    placeholder="Enter your password"
                                    autoComplete="off"
                                  />
                                  <button
                                    type="button"
                                    className="rd-login-card__eye-btn"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                  >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                  </button>
                                </div>
                              </div>

                              <div className="rd-login-card__options">
                                <label className="rd-login-card__remember">
                                  <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                  />
                                  <span>Remember session cookie</span>
                                </label>
                                <span className="rd-login-card__method-tag">METHOD="POST"</span>
                              </div>

                              <button type="submit" className="rd-login-card__submit">
                                <FiUnlock /> Sign In to Portal
                              </button>
                            </form>

                            {/* Quick Preset Tester Bar */}
                            <div className="rd-login-card__presets">
                              <span className="rd-login-card__presets-label">Quick Test Presets:</span>
                              <div className="rd-login-card__preset-btns">
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound(0.1)
                                    setLoginUser('shander')
                                    setLoginPass('php123')
                                    setLoginError('')
                                  }}
                                >
                                  Valid (shander)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound(0.1)
                                    setLoginUser('admin')
                                    setLoginPass('admin123')
                                    setLoginError('')
                                  }}
                                >
                                  Admin Account
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound(0.1)
                                    setLoginUser('shander')
                                    setLoginPass('wrongpass')
                                    setLoginError('Authentication Failed: Invalid username or password.')
                                  }}
                                >
                                  Wrong Password
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    playClickSound(0.1)
                                    setLoginUser('')
                                    setLoginPass('')
                                    setLoginError('PHP Validation Error: Both username and password fields are required.')
                                  }}
                                >
                                  Empty Fields
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rd-login-dashboard">
                          <div className="rd-login-dashboard__nav">
                            <div className="rd-login-dashboard__brand">
                              <FiShield />
                              <span>BSIS Student Portal</span>
                            </div>
                            <button
                              type="button"
                              className="rd-login-dashboard__logout"
                              onClick={() => {
                                playClickSound(0.12)
                                setSessionUser(null)
                              }}
                            >
                              <FiLogOut /> Log Out (session_destroy)
                            </button>
                          </div>

                          <div className="rd-login-dashboard__welcome">
                            <div className="rd-login-dashboard__avatar">
                              {sessionUser.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="rd-login-dashboard__user-meta">
                              <div className="rd-login-dashboard__status-line">
                                <FiCheckCircle className="is-ok" />
                                <span>Authenticated via PHP $_SESSION</span>
                              </div>
                              <h4>Welcome back, {sessionUser.fullName}!</h4>
                              <p>
                                {sessionUser.role} • {sessionUser.course} • ID: <code>{sessionUser.userId}</code>
                              </p>
                            </div>
                          </div>

                          <div className="rd-login-dashboard__session-box">
                            <div className="rd-login-dashboard__session-head">
                              <span>Active $_SESSION Superglobal Inspector</span>
                              <button
                                type="button"
                                className="rd-login-dashboard__regen-btn"
                                onClick={handleRegenerateSession}
                              >
                                <FiRefreshCw /> session_regenerate_id()
                              </button>
                            </div>
                            <ul className="rd-php-sim__kv">
                              <li>
                                <span><code>session_id()</code></span>
                                <code>{sessionId}</code>
                              </li>
                              <li>
                                <span><code>$_SESSION['logged_in']</code></span>
                                <strong style={{ color: '#10b981' }}>true</strong>
                              </li>
                              <li>
                                <span><code>$_SESSION['user_id']</code></span>
                                <code>"{sessionUser.userId}"</code>
                              </li>
                              <li>
                                <span><code>$_SESSION['username']</code></span>
                                <strong>"{sessionUser.username}"</strong>
                              </li>
                              <li>
                                <span><code>$_SESSION['role']</code></span>
                                <span>"{sessionUser.role}"</span>
                              </li>
                              <li>
                                <span><code>$_SESSION['login_time']</code></span>
                                <code>"{sessionUser.loginTime}"</code>
                              </li>
                              <li>
                                <span><code>$_COOKIE['remember_user']</code></span>
                                <code>{rememberMe ? `"${sessionUser.username}" (30 days)` : 'null (Session only)'}</code>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: PHP Source Code */}
          <div className="rd-php-lab__pane rd-php-lab__pane--code">
            <div className="rd-php-lab__pane-head">
              <span>
                <FiCode /> {currentActivity.filename}
              </span>
              <button
                type="button"
                className="rd-php-lab__copy-btn"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <>
                    <FiCheck /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy PHP
                  </>
                )}
              </button>
            </div>
            <pre className="rd-php-lab__code-block">
              <code>{currentActivity.code}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Complete 12-Activity Curriculum Table */}
      <div className="rd-php-lab__directory">
        <div className="rd-php-lab__directory-head">
          <div>
            <span className="rd-eyebrow">COMPLETE CURRICULUM INDEX</span>
            <h3 className="rd-php-lab__dir-title">All 12 First Year PHP Projects &amp; Activities</h3>
          </div>
          <span className="rd-php-lab__badge">12 / 12 COMPLETED</span>
        </div>

        <div className="rd-php-lab__table-container">
          <table className="rd-php-lab__table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Project / Activity</th>
                <th>PHP Concepts</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {PHP_ACTIVITIES.map((act) => {
                const isSelected = act.no === selectedNo
                return (
                  <tr
                    key={act.no}
                    className={isSelected ? 'is-selected' : ''}
                    onClick={() => handleSelectActivity(act.no)}
                  >
                    <td className="rd-php-lab__td-no">{String(act.no).padStart(2, '0')}</td>
                    <td className="rd-php-lab__td-title">
                      <strong>{act.title}</strong>
                      <span className="rd-php-lab__td-file">{act.filename}</span>
                    </td>
                    <td className="rd-php-lab__td-concept">
                      <span className="rd-php-lab__concept-tag">{act.concept}</span>
                    </td>
                    <td className="rd-php-lab__td-action">
                      <button
                        type="button"
                        className={`rd-btn rd-btn--small ${isSelected ? 'rd-btn--primary' : 'rd-btn--ghost'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectActivity(act.no)
                        }}
                      >
                        <FiTerminal /> {isSelected ? 'Running' : 'Open Activity'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
