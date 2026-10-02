import json
import logging
from datetime import datetime, timedelta
from app.database.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.skill import Skill
from app.models.challenge import Challenge
from app.models.submission import Submission
from app.models.evaluation import Evaluation
from app.models.skill_evidence import SkillEvidence
from app.models.project import Project
from app.models.badge import Badge, StudentBadge
from app.models.notification import Notification

logger = logging.getLogger(__name__)

def seed_database():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_student = db.query(User).filter(User.email == "demo.student@skillproof.dev").first()
        if existing_student:
            logger.info("Database already seeded. Skipping initial seeding.")
            return

        logger.info("Seeding database with SkillProof demo data...")
        default_pw = get_password_hash("password123")

        # 1. USERS
        student1 = User(
            id="user-student-demo",
            name="Aarav Mehta",
            username="aarav_m",
            email="demo.student@skillproof.dev",
            password_hash=default_pw,
            role="STUDENT",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            headline="Full Stack Developer & Systems Enthusiast",
            bio="Building high-performance interactive web tools and APIs. Proof of practical ability over certificates.",
            college="Indian Institute of Technology (IIT)",
            location="Bangalore, India",
            github_url="https://github.com/aarav-mehta",
            linkedin_url="https://linkedin.com/in/aarav-mehta"
        )

        student2 = User(
            id="user-student-priya",
            name="Priya Sharma",
            username="priya_s",
            email="priya.sharma@skillproof.dev",
            password_hash=default_pw,
            role="STUDENT",
            avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
            headline="Data Analyst & Python Developer",
            bio="Passionate about data cleaning, statistical modeling, and actionable business insights.",
            college="National Institute of Technology",
            location="New Delhi, India",
            github_url="https://github.com/priya-sharma",
            linkedin_url="https://linkedin.com/in/priya-sharma"
        )

        student3 = User(
            id="user-student-marcus",
            name="Marcus Chen",
            username="marcus_c",
            email="marcus.chen@skillproof.dev",
            password_hash=default_pw,
            role="STUDENT",
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            headline="Backend Engineer & Distributed Database Specialist",
            bio="Designing resilient microservices, query tuning, and PostgreSQL architectures.",
            college="University of California, Berkeley",
            location="San Francisco, USA",
            github_url="https://github.com/marcus-chen",
            linkedin_url="https://linkedin.com/in/marcus-chen"
        )

        recruiter = User(
            id="user-recruiter-demo",
            name="Elena Rostova",
            username="elena_r",
            email="demo.recruiter@skillproof.dev",
            password_hash=default_pw,
            role="RECRUITER",
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            headline="Senior Technical Talent Partner @ Apex Ventures",
            college="Stanford University",
            location="New York, USA"
        )

        admin = User(
            id="user-admin-demo",
            name="SkillProof Admin",
            username="admin",
            email="demo.admin@skillproof.dev",
            password_hash=default_pw,
            role="ADMIN",
            headline="Platform Administrator",
            location="Remote"
        )

        db.add_all([student1, student2, student3, recruiter, admin])
        db.commit()

        # 2. SKILLS
        skills_data = [
            ("skill-js", "JavaScript", "Programming", "Modern ES6+, async patterns, closures, DOM manipulation", "code"),
            ("skill-react", "React", "Frontend Development", "Component lifecycles, hooks, state management, render optimization", "layers"),
            ("skill-html-css", "HTML/CSS", "Frontend Development", "Semantic HTML5, CSS Grid, Flexbox, responsive layouts", "layout"),
            ("skill-sql", "SQL", "Database", "Relational database querying, joins, indexing, aggregation, query tuning", "database"),
            ("skill-python", "Python", "Programming", "Idiomatic Python, data structures, OOP, scripting, packaging", "terminal"),
            ("skill-node", "Node.js", "Backend Development", "Event loop, streams, Express/Fastify server-side programming", "server"),
            ("skill-ts", "TypeScript", "Programming", "Type safety, generics, unions, utility types, strict configs", "file-code"),
            ("skill-rest", "REST APIs", "Backend Development", "API architectural constraints, HTTP semantics, auth, rate limiting", "network"),
            ("skill-uiux", "UI/UX & Accessibility", "Design", "WCAG 2.1 AA standards, semantic hierarchy, accessible design systems", "eye"),
            ("skill-docker", "Docker", "DevOps", "Containerization, multi-stage builds, volume mounts, networking", "box"),
            ("skill-data-analysis", "Data Analysis", "Data", "Data wrangling, Pandas, exploratory data analysis, hypothesis testing", "pie-chart"),
            ("skill-git", "Git", "Productivity", "Version control, branching strategies, merge conflict resolution", "git-branch")
        ]

        skills_dict = {}
        for sid, name, cat, desc, icon in skills_data:
            s = Skill(id=sid, name=name, category=cat, description=desc, icon=icon)
            db.add(s)
            skills_dict[sid] = s
        db.commit()

        # 3. BADGES
        badges_data = [
            ("badge-first-proof", "First Proof", "Completed first practical challenge and earned verified skill evidence.", "award", "Complete 1 practical challenge"),
            ("badge-problem-solver", "Problem Solver", "Solved 3+ practical challenges across varied engineering domains.", "zap", "Complete 3 practical challenges"),
            ("badge-multi-skilled", "Full Stack Explorer", "Demonstrated verified proficiency across at least 3 distinct skills.", "layers", "Demonstrate 3 unique skills"),
            ("badge-frontend-verified", "Frontend Verified", "Achieved an 85+ score on practical frontend architecture.", "layout", "Score 85+ on frontend challenge"),
            ("badge-clean-code", "Code Craftsman", "Attained top scores for code quality, modularity, and maintainability.", "check-circle", "Score 18/20+ on code quality")
        ]
        for bid, name, desc, icon, req in badges_data:
            b = Badge(id=bid, name=name, description=desc, icon=icon, requirement=req)
            db.add(b)
        db.commit()

        # 4. CHALLENGES
        challenges_data = [
            {
                "id": "chal-expense-tracker",
                "title": "Build an Interactive Expense Tracker",
                "description": "Create a reactive, client-side expense tracker that records income and expenses, computes running totals, supports filtering by date/category, and persists state.",
                "scenario": "A financial planning startup needs a responsive expense tracking component for their consumer budget app. It must work smoothly across viewports without full-page reloads.",
                "difficulty": "INTERMEDIATE",
                "category": "Frontend Development",
                "estimated_minutes": 60,
                "skill_id": "skill-js",
                "instructions": "1. Build an interactive UI with transaction addition and deletion.\n2. Calculate real-time balance, income, and expense totals.\n3. Implement category tagging (Food, Rent, Utilities, Entertainment).\n4. Persist data via LocalStorage or client store.\n5. Ensure responsive CSS and input validations.",
                "requirements": [
                    "Transaction form with Title, Amount (positive/negative), and Category",
                    "Dynamic balance summary updated immediately on entry",
                    "History list with delete action and categorical color badges",
                    "Input validation preventing negative balances or empty descriptions",
                    "Mobile-responsive grid or flex layout"
                ],
                "evaluation_criteria": [
                    "Functionality: Accurate arithmetic and reliable state persistence (25 pts)",
                    "UI/UX: Clear visual hierarchy, feedback toasts, and intuitive interactions (25 pts)",
                    "Responsiveness: Flawless layout across 320px to 1440px viewports (20 pts)",
                    "Code Quality: Modular function separation and clean event handling (20 pts)",
                    "Accessibility: Semantic form tags, visible focus indicators, and labels (10 pts)"
                ]
            },
            {
                "id": "chal-event-registration",
                "title": "Build a Responsive Event Registration Page",
                "description": "Develop an accessible, mobile-first registration portal for an international developer summit, complete with multi-tier ticket selection and validation.",
                "scenario": "A tech conference expects 10,000 attendees and requires a rock-solid landing page that captures registrations on smartphones without friction.",
                "difficulty": "BEGINNER",
                "category": "Frontend Development",
                "estimated_minutes": 45,
                "skill_id": "skill-html-css",
                "instructions": "1. Craft a responsive hero section and schedule overview.\n2. Design an interactive ticket tier selector (Early Bird, Standard, VIP).\n3. Implement a complete registration form with client-side checks.\n4. Ensure compliance with WCAG contrast and keyboard navigation.",
                "requirements": [
                    "Multi-tier ticket cards highlighting features and pricing",
                    "Accessible form with Name, Email, Organization, and Dietary preferences",
                    "Custom styled responsive checkboxes and radio groups",
                    "CSS Grid / Flexbox layout without horizontal overflow"
                ],
                "evaluation_criteria": [
                    "Functionality: Form field interactions and pricing calculations (25 pts)",
                    "UI/UX: Modern conference aesthetic and high readability (25 pts)",
                    "Responsiveness: Adaptive breakpoint transitions (20 pts)",
                    "Code Quality: Semantic HTML tags and clean CSS architecture (20 pts)",
                    "Accessibility: Contrast ratios >= 4.5:1 and proper input labels (10 pts)"
                ]
            },
            {
                "id": "chal-messy-db",
                "title": "Analyze a Messy E-commerce Database",
                "description": "Write advanced SQL queries to clean duplicate records, calculate 30-day cohort retention, compute customer lifetime value (LTV), and identify top revenue leaks.",
                "scenario": "An online retail platform has data anomalies due to legacy microservices. The analytics team needs accurate SQL scripts for executive metrics.",
                "difficulty": "INTERMEDIATE",
                "category": "Database",
                "estimated_minutes": 75,
                "skill_id": "skill-sql",
                "instructions": "1. Formulate window functions to identify duplicate orders.\n2. Write aggregate queries joining orders, items, and refunds.\n3. Compute monthly recurring metrics using Common Table Expressions (CTEs).\n4. Optimize indexing strategies for large table joins.",
                "requirements": [
                    "Deduplication query utilizing ROW_NUMBER() OVER partition",
                    "Monthly cohort retention matrix using CTEs",
                    "Customer Lifetime Value (LTV) calculation with refund deductions",
                    "EXPLAIN ANALYZE performance tuning notes"
                ],
                "evaluation_criteria": [
                    "Functionality: Correct numerical output and boundary edge handling (25 pts)",
                    "Query Architecture: Idiomatic CTE structure and join clarity (25 pts)",
                    "Performance: Index utilization and execution plan optimization (20 pts)",
                    "Code Quality: Clean SQL formatting and commented rationale (20 pts)",
                    "Data Integrity: Handling of NULL values and currency precision (10 pts)"
                ]
            },
            {
                "id": "chal-customer-dataset",
                "title": "Analyze a Customer Dataset with Python",
                "description": "Ingest, clean, and model customer transactional data using Python and Pandas. Deliver actionable churn indicators and high-value segment clusters.",
                "scenario": "A SaaS subscription company wants to predict which accounts are likely to churn before their annual renewal.",
                "difficulty": "INTERMEDIATE",
                "category": "Data",
                "estimated_minutes": 60,
                "skill_id": "skill-python",
                "instructions": "1. Load raw CSV data and handle missing/malformed records.\n2. Create behavioral features (login frequency, support ticket count).\n3. Generate statistical summaries and correlation matrices.\n4. Output a clean pipeline script with error logging.",
                "requirements": [
                    "Pandas data cleaning pipeline with explicit type conversions",
                    "Feature engineering for churn risk scoring",
                    "Visual output or summary report of risk distributions",
                    "Modular Python code following PEP 8 standards"
                ],
                "evaluation_criteria": [
                    "Functionality: Accurate analytical metrics and pipeline robustness (25 pts)",
                    "Insight Quality: Meaningful segment definitions and statistical rigor (25 pts)",
                    "Performance: Vectorized Pandas operations over slow loops (20 pts)",
                    "Code Quality: Docstrings, type annotations, and module structure (20 pts)",
                    "Reliability: Graceful handling of outlier values (10 pts)"
                ]
            },
            {
                "id": "chal-debug-rest-api",
                "title": "Debug a Broken REST API",
                "description": "Diagnose and resolve concurrency race conditions, memory leaks, and incorrect HTTP status codes in a high-throughput backend service.",
                "scenario": "A ticketing service is dropping reservations during flash sales. Identify the bottleneck, fix race conditions, and secure endpoints.",
                "difficulty": "INTERMEDIATE",
                "category": "Backend Development",
                "estimated_minutes": 50,
                "skill_id": "skill-node",
                "instructions": "1. Analyze route handlers for asynchronous unhandled rejections.\n2. Fix inventory decrement race condition using atomic transactions.\n3. Implement proper middleware error-handling pipeline.\n4. Add rate limiting on critical checkout endpoints.",
                "requirements": [
                    "Atomic reservation lock preventing overselling",
                    "Standardized JSON error envelope across all routes",
                    "Input validation schemas using Joi or Zod",
                    "Automated integration test verifying concurrency safety"
                ],
                "evaluation_criteria": [
                    "Functionality: Zero overselling under simulated concurrent traffic (25 pts)",
                    "API Design: Proper HTTP semantics, headers, and status codes (25 pts)",
                    "Resilience: Graceful failure modes and transaction rollbacks (20 pts)",
                    "Code Quality: Clean async/await syntax and error boundaries (20 pts)",
                    "Security: Sanitization and rate limit thresholds (10 pts)"
                ]
            },
            {
                "id": "chal-wcag-accessibility",
                "title": "Make an Existing Website WCAG 2.1 AA Friendly",
                "description": "Refactor a complex web dashboard to achieve strict WCAG 2.1 AA compliance: keyboard navigation, ARIA live regions, focus trapping, and screen reader announcements.",
                "scenario": "A public sector portal must pass accessibility audits to comply with federal regulations.",
                "difficulty": "INTERMEDIATE",
                "category": "Design",
                "estimated_minutes": 60,
                "skill_id": "skill-uiux",
                "instructions": "1. Audit modal dialogs and implement modal focus traps.\n2. Ensure all forms have associated `<label>` and error description IDs.\n3. Add aria-live regions for dynamic content changes.\n4. Audit color contrast to ensure minimum 4.5:1 ratio.",
                "requirements": [
                    "Complete keyboard tab order with visible outline focus rings",
                    "Accessible modal dialog that traps and restores focus",
                    "Form validation errors announced to screen readers",
                    "No reliance on color alone to convey error states"
                ],
                "evaluation_criteria": [
                    "Functionality: Focus trapping and screen reader compatibility (25 pts)",
                    "WCAG Compliance: Zero axe-core or Lighthouse accessibility violations (25 pts)",
                    "UI/UX: Smooth visual cues for assistive technology users (20 pts)",
                    "Code Quality: Semantic DOM architecture over generic div soup (20 pts)",
                    "Testing: Inclusion of automated accessibility assertions (10 pts)"
                ]
            },
            {
                "id": "chal-react-canvas",
                "title": "Build a Real-Time Collaborative Canvas",
                "description": "Create a multi-user interactive whiteboard component in React supporting freehand drawing, geometric shapes, undo/redo state stacks, and zoom/pan.",
                "scenario": "A remote brainstorming platform requires an intuitive canvas component that renders 60fps smoothly without state bottlenecks.",
                "difficulty": "ADVANCED",
                "category": "Frontend Development",
                "estimated_minutes": 90,
                "skill_id": "skill-react",
                "instructions": "1. Implement custom canvas rendering with requestAnimationFrame.\n2. Build an immutable state history stack for undo and redo.\n3. Add shape toolbars (Pen, Rectangle, Circle, Text).\n4. Optimize React re-renders by decoupling pointer events from component trees.",
                "requirements": [
                    "Smooth freehand drawing with configurable stroke color and width",
                    "Undo and redo buttons with shortcut keys (Ctrl+Z, Ctrl+Y)",
                    "Canvas export as PNG or SVG",
                    "Optimized render pipeline maintaining 60fps during drawing"
                ],
                "evaluation_criteria": [
                    "Functionality: Canvas tool accuracy and history stack fidelity (25 pts)",
                    "Performance: Frame rate consistency and memory management (25 pts)",
                    "UI/UX: Responsive toolbar, tool cursor indicators, and gestures (20 pts)",
                    "Code Quality: Custom hooks, typed events, and decoupled math logic (20 pts)",
                    "Accessibility: Keyboard accessible tool selection (10 pts)"
                ]
            }
        ]

        for cd in challenges_data:
            c = Challenge(
                id=cd["id"],
                title=cd["title"],
                description=cd["description"],
                scenario=cd["scenario"],
                difficulty=cd["difficulty"],
                category=cd["category"],
                estimated_minutes=cd["estimated_minutes"],
                skill_id=cd["skill_id"],
                instructions=cd["instructions"],
                requirements=json.dumps(cd["requirements"]),
                evaluation_criteria=json.dumps(cd["evaluation_criteria"])
            )
            db.add(c)
        db.commit()

        # 5. DEMO SUBMISSIONS & EVALUATIONS FOR AARAV MEHTA
        # Sub 1: Expense Tracker (JavaScript)
        sub1 = Submission(
            id="sub-demo-1",
            student_id=student1.id,
            challenge_id="chal-expense-tracker",
            github_url="https://github.com/aarav-mehta/smart-expense-tracker",
            live_demo_url="https://smart-expenses.aarav.dev",
            explanation="Built with vanilla JavaScript using an MVC architecture. State is managed via a centralized reactive store with observer subscriptions. Used localStorage with JSON validation. Chart.js was integrated for categorical breakdown. Added WCAG compliant form inputs and CSS grid layout.",
            status="EVALUATED",
            score=86,
            submitted_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(sub1)
        db.commit()

        eval1 = Evaluation(
            id="eval-demo-1",
            submission_id=sub1.id,
            functionality_score=23,
            uiux_score=22,
            responsiveness_score=18,
            code_quality_score=16,
            accessibility_score=7,
            total_score=86,
            ai_feedback="Solid client-side architecture using clean MVC separation. The dynamic recalculation of balances operates reliably without race conditions. LocalStorage sync is handled gracefully with fallback guards.",
            strengths=json.dumps([
                "Clean observer-based state management without external bloat",
                "Interactive categorical breakdowns with dynamic color badges",
                "Deployed live demo confirms high responsive fluidity across viewports"
            ]),
            weaknesses=json.dumps([
                "Missing ARIA live region on real-time balance update",
                "Transaction filter could benefit from debounced search"
            ]),
            recommendations=json.dumps([
                "Add keyboard focus indicators for the delete action buttons",
                "Implement automated unit tests for monetary calculation edge cases"
            ]),
            evaluation_provider="ai",
            created_at=datetime.utcnow() - timedelta(days=2)
        )
        db.add(eval1)

        # Sub 2: Event Registration (HTML/CSS)
        sub2 = Submission(
            id="sub-demo-2",
            student_id=student1.id,
            challenge_id="chal-event-registration",
            github_url="https://github.com/aarav-mehta/dev-summit-registration",
            live_demo_url="https://dev-summit.aarav.dev",
            explanation="Engineered mobile-first semantic HTML5 layout with CSS custom properties. Implemented multi-tier ticket card grid with hover micro-interactions. Rigorous focus outlines and automated contrast checks passed at 7.2:1 ratio.",
            status="EVALUATED",
            score=91,
            submitted_at=datetime.utcnow() - timedelta(days=5)
        )
        db.add(sub2)
        db.commit()

        eval2 = Evaluation(
            id="eval-demo-2",
            submission_id=sub2.id,
            functionality_score=24,
            uiux_score=24,
            responsiveness_score=19,
            code_quality_score=16,
            accessibility_score=8,
            total_score=91,
            ai_feedback="Exceptional execution of modern frontend fundamentals. Semantic structure is pristine with flawless mobile scaling and zero layout shifts.",
            strengths=json.dumps([
                "Strict semantic markup utilizing header, main, section, and fieldset",
                "Mobile-first responsive design utilizing modern clamp() fluid typography",
                "Clear high-contrast visual hierarchy"
            ]),
            weaknesses=json.dumps([
                "Form submission feedback could incorporate animated confirmation modal"
            ]),
            recommendations=json.dumps([
                "Add subtle entrance animations for ticket cards when scrolled into view"
            ]),
            evaluation_provider="ai",
            created_at=datetime.utcnow() - timedelta(days=5)
        )
        db.add(eval2)

        # 6. SKILL EVIDENCE FOR DEMO STUDENTS
        # Aarav Mehta
        ev1 = SkillEvidence(
            student_id=student1.id,
            skill_id="skill-html-css",
            score=91,
            demonstrated=True,
            challenge_count=4,
            project_count=3,
            verified_at=datetime.utcnow() - timedelta(days=5)
        )
        ev2 = SkillEvidence(
            student_id=student1.id,
            skill_id="skill-js",
            score=86,
            demonstrated=True,
            challenge_count=3,
            project_count=2,
            verified_at=datetime.utcnow() - timedelta(days=2)
        )
        ev3 = SkillEvidence(
            student_id=student1.id,
            skill_id="skill-sql",
            score=88,
            demonstrated=True,
            challenge_count=2,
            project_count=1,
            verified_at=datetime.utcnow() - timedelta(days=10)
        )
        ev4 = SkillEvidence(
            student_id=student1.id,
            skill_id="skill-python",
            score=79,
            demonstrated=True,
            challenge_count=1,
            project_count=1,
            verified_at=datetime.utcnow() - timedelta(days=15)
        )

        # Priya Sharma
        ev5 = SkillEvidence(
            student_id=student2.id,
            skill_id="skill-python",
            score=94,
            demonstrated=True,
            challenge_count=4,
            project_count=3,
            verified_at=datetime.utcnow() - timedelta(days=3)
        )
        ev6 = SkillEvidence(
            student_id=student2.id,
            skill_id="skill-sql",
            score=91,
            demonstrated=True,
            challenge_count=3,
            project_count=2,
            verified_at=datetime.utcnow() - timedelta(days=7)
        )
        ev7 = SkillEvidence(
            student_id=student2.id,
            skill_id="skill-data-analysis",
            score=89,
            demonstrated=True,
            challenge_count=2,
            project_count=2,
            verified_at=datetime.utcnow() - timedelta(days=12)
        )

        # Marcus Chen
        ev8 = SkillEvidence(
            student_id=student3.id,
            skill_id="skill-node",
            score=93,
            demonstrated=True,
            challenge_count=5,
            project_count=4,
            verified_at=datetime.utcnow() - timedelta(days=1)
        )
        ev9 = SkillEvidence(
            student_id=student3.id,
            skill_id="skill-sql",
            score=95,
            demonstrated=True,
            challenge_count=4,
            project_count=3,
            verified_at=datetime.utcnow() - timedelta(days=4)
        )
        ev10 = SkillEvidence(
            student_id=student3.id,
            skill_id="skill-docker",
            score=87,
            demonstrated=True,
            challenge_count=2,
            project_count=2,
            verified_at=datetime.utcnow() - timedelta(days=8)
        )

        db.add_all([ev1, ev2, ev3, ev4, ev5, ev6, ev7, ev8, ev9, ev10])
        db.commit()

        # 7. PROJECTS
        p1 = Project(
            student_id=student1.id,
            title="Realtime Canvas Whiteboard",
            description="Collaborative drawing canvas built with React, WebSockets, and HTML5 Canvas API. Supports multi-user cursor tracking.",
            github_url="https://github.com/aarav-mehta/collab-canvas",
            live_demo_url="https://canvas.aarav.dev",
            technologies="React, WebSockets, Canvas API, TypeScript"
        )
        p2 = Project(
            student_id=student1.id,
            title="Postgres Index Performance Visualizer",
            description="CLI and Web dashboard that inspects EXPLAIN ANALYZE queries and recommends optimal composite indexing strategies.",
            github_url="https://github.com/aarav-mehta/pg-optimizer",
            live_demo_url="https://pgopt.aarav.dev",
            technologies="Node.js, PostgreSQL, React, Chart.js"
        )
        p3 = Project(
            student_id=student2.id,
            title="Automated Customer Churn Predictor",
            description="Production ETL pipeline predicting customer churn using Random Forest models and visual feature importance graphs.",
            github_url="https://github.com/priya-sharma/churn-predictor",
            live_demo_url="https://churn.priya.dev",
            technologies="Python, Pandas, Scikit-Learn, FastAPI"
        )
        p4 = Project(
            student_id=student3.id,
            title="Distributed Task Queue & Scheduler",
            description="High throughput worker daemon with Redis streams, exponential backoff retries, and dead letter queue routing.",
            github_url="https://github.com/marcus-chen/distributed-task-worker",
            live_demo_url="https://queue.marcus.dev",
            technologies="Node.js, Redis, Docker, PostgreSQL"
        )
        db.add_all([p1, p2, p3, p4])
        db.commit()

        # 8. BADGES FOR STUDENTS
        sb1 = StudentBadge(student_id=student1.id, badge_id="badge-first-proof")
        sb2 = StudentBadge(student_id=student1.id, badge_id="badge-problem-solver")
        sb3 = StudentBadge(student_id=student1.id, badge_id="badge-frontend-verified")
        sb4 = StudentBadge(student_id=student2.id, badge_id="badge-first-proof")
        sb5 = StudentBadge(student_id=student3.id, badge_id="badge-first-proof")
        sb6 = StudentBadge(student_id=student3.id, badge_id="badge-clean-code")
        db.add_all([sb1, sb2, sb3, sb4, sb5, sb6])
        db.commit()

        # 9. NOTIFICATIONS FOR DEMO STUDENT
        n1 = Notification(
            user_id=student1.id,
            title="Challenge Evaluated: JavaScript",
            message="Your submission for 'Build an Interactive Expense Tracker' received a verified score of 86/100! Your JavaScript skill is now demonstrated.",
            type="EVALUATION",
            read=False
        )
        n2 = Notification(
            user_id=student1.id,
            title="New Badge Unlocked: Problem Solver",
            message="You have completed 3 practical engineering challenges and unlocked the 'Problem Solver' badge!",
            type="BADGE",
            read=False
        )
        n3 = Notification(
            user_id=student1.id,
            title="Welcome to SkillProof",
            message="Welcome to SkillProof. Prove what you can do through practical challenges evaluated by AI.",
            type="SYSTEM",
            read=True
        )
        db.add_all([n1, n2, n3])
        db.commit()

        logger.info("Database seeding successfully completed!")
    except Exception as e:
        db.rollback()
        logger.error(f"Error in seed_database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
